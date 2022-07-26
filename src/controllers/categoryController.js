const categoryService = require('../services/categoryService');

const add = async (req, res, next) => {
  try {
 const { name } = req.body;
  const response = await categoryService.add(name);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(201).json(response.dataValues);
} catch (e) {
  next(e);
}
};

const getAll = async (_req, res, next) => {
  try {
    const categories = await categoryService.getAll();
  return res.status(200).json(categories);
} catch (e) {
  next(e);
}
};

module.exports = {
  add,
  getAll,
};