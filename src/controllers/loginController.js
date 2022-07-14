const loginService = require('../services/loginService');

const login = async (req, res) => {
  const { email, password } = req.body;

  const response = await loginService.login(email, password);
  if (response.message) {
    return res.status(response.status).json({ message: response.message });
  }
  return res.status(response.status).json({ token: response.token });
};

module.exports = {
  login,
};