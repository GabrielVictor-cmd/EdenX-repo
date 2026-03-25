document.addEventListener('DOMContentLoaded', () => {
    const storiesWrapper = document.getElementById('stories-wrapper');
    const searchResults = document.getElementById('search-results');
    const searchInput = document.getElementById('main-search');

    // 1. Navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(item.dataset.target).classList.add('active');

            // Carregar perfil dinamicamente
            if (item.dataset.target === 'view-profile') {
                if (typeof loadUserProfile === 'function') loadUserProfile();
            }
        });
    });

    // Atualizar dados do usuário na UI (se estiver logado)
    if (typeof SESSION !== 'undefined' && SESSION.username) {
        const feedUsername = document.querySelector('.feed-post .post-header .username');
        if (feedUsername) feedUsername.textContent = `@${SESSION.username}`;

        const captionUsername = document.querySelector('.feed-post .post-caption strong');
        if (captionUsername) captionUsername.textContent = `@${SESSION.username}`;

        if (avatarImg && SESSION.avatarUrl) {
            avatarImg.src = SESSION.avatarUrl;
        }

        const commentAvatar = document.querySelector('.input-avatar');
        if (commentAvatar && SESSION.avatarUrl) {
            commentAvatar.src = SESSION.avatarUrl;
        }

        // Atualizar avatar no feed de criação de posts
        const feedUserAvatar = document.getElementById('feed-user-avatar');
        if (feedUserAvatar && SESSION.avatarUrl) {
            feedUserAvatar.src = SESSION.avatarUrl;
        }
    }

    // 2. Stories (mantém o histórico de stories, incluindo sua própria criação)
    const storiesData = [
        {
            id: 'story-you',
            username: currentUser.username.replace('@', ''),
            avatar: currentUser.avatarUrl,
            image: '',
            caption: 'Toque para adicionar uma story',
            isYou: true,
            timestamp: ''
        },
        { id: 'story-1', username: 'neon_nina', avatar: 'https://i.pravatar.cc/150?u=neon_nina', image: 'https://picsum.photos/330/330?random=5', caption: 'Noite na cidade', timestamp: '2h' },
        { id: 'story-2', username: 'cyber_punk', avatar: 'https://i.pravatar.cc/150?u=cyber_punk', image: 'https://picsum.photos/330/330?random=6', caption: 'Trilha futurista', timestamp: '4h' }
    ];

    function renderStories() {
        if (!storiesWrapper) return;
        storiesWrapper.innerHTML = '';

        storiesData.forEach(story => {
            const storyEl = document.createElement('div');
            storyEl.className = 'story-item';
            storyEl.innerHTML = `
                <div class="story-ring">
                    <div class="story-inner">
                        <img src="${story.avatar}" alt="${story.username}" />
                        ${story.isYou ? '<div class="story-add-icon"><i class="fa-solid fa-plus"></i></div>' : ''}
                    </div>
                </div>
                <p>${story.isYou ? 'Você' : story.username}</p>
            `;

            storyEl.addEventListener('click', () => {
                if (story.isYou) {
                    openStoryPostModal();
                } else {
                    openStoryModal(story);
                }
            });

            storiesWrapper.appendChild(storyEl);
        });
    }

    function openStoryModal(story) {
        const existing = document.querySelector('.story-interactive-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'story-interactive-modal';
        modal.innerHTML = `
            <div class="story-wrapper">
                <div class="story-progress-container">
                    <div class="story-progress-bar"></div>
                </div>
                <div class="story-header-info">
                    <div class="story-user">
                        <img src="${story.avatar}" alt="${story.username}" />
                        <div>
                            <div><strong>@${story.username}</strong></div>
                            <div class="time">${story.timestamp || 'Agora'}</div>
                        </div>
                    </div>
                    <i class="fa-solid fa-xmark close-btn" onclick="closeStoryModal()"></i>
                </div>
                <img src="${story.image}" class="story-main-img" alt="Story Content">
                <div class="story-interaction-footer">
                    <div class="story-reply-box">
                        <input type="text" id="story-reply-input" placeholder="Enviar mensagem..." onkeypress="handleStoryReplyEnter(event)">
                        <button onclick="sendStoryReply()"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                    <div class="story-quick-actions">
                        <i class="fa-regular fa-heart" onclick="likeStory(this)"></i>
                        <i class="fa-regular fa-paper-plane" onclick="shareStory()"></i>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            const progressBar = modal.querySelector('.story-progress-bar');
            if (progressBar) progressBar.style.width = '100%';
            window.storyTimeout = setTimeout(closeStoryModal, 5000);
        }, 50);
    }

    function openStoryPostModal() {
        const modal = document.getElementById('story-post-modal');
        if (!modal) return;
        modal.style.display = 'flex';
    }

    function closeStoryPostModal() {
        const modal = document.getElementById('story-post-modal');
        if (!modal) return;
        modal.style.display = 'none';
    }

    function postStory() {
        const fileInput = document.getElementById('story-image-input');
        const captionInput = document.getElementById('story-caption-input');

        if (!fileInput || !captionInput) return;

        const file = fileInput.files && fileInput.files[0];
        if (!file) {
            alert('Selecione uma imagem para postar na story.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const newStory = {
                id: `story-${Date.now()}`,
                username: currentUser.username.replace('@', ''),
                avatar: currentUser.avatarUrl,
                image: e.target.result,
                caption: captionInput.value.trim() || 'Minha story',
                timestamp: 'Agora',
                isYou: false
            };

            storiesData.unshift(newStory);
            renderStories();
            closeStoryPostModal();

            fileInput.value = '';
            captionInput.value = '';
        };
        reader.readAsDataURL(file);
    }

    renderStories();

    // Expor funções globais para uso em atributos onclick do modal de story
    window.closeStoryPostModal = closeStoryPostModal;
    window.postStory = postStory;

    // Associa botões do modal de story
    const storyPostBtn = document.getElementById('story-post-btn');
    if (storyPostBtn) storyPostBtn.addEventListener('click', postStory);

    // 3. Renderizar o feed de posts (baseado na imagem)
    const postsFeed = document.getElementById('posts-feed');
    const createInput = document.getElementById('create-post-input');
    const shareBtn = document.getElementById('share-post-btn');
    const imageInput = document.getElementById('create-post-image-input');
    const selectImageBtn = document.getElementById('select-image-btn');
    const toggleLocationBtn = document.getElementById('toggle-location-btn');
    const locationRow = document.getElementById('create-location-row');
    const locationInput = document.getElementById('create-post-location');
    const selectedImageName = document.getElementById('selected-image-name');

    let selectedImageDataUrl = null;
    let selectedLocation = '';
    let currentCommentPostId = null;

    // 1. Configuração dos campos de imagem e localização
    if (selectImageBtn && imageInput) {
        selectImageBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            selectedImageName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImageDataUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    if (toggleLocationBtn && locationRow && locationInput) {
        toggleLocationBtn.addEventListener('click', () => {
            const isVisible = locationRow.style.display === 'block';
            locationRow.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                locationInput.focus();
            }
        });

        locationInput.addEventListener('input', (event) => {
            selectedLocation = event.target.value.trim();
        });
    }

    const postsData = [
        {
            id: 'post-1',
            author: 'Angelina Hall',
            avatar: 'https://i.pravatar.cc/150?u=angelina',
            time: '2 hours ago',
            text: 'I have just spent 3 amazing days in my hometown! 😍',
            image: 'https://picsum.photos/600/400?random=45',
            location: 'New York, USA',
            likes: 154,
            comments: [
                { user: 'neon_nina', text: 'Que foto incrível!', time: '1h' },
                { user: 'cyber_punk', text: 'Uau! Me conta mais 🙂', time: '2h' }
            ],
            shares: 27,
            repostedBy: []
        }
    ];

    function createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-card-header">
                <div class="post-author">
                    <img src="${post.avatar}" alt="${post.author}" class="post-avatar" />
                    <div class="post-author-info">
                        <span class="post-author-name">${post.author}</span>
                        <span class="post-time">${post.time}</span>
                    </div>
                </div>
                <button class="post-more-btn" aria-label="Mais opções"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <p class="post-text">${post.text}</p>
            ${post.location ? `<div class="post-location"><i class="fa-solid fa-location-dot"></i> ${post.location}</div>` : ''}
            ${post.image ? `
            <div class="post-image-wrapper">
                <img src="${post.image}" alt="Post image" class="post-image" />
            </div>` : ''}
            <div class="post-actions">
                <div class="post-actions-left">
                    <button class="icon-btn post-like-btn" aria-label="Curtir">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <button class="icon-btn post-comment-btn" aria-label="Comentar">
                        <i class="fa-regular fa-comment"></i>
                    </button>
                    <button class="icon-btn post-share-btn" aria-label="Compartilhar">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                    <div class="repost-wrapper">
                        <button class="icon-btn post-repost-btn" aria-label="Republicar">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                        <div class="repost-avatar" style="display: ${post.repostedBy && post.repostedBy.length ? 'flex' : 'none'};">
                            <img src="${post.repostedBy && post.repostedBy.length ? post.repostedBy[0].avatar : ''}" alt="Reposted" />
                        </div>
                    </div>
                </div>
                <button class="icon-btn" aria-label="Salvar">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
            </div>
            <div class="post-stats">
                <span><strong class="like-count">${post.likes}</strong> Likes</span>
                <span><strong>${post.comments.length}</strong> Comments</span>
                <span><strong>${post.shares}</strong> Shares</span>
            </div>
        `;

        const likeBtn = card.querySelector('.post-like-btn');
        const likeCount = card.querySelector('.like-count');
        const commentBtn = card.querySelector('.post-comment-btn');
        const shareBtn = card.querySelector('.post-share-btn');
        const repostBtn = card.querySelector('.post-repost-btn');
        const repostAvatar = card.querySelector('.repost-avatar');

        likeBtn.addEventListener('click', () => {
            const icon = likeBtn.querySelector('i');
            icon.classList.toggle('fa-regular');
            icon.classList.toggle('fa-solid');
            icon.classList.toggle('active');

            const current = parseInt(likeCount.textContent, 10);
            likeCount.textContent = icon.classList.contains('active') ? current + 1 : current - 1;
        });

        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                openCommentsForPost(post.id);
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                post.shares = (post.shares || 0) + 1;
                renderFeed();
                alert('Post compartilhado!');
            });
        }

        if (repostBtn) {
            repostBtn.addEventListener('click', () => {
                const already = post.repostedBy && post.repostedBy.find(r => r.username === currentUser.username);
                if (already) {
                    post.repostedBy = post.repostedBy.filter(r => r.username !== currentUser.username);
                    repostAvatar.style.display = 'none';
                } else {
                    post.repostedBy = post.repostedBy || [];
                    post.repostedBy.unshift({ username: currentUser.username, avatar: currentUser.avatarUrl });
                    repostAvatar.style.display = 'flex';
                    repostAvatar.querySelector('img').src = currentUser.avatarUrl;
                }
            });
        }

        return card;
    }

    function renderFeed() {
        if (!postsFeed) return;
        postsFeed.innerHTML = '';
        postsData.forEach(post => {
            postsFeed.appendChild(createPostCard(post));
        });
    }

    if (shareBtn && createInput) {
        shareBtn.addEventListener('click', () => {
            const content = createInput.value.trim();
            if (!content) return;

            const newPost = {
                id: `post-${Date.now()}`,
                author: currentUser.username.replace('@', ''),
                avatar: currentUser.avatarUrl,
                time: 'Just now',
                text: content,
                image: selectedImageDataUrl || '',
                location: selectedLocation || '',
                likes: 0,
                comments: [],
                shares: 0,
                repostedBy: []
            };

            postsData.unshift(newPost);
            renderFeed();

            // Resetar inputs (imagem, localização, texto)
            createInput.value = '';
            selectedImageDataUrl = null;
            selectedLocation = '';
            if (locationInput) locationInput.value = '';
            if (locationRow) locationRow.style.display = 'none';
            if (selectedImageName) selectedImageName.textContent = 'Nenhuma imagem selecionada';
            if (imageInput) imageInput.value = '';
        });
    }

    renderFeed();

    // 4. Sistema de Busca Funcional
    // 3. Sistema de Busca Funcional
    // (A busca real de usuários é feita pelo backend via /api/search/users;
    //  o front-end converte o input em chamadas ao endpoint e renderiza os resultados.)

    // Inicializar configurações (tema, idioma, etc.)
    initializeSettings();
});

