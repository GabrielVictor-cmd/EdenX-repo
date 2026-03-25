const express = require('express');
const reelController = require('../controllers/reelController');
const auth = require('../middleware/auth');

const router = express.Router();

// Reels
router.post('/', auth, reelController.uploadMulter, reelController.createReel);
router.get('/', reelController.getReels);
router.get('/user/:userId', reelController.getReelsByUser);
router.get('/:reelId', reelController.getReel);

// Curtidas
router.post('/:reelId/like', auth, reelController.likeReel);
router.delete('/:reelId/like', auth, reelController.unlikeReel);

module.exports = router;
