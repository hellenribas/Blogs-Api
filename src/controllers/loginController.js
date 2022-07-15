const loginService = require('../services/loginService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await loginService.login(email, password);
    if (response.message) {
      return res.status(response.status).json({ message: response.message });
    }
    return res.status(response.status).json({ token: response.token });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  login,
};