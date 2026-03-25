const Reel = require('../models/Reel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/reels';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'reel-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

exports.createReel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { caption, thumbnail_url } = req.body;
    let videoUrl = req.body.video_url;

    if (req.file) {
      videoUrl = `/uploads/reels/${req.file.filename}`;
    }

    const reelId = await Reel.create(userId, videoUrl, caption, thumbnail_url);

    res.status(201).json({
      message: 'Reel criado com sucesso',
      reelId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar reel' });
  }
};

exports.getReels = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const reels = await Reel.getReels(parseInt(limit), parseInt(offset));

    res.json(reels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar reels' });
  }
};

exports.getReelsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const reels = await Reel.getReelsByUser(userId, parseInt(limit), parseInt(offset));

    res.json(reels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar reels do usuário' });
  }
};

exports.getReel = async (req, res) => {
  try {
    const { reelId } = req.params;

    const reel = await Reel.getReel(reelId);

    if (!reel) {
      return res.status(404).json({ message: 'Reel não encontrado' });
    }

    res.json(reel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reel' });
  }
};

exports.likeReel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reelId } = req.params;

    const success = await Reel.likeReel(reelId, userId);

    if (success) {
      res.json({ message: 'Reel curtido' });
    } else {
      res.status(400).json({ message: 'Você já curtiu este reel' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao curtir reel' });
  }
};

exports.unlikeReel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reelId } = req.params;

    await Reel.unlikeReel(reelId, userId);

    res.json({ message: 'Curtida removida' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover curtida' });
  }
};

exports.uploadMulter = upload.single('video');
