const fs = require('fs');
const path = require('path');

// Verificar se a pasta uploads existe
const uploadDir = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Pasta uploads/avatars criada');
} else {
  console.log('Pasta uploads/avatars já existe');
}

// Listar arquivos na pasta
fs.readdir(uploadDir, (err, files) => {
  if (err) {
    console.error('Erro ao listar arquivos:', err);
  } else {
    console.log('Arquivos na pasta uploads/avatars:', files);
  }
});