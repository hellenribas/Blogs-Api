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

module.exports = {
  add,
  getUsers,
};