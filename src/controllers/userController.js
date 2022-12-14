const userService = require('../services/userService');

const add = async (req, res, next) => {
  try {
    const user = await userService.add(req.body);
    if (user.message) {
    return res.status(user.status).json({ message: user.message });
    }
    return res.status(201).json({ token: user });
  } catch (e) {
    next(e);
  }
};

const getUsers = async (_req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json(users);
  } catch (e) {
    next(e);
  }
}; 

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUser(id);
    if (!user) {
      return res.status(404).json({
        message: 'User does not exist',
      });
    }
    return res.status(200).json(user.dataValues);
  } catch (e) {
    next(e);
  }
}; 

const deleteUser = async (req, res) => {
  const token = req.headers;
  await userService.deleteUser(token);
  return res.status(204).end();
};

module.exports = {
  add,
  getUsers,
  getUser,
  deleteUser,
};