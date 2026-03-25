const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, message } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ message: 'Destinatário e mensagem são obrigatórios' });
    }

    const messageId = await Message.create(senderId, recipientId, message);

    res.status(201).json({
      message: 'Mensagem enviada',
      messageId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.getConversation(
      userId,
      otherUserId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar conversa' });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const conversations = await Message.getUserConversations(userId, parseInt(limit));

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar conversas' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { senderId } = req.params;

    await Message.markAsRead(userId, senderId);

    res.json({ message: 'Mensagens marcadas como lidas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao marcar mensagens como lidas' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.getUnreadCount(userId);

    res.json({ unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao contar mensagens não lidas' });
  }
};
