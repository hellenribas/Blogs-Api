const Joi = require('joi');
const { Category } = require('../database/models/index');

const validate = ({ name }) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

const { error, value } = schema.validate({ name });
if (error) {
  return { status: 400, message: error.details[0].message };
}
return value;
};

const add = async (name) => {
  try {
     const validateUser = validate({ name });
     if (validateUser.message) {
       return validateUser;
     }
     const category = await Category.create({ name });
     return category;
  } catch (e) {
     console.log(e);
  }
 };

module.exports = {
  add,
};