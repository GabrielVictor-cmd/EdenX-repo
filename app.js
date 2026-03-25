// ====================================================
// SISTEMA DE LAZY LOADING PARA REELS
// ====================================================

class LazyLoadManager {
  constructor(containerId, itemSelector, loadMoreFn, initialLoad = 20) {
    this.container = document.getElementById(containerId);
    this.itemSelector = itemSelector;
    this.loadMoreFn = loadMoreFn;
    this.offset = 0;
    this.limit = initialLoad;
    this.isLoading = false;
    this.hasMore = true;

    if (this.container) {
      this.container.addEventListener('scroll', () => this.handleScroll());
    }
  }

  handleScroll() {
    if (!this.hasMore || this.isLoading) return;

    const scrollPercentage = (this.container.scrollTop + this.container.clientHeight) / this.container.scrollHeight;
    
    if (scrollPercentage > 0.8) {
      this.loadMore();
    }
  }

  async loadMore() {
    this.isLoading = true;
    
    const result = await this.loadMoreFn(this.limit, this.offset);
    
    if (result && result.data && result.data.length > 0) {
      this.offset += result.data.length;
      this.render(result.data);
    } else {
      this.hasMore = false;
    }

    this.isLoading = false;
  }

  render(items) {
    items.forEach(item => {
      const element = this.createItemElement(item);
      this.container.appendChild(element);
    });
  }

  createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'reel-video dark-box';
    div.innerHTML = `
      <div class="reel-content">
        <img src="${item.thumbnail_url || item.video_url}" alt="Reel" loading="lazy">
        <div class="reel-overlay">
          <h3>@${item.username}</h3>
          <p>${item.caption || 'Confira este reel!'}</p>
        </div>
      </div>
      <div class="reel-sidebar">
        <i class="fa-${item.likes_count > 0 ? 'solid' : 'regular'} fa-heart" onclick="likeReelUI(${item.id}, this)" title="Curtir"></i>
        <span style="font-size: 0.8rem; color: var(--text-gray);">${item.likes_count || 0}</span>
        <i class="fa-regular fa-comment" onclick="commentReelUI(${item.id})" title="Comentar"></i>
        <i class="fa-regular fa-share" onclick="shareReelUI(${item.id})" title="Compartilhar"></i>
      </div>
    `;
    return div;
  }
}

let reelsLazyLoader = null;

// ====================================================
// INITIALIZATION - CARREGA NA PÁGINA
// ====================================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 EdenX loading...');

  // Verificar autenticação
  if (!SESSION.isAuthenticated) {
    console.log('ℹ Usuário não autenticado. Redirecionando para login...');
    window.location.href = 'login/index.html';
    return;
  } else {
    console.log(`✓ Autenticado como: ${SESSION.username}`);
  }

  // Inicializar reels com lazy loading
  initializeReelsLazyLoad();

  // Carregar stories
  await loadHeadStories();

  // Carregar conversa de chat
  await loadChatList();

  // Listeners para busca funcional
  setupSearchListener();

  // Listeners para stories
  setupStoriesListeners();

  // WebSocket listeners
  setupWebSocketListeners();
});

// ====================================================
// REELS COM LAZY LOADING
// ====================================================

function initializeReelsLazyLoad() {
  const reelsContainer = document.querySelector('.reels-container');
  
  if (reelsContainer) {
    // Limpar conteúdo inicial
    reelsContainer.innerHTML = '';

    reelsLazyLoader = new LazyLoadManager(
      'view-reels',
      '.reel-video',
      async (limit, offset) => {
        const result = await getReels(limit, offset);
        return result;
      },
      20
    );

    // Carregar reels iniciais
    reelsLazyLoader.loadMore();
  }
}

async function likeReelUI(reelId, element) {
  if (!SESSION.isAuthenticated) {
    alert('Você precisa estar logado');
    return;
  }

  const result = await likeReel(reelId);
  
  if (result.success) {
    element.classList.toggle('fa-regular');
    element.classList.toggle('fa-solid');
    element.classList.toggle('active');
  }
}

function commentReelUI(reelId) {
  alert('Funcionalidade de comentários em reels em breve!');
}

