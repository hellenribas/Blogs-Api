const postService = require('../services/postService');
const decoToken = require('../utils/token');

const add = async (req, res) => {
  try {
    const token = req.headers.authorization; 
    const { email } = decoToken.decoded(token);
    const post = req.body;
    const response = await postService.add(post, email);
    if (response.message) {
      return res.status(response.status).json({ message: response.message });
    }
    return res.status(201).json(response);
  } catch (e) {
    // next(e);
    console.log(e);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await postService.getAll();
    return res.status(200).json(response);
  } catch (e) {
    // next(e);
    console.log(e);
  }
};

const getId = async (req, res) => {
  try {
    const { id } = req.params;
  const response = await postService.getId(id);
  if (!response) {
    return res.status(404).json({
      message: 'Post does not exist',
    }); 
  }
  return res.status(200).json(response);
} catch (e) {
  // next(e);
  console.log(e);
}
};

const updatedId = async (req, res) => {
  try {
    const { id } = req.params;
  const token = req.headers;
  const content = req.body;
  const response = await postService.updatedId(id, content, token);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(200).json(response);
} catch (e) {
  // next(e);
  console.log(e);
}
};

const deleteId = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers;
    const response = await postService.deleteId(id, token);
    if (response.message) {
      return res.status(response.status).json({ message: response.message });
    }
    return res.status(204).end();
  } catch (e) {
    console.log(e);
    // next(e);
  }
};

module.exports = {
  getAll,
  add,
  getId,
  updatedId,
  deleteId,
};