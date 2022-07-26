const loginService = require('../services/loginService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await loginService.login(email, password);
    if (response.message) {
      return res.status(response.status).json({ message: response.message });
    }
    return res.status(response.status).json({ token: response.token });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  login,
};