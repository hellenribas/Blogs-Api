const categoryService = require('../services/categoryService');

const add = async (req, res) => {
  try {
 const { name } = req.body;
  const response = await categoryService.add(name);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(201).json(response.dataValues);
} catch (e) {
  // next(e);
  console.log(e);
}
};

const getAll = async (_req, res) => {
  try {
    const categories = await categoryService.getAll();
  return res.status(200).json(categories);
} catch (e) {
  // next(e);
  console.log(e);
}
};

module.exports = {
  add,
  getAll,
};