// Interações Globais
function handleLike(el) {
    el.classList.toggle('fa-regular');
    el.classList.toggle('fa-solid');
    el.classList.toggle('active');

    const countElement = document.getElementById('like-count');
    if(countElement) {
        let currentLikes = parseInt(countElement.innerText.replace('.', ''));
        if (el.classList.contains('active')) {
            currentLikes++;
        } else {
            currentLikes--;
        }
        countElement.innerText = currentLikes.toLocaleString('pt-BR');
    }
}

function handleSave(el) {
    el.classList.toggle('fa-regular');
    el.classList.toggle('fa-solid');
    el.classList.toggle('saved');
}

function handleRepost(el) {
    el.classList.toggle('reposted');
    const badgeContainer = document.getElementById('repost-badge-container');
    
    if (el.classList.contains('reposted')) {
        createRepostBadge(currentUser.avatarUrl);
        badgeContainer.classList.add('visible');
    } else {
        badgeContainer.classList.remove('visible');
        setTimeout(() => badgeContainer.innerHTML = '', 300);
    }
}

// Dados do usuário atual (baseado na sessão)
const avatarImg = document.getElementById('current-user-avatar');
const currentUser = {
    username: SESSION && SESSION.username ? `@${SESSION.username}` : "@mockuser",
    avatarUrl: (SESSION && SESSION.avatarUrl) || (avatarImg ? avatarImg.src : "https://i.pravatar.cc/150?u=mockuser")
};


