const pool = require('../config/database');

class User {
  static async create(username, email, password, avatarUrl = null) {
    const query = `
      INSERT INTO users (username, email, password, avatar_url, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    try {
      const result = await pool.execute(query, [username, email, password, avatarUrl]);
      return result;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = `SELECT id, username, display_name, email, avatar_url, bio, location, link, anniversary, followers, following, created_at FROM users WHERE id = ?`;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      return null;
    }
  }

  static async findByUsername(username) {
    const query = `SELECT id, username, display_name, email, avatar_url, bio, location, link, anniversary, followers, following FROM users WHERE username = ?`;
    try {
      const result = await pool.query(query, [username]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por username:', error);
      return null;
    }
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  }

  static async updateProfile(userId, { displayName, username, bio, location, link, anniversary, avatarUrl }) {
    const query = `
      UPDATE users 
      SET display_name = ?, username = ?, bio = ?, location = ?, link = ?, anniversary = ?, avatar_url = ? 
      WHERE id = ?
    `;
    try {
      await pool.execute(query, [displayName || '', username || '', bio || '', location || '', link || '', anniversary || null, avatarUrl || '', userId]);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  static async updateAvatar(userId, avatarUrl) {
    const query = `UPDATE users SET avatar_url = ? WHERE id = ?`;
    try {
      await pool.execute(query, [avatarUrl, userId]);
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      throw error;
    }
  }

  static async getFollowers(userId, limit = 50) {
    const query = `
      SELECT u.id, u.username, u.avatar_url 
      FROM users u
      JOIN followers f ON u.id = f.follower_id
      WHERE f.user_id = ? LIMIT ?
    `;
    try {
      const result = await pool.query(query, [userId, limit]);
      return result.rows || [];
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
      return [];
    }
  }

  static async addFollower(userId, followerId) {
    const query = `INSERT INTO followers (user_id, follower_id) VALUES (?, ?)`;
    try {
      await pool.execute(query, [userId, followerId]);
    } catch (error) {
      console.error('Erro ao adicionar seguidor:', error);
      throw error;
    }
  }

  static async removeFollower(userId, followerId) {
    const query = `DELETE FROM followers WHERE user_id = ? AND follower_id = ?`;
    try {
      await pool.execute(query, [userId, followerId]);
    } catch (error) {
      console.error('Erro ao remover seguidor:', error);
      throw error;
    }
  }
}

module.exports = User;
