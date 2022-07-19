const Joi = require('joi');
const Sequelize = require('sequelize');
const config = require('../database/config/config');

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
  //  console.log(insertPost);
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
  const post = await await BlogPost.findOne(
    {
      include: [
      { model: User, as: 'user', where: { id }, attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
    },
  );
  return post;
};

module.exports = {
  getAll,
  add,
  getId,
};