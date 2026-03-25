const User = require('./models/User');

async function testUpdate() {
  try {
    // Testar updateProfile
    const result = await User.updateProfile(1, {
      displayName: 'Test Display Name',
      username: 'testuser',
      bio: 'Test bio',
      location: 'Test Location',
      link: 'https://test.com',
      anniversary: '1990-01-01',
      avatarUrl: 'https://test.com/avatar.jpg'
    });
    console.log('Update successful');

    // Verificar se foi salvo
    const user = await User.findById(1);
    console.log('User after update:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpdate();