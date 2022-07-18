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
    const posts = await postService.getAll();
    return res.status(200).json(posts);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAll,
  add,
};