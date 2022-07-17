const Joi = require('joi');
const { User } = require('../database/models/index');
const generate = require('../utils/token');

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

const getUser = async (id) => {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    return user;
};

module.exports = {
  add,
  getUser,
};