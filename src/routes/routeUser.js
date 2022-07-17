const express = require('express');
const userController = require('../controllers/userController');
const tokenValidate = require('../middlewares/tokenValidate');

const router = express.Router();

router.post('/', userController.add);
router.use('/', tokenValidate);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

module.exports = router;