// 1. Função para clicar no ícone de comentário e abrir o modal
function handleCommentClick() {
    toggleCommentsModal();
}

// 2. Função genérica para abrir/fechar o modal com animação
function toggleCommentsModal(show) {
    const body = document.body;
    if (typeof show === 'boolean') {
        body.classList.toggle('modal-active', show);
    } else {
        body.classList.toggle('modal-active');
    }

    if (body.classList.contains('modal-active')) {
        setTimeout(() => {
            const input = document.getElementById('modal-comment-input');
            if (input) input.focus();
        }, 300);
    }
}

// 3. Função auxiliar para fechar o modal clicando no fundo
function closeCommentsModal(event) {
    if (event.target === document.getElementById('comments-modal-overlay')) {
        toggleCommentsModal(false);
    }
}

function openCommentsForPost(postId) {
    currentCommentPostId = postId;
    const post = postsData.find(p => p.id === postId);
    const modalCommentsList = document.getElementById('modal-comments-list');
    const commentAvatar = document.getElementById('comment-modal-avatar');
    const modalTitle = document.querySelector('#comments-modal .modal-header h2');

    if (commentAvatar) {
        commentAvatar.src = currentUser.avatarUrl;
    }
    if (modalTitle) {
        modalTitle.textContent = `Comentários - ${post ? post.author : ''}`;
    }

    if (modalCommentsList) {
        modalCommentsList.innerHTML = '';
        (post?.comments || []).forEach(c => {
            const commentHTML = `
                <div class="modal-comment">
                    <img src="https://i.pravatar.cc/150?u=${c.user}" alt="${c.user}" class="comment-avatar">
                    <div class="comment-content">
                        <p class="comment-text"><strong>@${c.user}</strong> ${c.text}</p>
                        <p class="comment-time">${c.time}</p>
                    </div>
                </div>
            `;
            modalCommentsList.insertAdjacentHTML('beforeend', commentHTML);
        });
    }

    toggleCommentsModal(true);
}

// 4. Lógica para habilitar o botão "Publicar"
const modalInput = document.getElementById('modal-comment-input');
const postBtn = document.querySelector('.post-comment-btn');

if(modalInput && postBtn) {
    modalInput.addEventListener('input', () => {
        if (modalInput.value.trim() !== '') {
            postBtn.classList.add('active');
        } else {
            postBtn.classList.remove('active');
        }
    });
}

