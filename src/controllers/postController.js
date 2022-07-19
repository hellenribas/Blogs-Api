const postService = require('../services/postService');
const decoToken = require('../utils/token');

const add = async (req, res) => {
  const token = req.headers.authorization; 
  const { email } = decoToken.decoded(token);
  const post = req.body;
  const response = await postService.add(post, email);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(201).json(response);
};

const getAll = async (_req, res) => {
  try {
    const response = await postService.getAll();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
};

const getId = async (req, res) => {
  const { id } = req.params;
  const response = await postService.getId(id);
  if (!response) {
    return res.status(404).json({
      message: 'Post does not exist',
    }); 
  }
  return res.status(200).json(response);
};

module.exports = {
  getAll,
  add,
  getId,
};