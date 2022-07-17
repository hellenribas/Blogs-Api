const categoryService = require('../services/categoryService');

const add = async (req, res) => {
  const { name } = req.body;
  const response = await categoryService.add(name);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(201).json(response.dataValues);
};

module.exports = {
  add,
};