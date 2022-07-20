const express = require('express');
const postController = require('../controllers/postController');
const tokenValidate = require('../middlewares/tokenValidate');

const router = express.Router();

router.use('/', tokenValidate);
router.post('/', postController.add);
router.get('/', postController.getAll);
router.get('/:id', postController.getId);
router.put('/:id', postController.updatedId);

module.exports = router;