function shareReelUI(reelId) {
  if (socket) {
    socket.emit('reel-shared', { reelId, userId: SESSION.userId });
  }
  alert('Reel compartilhado!');
}

// ====================================================
// STORIES FUNCIONAIS
// ====================================================

async function loadHeadStories() {
  try {
    const result = await getActiveStories();
    
    if (result.success && result.data) {
      const storiesWrapper = document.getElementById('stories-wrapper');
      storiesWrapper.innerHTML = ''; // Limpar stories demo

      // Adicionar botão para criar story próprio
      const createStoryBtn = document.createElement('div');
      createStoryBtn.className = 'story-item';
      createStoryBtn.style.cssText = 'text-align:center; cursor:pointer; position: relative;';
      createStoryBtn.innerHTML = `
        <div class="story-ring" style="background: linear-gradient(45deg, var(--cyan-primary), var(--pink-primary));">
          <div class="story-inner" style="display: flex; align-items: center; justify-content: center; background: var(--dark-bg);">
            <i class="fa-solid fa-plus" style="color: var(--cyan-primary); font-size: 1.5rem;"></i>
          </div>
        </div>
        <p style="font-size:0.65rem; margin-top:5px; color:var(--text-gray);">Seu story</p>
      `;
      
      createStoryBtn.addEventListener('click', () => openStoryUploader());
      storiesWrapper.appendChild(createStoryBtn);

      // Carregar stories ativos
      result.data.forEach(story => {
        const storyEl = document.createElement('div');
        storyEl.className = 'story-item';
        storyEl.style.cssText = 'text-align:center; cursor:pointer;';
        storyEl.innerHTML = `
          <div class="story-ring">
            <div class="story-inner">
              <img src="${story.avatar_url || 'https://i.pravatar.cc/150?u=' + story.username}">
            </div>
          </div>
          <p style="font-size:0.65rem; margin-top:5px; color:var(--text-gray)">${story.username}</p>
        `;

        storyEl.addEventListener('click', () => openStoryViewer(story));
        storiesWrapper.appendChild(storyEl);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar stories:', error);
  }
}

function openStoryUploader() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await createStory(null, file);
    
    if (result.success) {
      alert('Story postado com sucesso! 🎉');
      loadHeadStories(); // Recarregar stories
    } else {
      alert('Erro ao postar story');
    }
  });

  input.click();
}

function openStoryViewer(story) {
  const modal = document.createElement('div');
  modal.className = 'story-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="position: relative; width: 100%; max-width: 400px; height: 100vh; max-height: 100vh;">
      <img src="${story.image_url}" alt="Story" style="width: 100%; height: 100%; object-fit: contain;">
      <button onclick="this.parentElement.parentElement.remove()" style="
        position: absolute; top: 20px; right: 20px;
        background: rgba(0,0,0,0.5); border: none;
        color: white; font-size: 1.5rem;
        cursor: pointer; padding: 10px 15px; border-radius: 50%;
      "><i class="fa-solid fa-xmark"></i></button>
      <div style="position: absolute; bottom: 20px; left: 20px; color: white;">
        <p><strong>@${story.username}</strong></p>
        <p style="font-size: 0.8rem; opacity: 0.8;">Postado há pouco</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Marcar como visualizado
  if (SESSION.isAuthenticated) {
    markStoryViewed(story.id);
  }

  // Fechar ao clicar
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Fechar com ESC
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
}

function setupStoriesListeners() {
  // Auto-reload stories a cada 30 segundos
  setInterval(() => {
    loadHeadStories();
  }, 30000);
}

// ====================================================
// BUSCA FUNCIONAL
// ====================================================

