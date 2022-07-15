const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenValidate = (req, res) => {
  try {
    const {
      authorization,
    } = req.headers;
    const SECRET = process.env.JWT_SECRET;

    if (!authorization) {
      return res.status(401).json({
        message: 'Token not found',
      });
    }

    return jwt.verify(authorization, SECRET);
  } catch (e) {
    console.log(e);
  }
};

module.exports = tokenValidate;