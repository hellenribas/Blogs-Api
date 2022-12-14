const Joi = require('joi');
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const config = require('../database/config/config');
const tokenValid = require('../utils/token');

const sequelize = new Sequelize(config.development);
const { BlogPost, User, PostCategory, Category } = require('../database/models/index');

const validate = ({ title, content, categoryIds }) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    categoryIds: Joi.array().min(1).required(),
  });
  const { error, value } = schema.validate({ title, content, categoryIds });
  if (error) {
    return { status: 400, message: 'Some required fields are missing' };
  }
  return value;
};

const categoryValidate = async (array) => {
  const categoryId = await Category.findAll();
  const response = categoryId.map((el) => el.dataValues.id).some((e) => !array.includes(e));
  if (!Array.isArray(array) || array.length === 0 || response) {
    return {
        status: 400,
        message: '"categoryIds" not found',
      }; 
  }
  return true;
};

const add = async (post, email) => {
  const t = await sequelize.transaction();
  try {
    const validated = validate(post);
    const validateCategory = await categoryValidate(post.categoryIds);
    if (validated.message) return validated;
   if (validateCategory.message) return validateCategory;
  const { dataValues } = await User.findOne({ where: { email } }, { transaction: t });
   const insertPost = await BlogPost.create(
    { title: validated.title, content: validated.content, userId: dataValues.id },
     { transaction: t },
);
   await Promise.all(post.categoryIds
    .map((e) => PostCategory.create({ postId: insertPost.id, categoryId: e }, { transaction: t })));
   await t.commit();
   return insertPost.dataValues;
 } catch (e) {
  await t.rollback();
 }
};

const getAll = async () => {
  try {
    const posts = await BlogPost.findAll(
      {
        include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories' },
      ],
      },
    );
    
    return posts.map((e) => e.dataValues);
  } catch (e) {
    console.log(e);
  }
};

const getId = async (id) => {
  try {
    const post = await await BlogPost.findOne(
      {
        include: [
        { model: User, as: 'user', where: { id }, attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories' },
      ],
      },
    );
    return post;
  } catch (e) {
    console.log(e);
  }
};

const validateUpdate = (id, title, content) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
  });
  const { error, value } = schema.validate({ id, title, content });
  if (error) {
    return { status: 400, message: 'Some required fields are missing' };
  }
  return value;
};

const verifyUser = async (id, title, content, token) => {
  const response = validateUpdate(id, title, content);
  if (response.message) return response;
  const user = await User.findOne({ where: { id } });
  const decode = tokenValid.decoded(token.authorization);
  if (!user || decode.email !== user.dataValues.email) {
    return { status: 401, message: 'Unauthorized user' };
  }
  return true;
};

const updatedId = async (id, { title, content }, token) => {
  const t = await sequelize.transaction();
  try {
    const verify = await verifyUser(id, title, content, token);
    if (verify.message) return verify;
    await BlogPost.update({ title, content }, { where: { id }, transaction: t });
    const post = await BlogPost.findOne({ where: { id },
        include: [
        { model: User, as: 'user', where: { id }, attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
      transaction: t,
    });
    await t.commit();
    return post;
  } catch (e) {
    await t.rollback();
    console.log(e);
  }
};

const verifyDelete = async (id, token) => {
  const { email } = tokenValid.decoded(token.authorization);
  const user = await User.findOne({ where: { email }, attributes: ['id'] });
  const postIdentify = await BlogPost.findOne({ where: { id }, attributes: ['userId'] });
  if (user.dataValues.id !== postIdentify.dataValues.userId) {
    return { status: 401, message: 'Unauthorized user' };
  }

  return true;
};

const deleteId = async (id, token) => {
  const t = await sequelize.transaction();
  try {
    const post = await BlogPost.findOne({ where: { id },
      transaction: t,
    });
    if (!post) {
      return { status: 404, message: 'Post does not exist' };
    }
    const verify = await verifyDelete(post.dataValues.id, token);
    if (verify.message) return verify;
    await BlogPost.destroy({ where: { id }, transaction: t });
    await t.commit();
    return true;
  } catch (e) {
    await t.rollback();
    console.log(e);
  }
};

const getParam = async (param) => {
  const post = await BlogPost
  .findAll({
    where: { [Op.or]: [{ title: { [Op.like]: `%${param}%` } }, 
        { content: { [Op.like]: `%${param}%` } }] }, 
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }, 
    { model: Category, as: 'categories' },
    ],
  });
  return post;
};

module.exports = {
  getAll,
  add,
  getId,
  updatedId,
  deleteId,
  getParam,
};