function setupSearchListener() {
  const searchInput = document.getElementById('main-search');
  const searchResults = document.getElementById('search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    // Buscar usuários
    const userResult = await searchUsers(query);
    searchResults.innerHTML = '';

    if (userResult.success && Array.isArray(userResult.data)) {
      if (userResult.data.length === 0) {
        searchResults.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-gray);">Nenhum usuário encontrado.</p>';
      } else {
        userResult.data.forEach(user => {
          const userEl = document.createElement('div');
          userEl.className = 'search-item dark-box';
          userEl.style.cssText = 'padding: 10px; display:flex; align-items:center; gap:10px; cursor: pointer;';
          userEl.innerHTML = `
            <img src="${user.avatar_url || 'https://i.pravatar.cc/100?u=' + user.username}" style="width:50px; border-radius:50%">
            <div style="flex: 1;">
              <p><strong>${user.username}</strong></p>
              <p style="font-size:0.8rem; color:gray">${user.bio || 'Sem bio'}</p>
            </div>
            <button class="btn btn-outline" style="padding: 5px 15px;" onclick="followUserUI(${user.id})">
              Seguir
            </button>
          `;

          userEl.addEventListener('click', () => {
            // Abrir perfil do usuário
            console.log('Abrindo perfil de:', user.username);
          });

          searchResults.appendChild(userEl);
        });
      }
    } else if (!userResult.success) {
      searchResults.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-gray);">Erro ao buscar usuários. Tente novamente.</p>';
    }
  });
}

async function followUserUI(userId) {
  if (!SESSION.isAuthenticated) {
    alert('Você precisa estar logado');
    return;
  }

  const result = await followUser(userId);
  if (result.success) {
    alert('Seguindo usuário!');
  }
}

// ====================================================
// CHAT / MENSAGENS
// ====================================================

