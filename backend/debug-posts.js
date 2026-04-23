const db = require('./config/database');
const path = require('path');
const fs = require('fs');

async function debugPosts() {
  console.log('🔍 Debugging Posts...\n');

  try {
    // 1. Verificar posts no banco
    const postsResult = await db.query(`
      SELECT p.id, p.user_id, p.caption, p.image_url, p.created_at, u.username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    
    const posts = postsResult.rows || postsResult || [];

    console.log('📋 Posts no banco de dados:');
    if (posts.length === 0) {
      console.log('  ℹ️ Nenhum post encontrado');
    } else {
      posts.forEach((post, idx) => {
        console.log(`\n  Post ${idx + 1}:`);
        console.log(`    ID: ${post.id}`);
        console.log(`    Usuário: ${post.username}`);
        console.log(`    Legenda: ${post.caption || '(vazio)'}`);
        console.log(`    image_url: ${post.image_url || '(nulo)'}`);
        console.log(`    Criado: ${post.created_at}`);

        // Verificar se arquivo existe
        if (post.image_url) {
          const filePath = path.join(__dirname, post.image_url);
          const exists = fs.existsSync(filePath);
          console.log(`    ✓ Arquivo no servidor: ${exists ? 'SIM ✓' : 'NÃO ✗'}`);
        }
      });
    }

    // 2. Verificar arquivos em /uploads/posts
    console.log('\n\n📁 Arquivos em /uploads/posts:');
    const uploadsDir = path.join(__dirname, 'uploads', 'posts');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`  Total: ${files.length} arquivo(s)`);
      files.forEach(file => {
        console.log(`    - ${file}`);
      });
    } else {
      console.log('  ℹ️ Diretório não existe');
    }

    // 3. Verificar tabela posts
    const countResult = await db.query('SELECT COUNT(*) as count FROM posts');
    const countRows = countResult.rows || countResult || [];
    const count = countRows[0]?.count || 0;
    console.log(`\n📊 Total de posts no banco: ${count}`);

    // 4. Verificar posts SEM image_url
    const withoutImageResult = await db.query(`
      SELECT id, user_id, caption FROM posts
      WHERE image_url IS NULL OR image_url = ''
      LIMIT 3
    `);
    const postsWithoutImage = withoutImageResult.rows || withoutImageResult || [];

    if (postsWithoutImage.length > 0) {
      console.log(`\n⚠️ Posts SEM imagem (${postsWithoutImage.length}):`);
      postsWithoutImage.forEach(post => {
        console.log(`    - ID: ${post.id}, Legenda: "${post.caption || '(vazio)'}"`);
      });
    } else {
      console.log('\n✓ Todos os posts têm imagem_url preenchida');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  process.exit(0);
}

debugPosts();
