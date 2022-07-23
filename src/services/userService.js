const Joi = require('joi');
const Sequelize = require('sequelize');
const { User } = require('../database/models/index');
const generate = require('../utils/token');
const config = require('../database/config/config');
const tokenValid = require('../utils/token');

const sequelize = new Sequelize(config.development);

const validate = ({ displayName, email, password, image }) => {
  const schema = Joi.object({
    displayName: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    image: Joi.string().required(),
  });

const { error, value } = schema.validate({ displayName, email, password, image });
if (error) {
  return { status: 400, message: error.details[0].message };
}
return value;
};

const add = async ({ displayName, email, password, image }) => {
 try {
    const validateUser = validate({ displayName, email, password, image });
    if (validateUser.status === 400) {
      return validateUser;
    }
    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return { status: 409, message: 'User already registered' };
    }
    await User.create({ displayName, email, password, image });
    const token = generate.generateToken({ email });
    return token;
 } catch (e) {
    console.log(e);
 }
};

const getUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    return users;
  } catch (e) {
    console.log(e);
  }
};

const getUser = async (id) => {
   try {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    return user;
   } catch (e) {
    console.log(e);
   }
};

const deleteUser = async (token) => {
  const t = await sequelize.transaction();
  try {
    const { id } = tokenValid.decoded(token.authorization);
    await User.destroy({ where: { id }, transaction: t });
    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log(e);
  }
};

module.exports = {
  add,
  getUsers,
  getUser,
  deleteUser,
};