// 5. Função para publicar o comentário via modal
function postModalComment() {
    if (!modalInput || !postBtn) return;
    const commentText = modalInput.value.trim();
    if (commentText === '') return;

    const post = postsData.find(p => p.id === currentCommentPostId);
    if (!post) return;

    const newComment = {
        user: currentUser.username.replace('@', ''),
        text: commentText,
        time: 'Agora'
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);

    const modalCommentsList = document.getElementById('modal-comments-list');
    if (modalCommentsList) {
        const commentHTML = `
            <div class="modal-comment">
                <img src="${currentUser.avatarUrl}" alt="${currentUser.username}" class="comment-avatar">
                <div class="comment-content">
                    <p class="comment-text"><strong>${currentUser.username}</strong> ${commentText}</p>
                    <p class="comment-time">Agora</p>
                </div>
            </div>
        `;
        modalCommentsList.insertAdjacentHTML('beforeend', commentHTML);
    }

    // Atualiza contadores no feed
    renderFeed();

    modalInput.value = '';
    postBtn.classList.remove('active');
    toggleCommentsModal(false);
}

// 6. Função para criar o distintivo de republicação
function createRepostBadge(userAvatarUrl) {
    const badgeContainer = document.getElementById('repost-badge-container');
    if(!badgeContainer) return;
    const badgeHTML = `
        <div class="repost-badge">
            <img src="${userAvatarUrl}" alt="Usuário que Republicou" class="repost-user-avatar">
            <div class="repost-icon-badge">
                <i class="fa-solid fa-arrows-rotate"></i>
            </div>
        </div>
    `;
    badgeContainer.innerHTML = badgeHTML;
}

// Chat e Mensagens
document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chat-list');

    const chats = [
        { name: "Neon Nina", msg: "Amanhã no clube neon?", time: "12m", unread: true },
        { name: "Cyber Punk", msg: "O código foi enviado para o terminal.", time: "1h", unread: false },
        { name: "Dexter Dev", msg: "Você viu a nova atualização do ÉdenX?", time: "3h", unread: false }
    ];

    if(chatList) {
        chats.forEach(chat => {
            const avatarUrl = `https://i.pravatar.cc/150?u=${chat.name}`;
            
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.innerHTML = `
                <img src="${avatarUrl}" class="chat-avatar">
                <div class="chat-info">
                    <span class="user-name">${chat.name}</span>
                    <span class="last-message">${chat.msg}</span>
                </div>
                <div class="chat-meta">
                    <span class="chat-time">${chat.time}</span>
                    ${chat.unread ? '<div class="unread-dot"></div>' : ''}
                </div>
            `;

            chatItem.onclick = () => openChat(chat.name, avatarUrl);
            chatList.appendChild(chatItem);
        });
    }
});

function openChat(name, avatar) {
    document.getElementById('chat-list-container').style.display = 'none';
    const chatWindow = document.getElementById('active-chat-view');
    chatWindow.style.display = 'flex';

    document.getElementById('active-chat-name').innerText = name;
    document.getElementById('active-chat-avatar').src = avatar;

    const messagesArea = document.getElementById('chat-messages-area');
    messagesArea.innerHTML = `
        <div class="message-bubble received">Olá! Sou ${name}. Como posso ajudar no ÉdenX hoje?</div>
    `;
}

function closeChat() {
    document.getElementById('chat-list-container').style.display = 'flex'; // Changed to flex to respect styling
    document.getElementById('active-chat-view').style.display = 'none';
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (text !== "") {
        const messagesArea = document.getElementById('chat-messages-area');
        messagesArea.innerHTML += `<div class="message-bubble sent">${text}</div>`;
        input.value = "";
        messagesArea.scrollTop = messagesArea.scrollHeight; 
    }
}

