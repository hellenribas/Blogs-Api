const express = require('express');
// const errorMiddleware = require('../middlewares/errorMiddleware');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/', loginController.login);
module.exports = router;