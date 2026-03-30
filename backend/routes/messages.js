const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'messages');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `message-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: mediaStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens e vídeos são permitidos'));
    }
  }
});

const router = express.Router();

// Mensagens
router.post('/', auth, messageController.sendMessage);
router.post('/upload', auth, upload.single('media'), messageController.uploadMessageMedia);
router.get('/conversation/:otherUserId', auth, messageController.getConversation);
router.get('/list', auth, messageController.getUserConversations);

// Status de leitura
router.put('/:senderId/read', auth, messageController.markAsRead);
router.get('/unread/count', auth, messageController.getUnreadCount);

module.exports = router;
