const userService = require('../services/userService');

const add = async (req, res) => {
  try {
    const user = await userService.add(req.body);
    if (user.message) {
    return res.status(user.status).json({ message: user.message });
    }
    return res.status(201).json({ token: user });
  } catch (e) {
    console.log(e);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
  }
}; 

const getUser = async (req, res) => {
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
    console.log(e);
  }
}; 

module.exports = {
  add,
  getUsers,
  getUser,
};