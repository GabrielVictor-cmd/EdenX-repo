const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// Mensagens
router.post('/', auth, messageController.sendMessage);
router.get('/conversation/:otherUserId', auth, messageController.getConversation);
router.get('/list', auth, messageController.getUserConversations);

// Status de leitura
router.put('/:senderId/read', auth, messageController.markAsRead);
router.get('/unread/count', auth, messageController.getUnreadCount);

module.exports = router;