// Abre o visualizador de Story do autor do post
function openAuthorStory() {
    const storyData = {
        username: "eden_official",
        image_url: "https://picsum.photos/400/800?random=105", 
        avatar_url: "https://i.pravatar.cc/100?u=admin"
    };
    
    const existingModal = document.querySelector('.story-interactive-modal');
    if(existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'story-interactive-modal';
    
    modal.innerHTML = `
        <div class="story-wrapper">
            <div class="story-progress-container">
                <div class="story-progress-bar"></div>
            </div>
            
            <div class="story-header-info">
                <div class="story-user">
                    <img src="${storyData.avatar_url}" alt="Avatar">
                    <span class="username"><strong>${storyData.username}</strong></span>
                    <span class="time">3h</span>
                </div>
                <i class="fa-solid fa-xmark close-btn" onclick="closeStoryModal()"></i>
            </div>
            
            <img src="${storyData.image_url}" class="story-main-img" alt="Story Content">
            
            <div class="story-interaction-footer">
                <div class="story-reply-box">
                    <input type="text" id="story-reply-input" placeholder="Responder a ${storyData.username}..." onkeypress="handleStoryReplyEnter(event)">
                    <button onclick="sendStoryReply()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
                <div class="story-quick-actions">
                    <i class="fa-regular fa-heart" onclick="likeStory(this)"></i>
                    <i class="fa-regular fa-paper-plane" onclick="shareStory()"></i>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        const progressBar = modal.querySelector('.story-progress-bar');
        if(progressBar) progressBar.style.width = '100%';
        window.storyTimeout = setTimeout(closeStoryModal, 5000);
    }, 50);
}

function closeStoryModal() {
    const modal = document.querySelector('.story-interactive-modal');
    if (modal) {
        modal.remove();
        clearTimeout(window.storyTimeout); 
    }
}

function likeStory(icon) {
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    icon.classList.toggle('active');
    
    if (icon.classList.contains('active')) {
        const heartPop = document.createElement('i');
        heartPop.className = 'fa-solid fa-heart story-heart-pop';
        document.querySelector('.story-wrapper').appendChild(heartPop);
        setTimeout(() => heartPop.remove(), 800);
    }
}

function handleStoryReplyEnter(event) {
    if (event.key === 'Enter') {
        sendStoryReply();
    }
}

function sendStoryReply() {
    const input = document.getElementById('story-reply-input');
    if (input.value.trim() !== '') {
        alert('Comentário enviado em direct para eden_official: "' + input.value + '"');
        input.value = '';
        closeStoryModal();
    }
}

function shareStory() {
    alert('Story copiado ou enviado via Direct!');
}

function switchProfileTab(clickedTab, tabId) {
    const tabs = document.querySelectorAll('.profile-tabs .tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    clickedTab.classList.add('active');

    const contents = document.querySelectorAll('.profile-tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    const selectedContent = document.getElementById('tab-' + tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

function handleEditProfile() {
    // Verificando existência de SESSION global que provavemente vem do app.js
    if (typeof SESSION !== 'undefined' && !SESSION.isAuthenticated) {
        alert('Você precisa estar logado para editar seu perfil!');
        return;
    }
    
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) {
        alert('Erro: Modal de edição não encontrado.');
        return;
    }
    
    const displayNameField = document.getElementById('edit-display-name');
    const usernameField = document.getElementById('edit-username');
    const bioField = document.getElementById('edit-bio');
    const locationField = document.getElementById('edit-location');
    const linkField = document.getElementById('edit-link');
    const anniversaryField = document.getElementById('edit-anniversary');
    const avatarField = document.getElementById('edit-avatar');
    
    if (typeof SESSION !== 'undefined') {
        if (displayNameField) displayNameField.value = SESSION.displayName || '';
        if (usernameField) usernameField.value = SESSION.username || '';
        if (bioField) bioField.value = SESSION.bio || '';
        if (locationField) locationField.value = SESSION.location || '';
        if (linkField) linkField.value = SESSION.link || '';
        if (anniversaryField) anniversaryField.value = SESSION.anniversary || '';
        // Não podemos definir value em campos file (segurança do navegador)
        // if (avatarField) avatarField.value = SESSION.avatarUrl || '';
    }
    
    openEditProfileModal();
}

function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; 
    }
}

// Fechar modal clicando fora (Estrutura corrigida)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditProfileModal();
            }
        });
    }
    
    // ESC para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeEditProfileModal();
        }
    });
});

// Event listener para o form de edição de perfil (Estrutura corrigida)
document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const displayName = document.getElementById('edit-display-name').value.trim();
            const username = document.getElementById('edit-username').value.trim();
            const bio = document.getElementById('edit-bio').value.trim();
            const location = document.getElementById('edit-location').value.trim();
            const link = document.getElementById('edit-link').value.trim();
            const anniversary = document.getElementById('edit-anniversary').value;
            const avatarFile = document.getElementById('edit-avatar').files[0];
            
            let avatarUrl = '';
            
            // Se um arquivo foi selecionado, fazer upload
            if (avatarFile) {
                try {
                    const uploadResult = await uploadAvatar(avatarFile);
                    if (uploadResult.success) {
                        avatarUrl = uploadResult.data.url;
                    } else {
                        alert('Erro ao fazer upload da imagem: ' + (uploadResult.error || 'Erro desconhecido'));
                        return;
                    }
                } catch (error) {
                    console.error('Erro no upload:', error);
                    alert('Erro ao fazer upload da imagem. Tente novamente.');
                    return;
                }
            }
            
            try {
                // Presumo que updateProfile vem de outro arquivo como api-client.js
                if(typeof updateProfile === 'function') {
                    const result = await updateProfile(displayName, username, bio, location, link, anniversary, avatarUrl);
                    
                    if (result.success) {
                        const currentAvatar = (avatarUrl && normalizeAvatarUrl(avatarUrl)) || (typeof SESSION !== 'undefined' ? SESSION.avatarUrl : null);

                        if (typeof SESSION !== 'undefined') {
                            SESSION.displayName = displayName;
                            SESSION.username = username;
                            SESSION.bio = bio;
                            SESSION.location = location;
                            SESSION.link = link;
                            SESSION.anniversary = anniversary;
                            if (currentAvatar) SESSION.avatarUrl = currentAvatar;
                        }
                        
                        localStorage.setItem('edenx_displayName', displayName);
                        localStorage.setItem('edenx_username', username);
                        localStorage.setItem('edenx_bio', bio);
                        localStorage.setItem('edenx_location', location);
                        localStorage.setItem('edenx_link', link);
                        localStorage.setItem('edenx_anniversary', anniversary);
                        if (currentAvatar) localStorage.setItem('edenx_avatarUrl', currentAvatar);
                        
                        // Atualizar elementos do perfil
                        const displayNameElem = document.getElementById('profile-name');
                        const usernameElem = document.getElementById('profile-username');
                        const bioElem = document.getElementById('profile-bio');
                        const avatarElem = document.getElementById('profile-avatar');
                        const locationElem = document.getElementById('location-text');
                        const linkElem = document.getElementById('link-url');
                        const anniversaryElem = document.getElementById('anniversary-text');
                        
                        if(displayNameElem) displayNameElem.textContent = displayName || 'Nome não definido';
                        if(usernameElem) usernameElem.textContent = '@' + (username || 'usuario');
                        if(bioElem) bioElem.textContent = bio || 'Sem bio';
                        if (avatarElem && currentAvatar) avatarElem.src = currentAvatar;
                        if(locationElem) locationElem.textContent = location || '-';
                        if(linkElem) {
                            linkElem.textContent = link ? 'Link' : '-';
                            linkElem.href = link || '#';
                        }
                        if(anniversaryElem) {
                            if (anniversary) {
                                const date = new Date(anniversary);
                                anniversaryElem.textContent = date.toLocaleDateString('pt-BR');
                            } else {
                                anniversaryElem.textContent = '-';
                            }
                        }
                        
                        alert('Perfil atualizado com sucesso!');
                        closeEditProfileModal();
                    } else {
                        alert('Erro ao atualizar perfil: ' + (result.error || 'Erro desconhecido'));
                    }
                } else {
                    alert('Função de atualização não encontrada!');
                }
            } catch (error) {
                console.error('Erro ao atualizar perfil:', error);
                alert('Erro ao atualizar perfil. Tente novamente.');
            }
        });
    }
});

// ====================================================
// CONFIGURAÇÕES (Tema, Idioma, Privacidade, etc.)
// ====================================================

function getSavedSettings() {
    return {
        theme: localStorage.getItem('edenx_theme') || 'dark',
        language: localStorage.getItem('edenx_language') || 'pt',
        privacyPrivate: localStorage.getItem('edenx_privacy_private') === 'true',
        bestFriends: JSON.parse(localStorage.getItem('edenx_best_friends') || '[]'),
        blockedUsers: JSON.parse(localStorage.getItem('edenx_blocked_users') || '[]')
    };
}

function saveSettings(settings) {
    localStorage.setItem('edenx_theme', settings.theme);
    localStorage.setItem('edenx_language', settings.language);
    localStorage.setItem('edenx_privacy_private', settings.privacyPrivate ? 'true' : 'false');
    localStorage.setItem('edenx_best_friends', JSON.stringify(settings.bestFriends || []));
    localStorage.setItem('edenx_blocked_users', JSON.stringify(settings.blockedUsers || []));
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

const SETTINGS_TRANSLATIONS = {
    pt: {
        title: 'Configurações',
        account: 'Conta',
        switchAccount: 'Alternar conta',
        archivedPosts: 'Posts arquivados',
        privacy: 'Privacidade',
        privateAccount: 'Conta privada',
        bestFriends: 'Melhores amigos',
        blockedUsers: 'Usuários bloqueados',
        general: 'Geral',
        theme: 'Tema',
        language: 'Idioma'
    },
    en: {
        title: 'Settings',
        account: 'Account',
        switchAccount: 'Switch account',
        archivedPosts: 'Archived posts',
        privacy: 'Privacy',
        privateAccount: 'Private account',
        bestFriends: 'Close friends',
        blockedUsers: 'Blocked users',
        general: 'General',
        theme: 'Theme',
        language: 'Language'
    },
    es: {
        title: 'Configuración',
        account: 'Cuenta',
        switchAccount: 'Cambiar cuenta',
        archivedPosts: 'Publicaciones archivadas',
        privacy: 'Privacidad',
        privateAccount: 'Cuenta privada',
        bestFriends: 'Mejores amigos',
        blockedUsers: 'Usuarios bloqueados',
        general: 'General',
        theme: 'Tema',
        language: 'Idioma'
    }
};

function applyLanguage(language) {
    const dict = SETTINGS_TRANSLATIONS[language] || SETTINGS_TRANSLATIONS.pt;

    const modalTitle = document.querySelector('#settings-modal .modal-header h2');
    if (modalTitle) modalTitle.textContent = dict.title;

    const sections = document.querySelectorAll('#settings-modal .settings-section');
    if (sections.length >= 3) {
        const [accountSection, privacySection, generalSection] = sections;
        const accountHeader = accountSection.querySelector('h3');
        const privacyHeader = privacySection.querySelector('h3');
        const generalHeader = generalSection.querySelector('h3');
        if (accountHeader) accountHeader.textContent = dict.account;
        if (privacyHeader) privacyHeader.textContent = dict.privacy;
        if (generalHeader) generalHeader.textContent = dict.general;
    }

    const switchBtn = document.getElementById('switch-account-btn');
    if (switchBtn) switchBtn.textContent = dict.switchAccount;

    const archivedBtn = document.getElementById('archived-posts-btn');
    if (archivedBtn) archivedBtn.textContent = dict.archivedPosts;

    const labels = {
        'privacy-toggle': dict.privateAccount,
        'best-friend-input': dict.bestFriends,
        'blocked-user-input': dict.blockedUsers,
        'theme-select': dict.theme,
        'language-select': dict.language
    };

    Object.keys(labels).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'INPUT' && el.type === 'text') {
            el.placeholder = `+ ${labels[id]}`;
        }
        if (el.tagName === 'SELECT') {
            const label = el.closest('.toggle-row')?.querySelector('span');
            if (label) label.textContent = labels[id];
        }
    });
}

function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    const settings = getSavedSettings();
    applyTheme(settings.theme);
    applyLanguage(settings.language);

    const privacyToggle = document.getElementById('privacy-toggle');
    const themeSelect = document.getElementById('theme-select');
    const languageSelect = document.getElementById('language-select');

    if (privacyToggle) privacyToggle.checked = settings.privacyPrivate;
    if (themeSelect) themeSelect.value = settings.theme;
    if (languageSelect) languageSelect.value = settings.language;

    renderSettingsList('best-friends-list', settings.bestFriends);
    renderSettingsList('blocked-users-list', settings.blockedUsers);

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function handleLogout() {
    if (confirm('Tem certeza de que deseja sair da conta?')) {
        // Fechar o modal
        closeSettingsModal();
        
        // Chamar a função logout da API que já limpa a sessão
        logout();
        
        // Redirecionar para login
        setTimeout(() => {
            window.location.href = 'login/index.html';
        }, 300);
    }
}

function renderSettingsList(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    (items || []).forEach(item => {
        const pill = document.createElement('div');
        pill.className = 'settings-pill';
        pill.innerHTML = `
            <span>${item}</span>
            <span class="remove-pill" title="Remover">×</span>
        `;
        pill.querySelector('.remove-pill').addEventListener('click', () => {
            removeFromSettingsList(containerId, item);
        });
        container.appendChild(pill);
    });
}

function removeFromSettingsList(containerId, item) {
    const settings = getSavedSettings();
    const key = containerId === 'best-friends-list' ? 'bestFriends' : 'blockedUsers';
    const list = (settings[key] || []).filter(i => i !== item);
    settings[key] = list;
    saveSettings(settings);
    renderSettingsList(containerId, list);
}

function addToSettingsList(containerId, value) {
    if (!value) return;
    const settings = getSavedSettings();
    const key = containerId === 'best-friends-list' ? 'bestFriends' : 'blockedUsers';
    const list = new Set(settings[key] || []);
    list.add(value);
    settings[key] = Array.from(list);
    saveSettings(settings);
    renderSettingsList(containerId, settings[key]);
}

function initializeSettings() {
    const settings = getSavedSettings();
    applyTheme(settings.theme);
    applyLanguage(settings.language);

    const configBtn = document.getElementById('open-settings-btn');
    if (configBtn) configBtn.addEventListener('click', openSettingsModal);

    const closeListener = (e) => {
        if (e.target.id === 'settings-modal') {
            closeSettingsModal();
        }
    };

    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.addEventListener('click', closeListener);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSettingsModal();
    });

    const switchBtn = document.getElementById('switch-account-btn');
    if (switchBtn) switchBtn.addEventListener('click', () => {
        if (typeof logout === 'function') logout();
        else window.location.href = 'login/index.html';
    });

    const archivedBtn = document.getElementById('archived-posts-btn');
    if (archivedBtn) archivedBtn.addEventListener('click', () => {
        alert('Funcionalidade de posts arquivados ainda não implementada.');
    });

    const privacyToggle = document.getElementById('privacy-toggle');
    if (privacyToggle) {
        privacyToggle.checked = settings.privacyPrivate;
        privacyToggle.addEventListener('change', () => {
            settings.privacyPrivate = privacyToggle.checked;
            saveSettings(settings);
        });
    }

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = settings.theme;
        themeSelect.addEventListener('change', () => {
            settings.theme = themeSelect.value;
            saveSettings(settings);
            applyTheme(settings.theme);
        });
    }

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = settings.language;
        languageSelect.addEventListener('change', () => {
            settings.language = languageSelect.value;
            saveSettings(settings);
            applyLanguage(settings.language);
        });
    }

    const addBestFriendBtn = document.getElementById('add-best-friend-btn');
    const bestFriendInput = document.getElementById('best-friend-input');
    if (addBestFriendBtn && bestFriendInput) {
        addBestFriendBtn.addEventListener('click', () => {
            const value = bestFriendInput.value.trim();
            if (value) {
                addToSettingsList('best-friends-list', value);
                bestFriendInput.value = '';
            }
        });
    }

    const addBlockedUserBtn = document.getElementById('add-blocked-user-btn');
    const blockedUserInput = document.getElementById('blocked-user-input');
    if (addBlockedUserBtn && blockedUserInput) {
        addBlockedUserBtn.addEventListener('click', () => {
            const value = blockedUserInput.value.trim();
            if (value) {
                addToSettingsList('blocked-users-list', value);
                blockedUserInput.value = '';
            }
        });
    }
}

/* ====================================================== */
/* CAROUSEL DE POSTS - NOVO FEED HERO */
/* ====================================================== */

// Dados dos posts (exemplo - pode ser preenchido dinamicamente da API)
const carouselPosts = [
    {
        id: 1,
        title: "Cidade Neon",
        location: "São Paulo, Brasil",
        description: "Explorando os locais mais incríveis da metrópole. Venha descobrir a beleza urbana.",
        image: "https://picsum.photos/600/800?random=1",
        carouselImages: [
            { img: "https://picsum.photos/400/550?random=1", title: "Downtown", location: "São Paulo" },
            { img: "https://picsum.photos/400/550?random=2", title: "Night Life", location: "São Paulo" },
            { img: "https://picsum.photos/400/550?random=3", title: "Urban Art", location: "São Paulo" },
            { img: "https://picsum.photos/400/550?random=4", title: "Street Vibes", location: "São Paulo" },
            { img: "https://picsum.photos/400/550?random=5", title: "Skyline", location: "São Paulo" }
        ]
    },
    {
        id: 2,
        title: "Natureza Selvagem",
        location: "Florianópolis, Brasil",
        description: "Praias incríveis e natureza intocada te esperando para uma experiência inesquecível.",
        image: "https://picsum.photos/600/800?random=10",
        carouselImages: [
            { img: "https://picsum.photos/400/550?random=10", title: "Praia Central", location: "Florianópolis" },
            { img: "https://picsum.photos/400/550?random=11", title: "Lagoa", location: "Florianópolis" },
            { img: "https://picsum.photos/400/550?random=12", title: "Trilha", location: "Florianópolis" },
            { img: "https://picsum.photos/400/550?random=13", title: "Por do Sol", location: "Florianópolis" },
            { img: "https://picsum.photos/400/550?random=14", title: "Fauna", location: "Florianópolis" }
        ]
    },
    {
        id: 3,
        title: "Montanhas Majestosas",
        location: "Gramado, Brasil",
        description: "Paisagens montanhosas que tiram o fôlego e te conectam com a natureza pura.",
        image: "https://picsum.photos/600/800?random=20",
        carouselImages: [
            { img: "https://picsum.photos/400/550?random=20", title: "Pico Principal", location: "Gramado" },
            { img: "https://picsum.photos/400/550?random=21", title: "Vale Verde", location: "Gramado" },
            { img: "https://picsum.photos/400/550?random=22", title: "Câmara", location: "Gramado" },
            { img: "https://picsum.photos/400/550?random=23", title: "Amanhecer", location: "Gramado" },
            { img: "https://picsum.photos/400/550?random=24", title: "Floresta", location: "Gramado" }
        ]
    },
    {
        id: 4,
        title: "Aventura no Deserto",
        location: "Lençóis Maranhenses, Brasil",
        description: "Dunas infinitas e lagoas cristalinas criam um cenário de tirar o fôlego.",
        image: "https://picsum.photos/600/800?random=30",
        carouselImages: [
            { img: "https://picsum.photos/400/550?random=30", title: "Duna Principal", location: "Lençóis" },
            { img: "https://picsum.photos/400/550?random=31", title: "Lagoa Azul", location: "Lençóis" },
            { img: "https://picsum.photos/400/550?random=32", title: "Areia Branca", location: "Lençóis" },
            { img: "https://picsum.photos/400/550?random=33", title: "Pôr do Sol", location: "Lençóis" },
            { img: "https://picsum.photos/400/550?random=34", title: "Vida Selvagem", location: "Lençóis" }
        ]
    }
];

let currentPostIndex = 0;
let currentCarouselIndex = 0;
let autoplayInterval = null;

function initCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    // Gerar cards do carousel
    renderCarouselCards();

    // Atualizar hero post inicial
    updateHeroPost();

    // Iniciar autoplay
    startAutoplay();

    // Listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevPost();
        if (e.key === 'ArrowRight') nextPost();
    });
}

function renderCarouselCards() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    track.innerHTML = '';
    const currentPost = carouselPosts[currentPostIndex];

    currentPost.carouselImages.forEach((img, index) => {
        const card = document.createElement('div');
        card.className = `carousel-card ${index === currentCarouselIndex ? 'active' : ''}`;
        card.innerHTML = `
            <img src="${img.img}" alt="${img.title}">
            <div class="carousel-card-overlay">
                <h3>${img.title}</h3>
                <p>${img.location}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            currentCarouselIndex = index;
            renderCarouselCards();
            resetAutoplay();
        });
        track.appendChild(card);
    });

    updateCounter();
    updateProgressBar();
}

