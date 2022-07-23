const express = require('express');
const userController = require('../controllers/userController');
const tokenValidate = require('../middlewares/tokenValidate');
// const errorMiddleware = require('../middlewares/errorMiddleware');

const router = express.Router();

router.post('/', userController.add);
router.use('/', tokenValidate);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.delete('/me', userController.deleteUser);
// router.use(errorMiddleware);

module.exports = router;