async function loadChatList() {
  try {
    const result = await getConversations();

    const chatList = document.getElementById('chat-list');
    if (!chatList || !result.success) return;

    chatList.innerHTML = '';

    if (result.data && result.data.length > 0) {
      result.data.forEach(conv => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
          <img src="${conv.avatar_url || 'https://i.pravatar.cc/150?u=' + conv.username}" class="chat-avatar">
          <div class="chat-info">
            <span class="user-name">${conv.username}</span>
            <span class="last-message">${conv.last_message || 'Nova conversa'}</span>
          </div>
        `;

        chatItem.onclick = () => openChat(conv.other_user_id, conv.username, conv.avatar_url);
        chatList.appendChild(chatItem);
      });
    } else {
      chatList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-gray);">Nenhuma conversa ainda</p>';
    }
  } catch (error) {
    console.error('Erro ao carregar chat list:', error);
  }
}

async function openChat(userId, username, avatarUrl) {
  document.getElementById('chat-list-container').style.display = 'none';
  const chatWindow = document.getElementById('active-chat-view');
  chatWindow.style.display = 'flex';

  document.getElementById('active-chat-name').innerText = username;
  document.getElementById('active-chat-avatar').src = avatarUrl;

  // Carregar mensagens da conversa
  const result = await getConversation(userId, 50, 0);
  const messagesArea = document.getElementById('chat-messages-area');
  messagesArea.innerHTML = '';

  if (result.success && result.data) {
    result.data.forEach(msg => {
      const isOwn = msg.sender_id === SESSION.userId;
      const msgEl = document.createElement('div');
      msgEl.className = `message-bubble ${isOwn ? 'sent' : 'received'}`;
      msgEl.textContent = msg.message_text;
      messagesArea.appendChild(msgEl);
    });

    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Armazenar ID da conversa ativa
  window.activeChatUserId = userId;
}

function closeChat() {
  document.getElementById('chat-list-container').style.display = 'block';
  document.getElementById('active-chat-view').style.display = 'none';
  window.activeChatUserId = null;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();

  if (!text || !window.activeChatUserId) return;

  if (SESSION.isAuthenticated) {
    const result = await sendMessage(window.activeChatUserId, text);
    
    if (result.success) {
      // Adicionar mensagem visualmente
      const messagesArea = document.getElementById('chat-messages-area');
      const msgEl = document.createElement('div');
      msgEl.className = 'message-bubble sent';
      msgEl.textContent = text;
      messagesArea.appendChild(msgEl);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  } else {
    // Modo demo
    const messagesArea = document.getElementById('chat-messages-area');
    const msgEl = document.createElement('div');
    msgEl.className = 'message-bubble sent';
    msgEl.textContent = text;
    messagesArea.appendChild(msgEl);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  input.value = '';
}

// ====================================================
// WEBSOCKET LISTENERS
// ====================================================

function setupWebSocketListeners() {
  window.addEventListener('new-message', (e) => {
    const { senderId, message, timestamp } = e.detail;
    console.log('Mensagem recebida (WebSocket):', message);

    // Atualizar chat se estiver aberto
    if (window.activeChatUserId === senderId) {
      const messagesArea = document.getElementById('chat-messages-area');
      const msgEl = document.createElement('div');
      msgEl.className = 'message-bubble received';
      msgEl.textContent = message;
      messagesArea.appendChild(msgEl);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    loadChatList(); // Atualizar lista
  });

  window.addEventListener('new-post', (e) => {
    console.log('Novo post criado:', e.detail);
    // Recarregar feed
  });

  window.addEventListener('new-story', (e) => {
    console.log('Novo story criado:', e.detail);
    loadHeadStories();
  });
}

// ====================================================
// PERFIL DINÂMICO
// ====================================================

async function loadUserProfile() {
  // Apenas se autenticado
  if (!SESSION.isAuthenticated) {
    return;
  }

  const result = await getProfile();

  if (result.success) {
    const user = result.data;
    
    // Atualizar SESSION
    SESSION.displayName = user.display_name;
    SESSION.username = user.username;
    SESSION.bio = user.bio;
    SESSION.location = user.location;
    SESSION.link = user.link;
    SESSION.anniversary = user.anniversary;
    SESSION.avatarUrl = user.avatar_url;
    SESSION.followers = user.followers;
    SESSION.following = user.following;
    
    // Atualizar localStorage
    localStorage.setItem('edenx_displayName', user.display_name || '');
    localStorage.setItem('edenx_username', user.username || '');
    localStorage.setItem('edenx_bio', user.bio || '');
    localStorage.setItem('edenx_location', user.location || '');
    localStorage.setItem('edenx_link', user.link || '');
    localStorage.setItem('edenx_anniversary', user.anniversary || '');
    localStorage.setItem('edenx_avatarUrl', user.avatar_url || '');
    localStorage.setItem('edenx_followers', user.followers || 0);
    localStorage.setItem('edenx_following', user.following || 0);
    
    // Atualizar HTML
    document.getElementById('profile-name').textContent = user.display_name || user.username;
    document.getElementById('profile-username').textContent = '@' + user.username;
    document.getElementById('profile-bio').textContent = user.bio || 'Sem bio';
    document.getElementById('profile-avatar').src = normalizeAvatarUrl(user.avatar_url) || 'https://i.pravatar.cc/150?u=' + user.username;
    document.getElementById('profile-followers').textContent = user.followers || 0;
    document.getElementById('profile-following').textContent = user.following || 0;
    
    // Atualizar novos campos
    const locationElem = document.getElementById('location-text');
    const linkElem = document.getElementById('link-url');
    const anniversaryElem = document.getElementById('anniversary-text');
    
    if(locationElem) locationElem.textContent = user.location || '-';
    if(linkElem) {
      linkElem.textContent = user.link ? 'Link' : '-';
      linkElem.href = user.link || '#';
    }
    if(anniversaryElem) {
      if (user.anniversary) {
        // Evita deslocamento de timezone adicionando T00:00:00
        const date = new Date(user.anniversary + 'T00:00:00');
        anniversaryElem.textContent = date.toLocaleDateString('pt-BR');
      } else {
        anniversaryElem.textContent = '-';
      }
    }
    
    // Carregar posts do perfil
    await loadProfilePosts(user.id);
  }
}

async function loadProfilePosts(userId) {
  const result = await getUserPosts(userId);

  if (result.success && result.data.length > 0) {
    const postsContainer = document.getElementById('tab-posts');
    postsContainer.innerHTML = '';

    result.data.forEach(post => {
      const postEl = document.createElement('div');
      postEl.className = 'feed-post dark-box';
      postEl.innerHTML = `
        <div class="post-header">
          <span class="username">@${SESSION.username}</span>
        </div>
        <div class="post-container">
          <div class="post-image">
            <img src="${post.image_url}" alt="Post">
          </div>
          <div class="post-info">
            <p class="post-caption"><strong>@${SESSION.username}</strong> ${post.caption}</p>
          </div>
        </div>
      `;
      postsContainer.appendChild(postEl);
    });
  }
}

console.log('✓ App.js carregado com sucesso');
