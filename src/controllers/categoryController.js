const categoryService = require('../services/categoryService');

const add = async (req, res) => {
  const { name } = req.body;
  const response = await categoryService.add(name);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(201).json(response.dataValues);
};

const getAll = async (_req, res) => {
  const categories = await categoryService.getAll();
  return res.status(200).json(categories);
};

module.exports = {
  add,
  getAll,
};