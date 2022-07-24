const express = require('express');
const postController = require('../controllers/postController');
const tokenValidate = require('../middlewares/tokenValidate');
// const errorMiddleware = require('../middlewares/errorMiddleware');

const router = express.Router();
// router.use(express.json());

router.use('/', tokenValidate);
router.post('/', postController.add);
router.get('/', postController.getAll);
router.get('/search', postController.getParam);
router.get('/:id', postController.getId);
router.put('/:id', postController.updatedId);
router.delete('/:id', postController.deleteId);
// router.use(errorMiddleware);

module.exports = router;