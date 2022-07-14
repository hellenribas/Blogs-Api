const Joi = require('joi');
const { User } = require('../database/models/index');
const generate = require('../utils/token');

const validate = ({ email, password }) => {
  const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const { error, value } = schema.validate({ email, password });

if (error) return { status: 400, message: 'Some required fields are missing' };
return value;
};

const login = async (email, password) => {
  try {
    const validateUser = validate({ email, password });
    if (validateUser.message) return validateUser;
    const user = await User.findOne({ where: { email } });
    if (!user) return { status: 400, message: 'Invalid fields' };
    const token = generate.generateToken({ email });
    return { status: 200, token };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  login,
};