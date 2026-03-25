const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

// Posts
router.post('/', auth, postController.uploadMulter, postController.createPost);
router.get('/feed', auth, postController.getFeed);
router.get('/user/:userId', postController.getUserPosts);
router.get('/:postId', postController.getPost);

// Curtidas
router.post('/:postId/like', auth, postController.likePost);
router.delete('/:postId/like', auth, postController.unlikePost);

// Comentários
router.post('/:postId/comments', auth, postController.addComment);
router.get('/:postId/comments', postController.getComments);

module.exports = router;