function fadeHeroImageTo(src, callback) {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage) {
        if (callback) callback();
        return;
    }

    heroImage.classList.add('fade-out');

    const onTransitionEnd = () => {
        heroImage.removeEventListener('transitionend', onTransitionEnd);
        heroImage.src = src;

        // Forcing reflow to ensure the fade-in transition is applied
        void heroImage.offsetWidth;

        heroImage.classList.remove('fade-out');
        heroImage.classList.add('fade-in');

        if (typeof callback === 'function') {
            callback();
        }

        // Clean up fade-in after it finishes
        setTimeout(() => {
            heroImage.classList.remove('fade-in');
        }, 700);
    };

    heroImage.addEventListener('transitionend', onTransitionEnd);
}

function updateHeroPost() {
    const post = carouselPosts[currentPostIndex];
    const heroItem = post.carouselImages[currentCarouselIndex] || post.carouselImages[0];

    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    const heroLocation = document.getElementById('hero-location');

    if (heroTitle) heroTitle.textContent = heroItem.title;
    if (heroDescription) heroDescription.textContent = post.description;
    if (heroLocation) heroLocation.textContent = heroItem.location;

    fadeHeroImageTo(heroItem.img, () => {
        updateProgressBar();
        updateCounter();
    });
}

function updateCounter() {
    const counter = document.getElementById('current-post');
    if (counter) {
        const number = (currentPostIndex * 5) + currentCarouselIndex + 1;
        counter.textContent = String(number).padStart(2, '0');
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    // Reinicia animação para o próximo ciclo de tempo
    progressBar.style.animation = 'none';
    progressBar.style.width = '0%';

    // Forçar recálculo para reiniciar a animação
    void progressBar.offsetWidth;

    progressBar.style.animation = 'progressAnimation 5s linear forwards';
}

function nextPost() {
    clearAutoplay();
    const currentPost = carouselPosts[currentPostIndex];
    
    if (currentCarouselIndex < currentPost.carouselImages.length - 1) {
        currentCarouselIndex++;
    } else {
        currentPostIndex = (currentPostIndex + 1) % carouselPosts.length;
        currentCarouselIndex = 0;
        updateHeroPost();
    }
    
    renderCarouselCards();
    startAutoplay();
}

function prevPost() {
    clearAutoplay();
    
    if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
    } else {
        currentPostIndex = (currentPostIndex - 1 + carouselPosts.length) % carouselPosts.length;
        const currentPost = carouselPosts[currentPostIndex];
        currentCarouselIndex = currentPost.carouselImages.length - 1;
        updateHeroPost();
    }
    
    renderCarouselCards();
    startAutoplay();
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextPost();
    }, 5000); // 5 segundos
}

function clearAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

function resetAutoplay() {
    clearAutoplay();
    startAutoplay();
}

function viewPostDetails() {
    const post = carouselPosts[currentPostIndex];
    alert(`Visualizando: ${post.title}\nLocalização: ${post.location}`);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
});
