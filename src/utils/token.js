const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (object) => {
  const secret = process.env.JWT_SECRET;

  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  const token = jwt.sign(object, secret, jwtConfig);

  return token;
};

module.exports = {
  generateToken,
};