const express = require('express');
const categoryController = require('../controllers/categoryController');
const tokenValidate = require('../middlewares/tokenValidate');

const router = express.Router();

router.use('/', tokenValidate);
router.post('/', categoryController.add);
router.get('/', categoryController.getAll);

module.exports = router;