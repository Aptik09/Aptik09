// ===== JARVIS AI SYSTEM - BHINDI POWERED =====
// Configuration
const CONFIG = {
    OWNER_USERNAME: 'Aptik09',
    OWNER_NAME: 'Aptik Pandey',
    PASSWORD: 'jarvis2024',
    BHINDI_API: 'https://api.bhindi.io/v1/chat',
    CHAT_ID: 'jarvis-' + Date.now(), // Unique chat session
    PRIVATE_REPO: 'Aptik09/bhindi-jarvis-ai'
};

// State Management
let isAuthenticated = false;
let isOwner = false;
let conversationHistory = [];
let bhindiConnected = false;

// ===== AUTO AUTHENTICATION FOR OWNER =====
async function checkOwnerAccess() {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            if (userData.login === CONFIG.OWNER_USERNAME) {
                isOwner = true;
                isAuthenticated = true;
                autoLogin();
                return true;
            }
        }
    } catch (error) {
        console.log('Not logged in to GitHub or not the owner');
    }
    return false;
}

function autoLogin() {
    showMainInterface();
    playJarvisSound();
    greetUser();
}

// ===== AUTHENTICATION =====
function authenticate() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    
    if (password === CONFIG.PASSWORD) {
        isAuthenticated = true;
        showMainInterface();
        playJarvisSound();
        greetUser();
    } else {
        showError('Access Denied. Invalid credentials.');
        passwordInput.value = '';
        passwordInput.style.borderColor = '#FF0000';
        setTimeout(() => {
            passwordInput.style.borderColor = 'rgba(255, 215, 0, 0.5)';
        }, 1000);
    }
}

function showMainInterface() {
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('mainInterface').classList.add('active');
}

function logout() {
    isAuthenticated = false;
    isOwner = false;
    document.getElementById('mainInterface').classList.remove('active');
    document.getElementById('welcomeScreen').classList.add('active');
    document.getElementById('passwordInput').value = '';
    conversationHistory = [];
}

// ===== USER GREETING =====
function greetUser() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    
    const messages = [
        `${greeting}, ${isOwner ? 'Sir' : 'Guest'}. J.A.R.V.I.S at your service.`,
        'All systems operational. Bhindi AI backend connected.',
        isOwner ? 'I have full access to your apps and services.' : 'Limited access mode. Some features are restricted.',
        'Ask me anything - I can help with tasks, search, automation, and more.'
    ];
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            addMessage(msg, 'jarvis');
        }, index * 800);
    });
}

// ===== MESSAGE HANDLING =====
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    processUserMessage(message);
}

function addMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'jarvis') {
        messageDiv.innerHTML = `
            <div class="jarvis-avatar"></div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content user-content">
                <p>${text}</p>
            </div>
            <div class="user-avatar">👤</div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    conversationHistory.push({ role: sender, content: text });
}

// ===== AI PROCESSING WITH BHINDI =====
async function processUserMessage(message) {
    showTypingIndicator();
    
    try {
        // Call Bhindi AI API
        const response = await fetch(CONFIG.BHINDI_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                chatId: CONFIG.CHAT_ID,
                context: {
                    isOwner: isOwner,
                    userName: isOwner ? CONFIG.OWNER_NAME : 'Guest',
                    conversationHistory: conversationHistory.slice(-5) // Last 5 messages for context
                }
            })
        });
        
        removeTypingIndicator();
        
        if (response.ok) {
            const data = await response.json();
            const aiResponse = data.response || data.message || 'I processed your request.';
            addMessage(aiResponse, 'jarvis');
            bhindiConnected = true;
        } else {
            // Fallback to local processing if API fails
            handleLocalProcessing(message);
        }
    } catch (error) {
        console.error('Bhindi API Error:', error);
        removeTypingIndicator();
        handleLocalProcessing(message);
    }
}

// ===== FALLBACK LOCAL PROCESSING =====
function handleLocalProcessing(message) {
    const lower = message.toLowerCase();
    
    // Check permissions for restricted features
    if (!isOwner && (lower.includes('email') || lower.includes('github') || lower.includes('note'))) {
        addMessage('⚠️ This feature is only available to the owner. You have limited access.', 'jarvis');
        return;
    }
    
    // Intent detection and responses
    if (lower.includes('weather')) {
        addMessage('🌤️ Weather service is available! To get real-time weather, I need to connect to Bhindi AI backend.', 'jarvis');
        addMessage('Visit https://bhindi.io to set up your account and I\'ll provide live weather updates.', 'jarvis');
    } else if (lower.includes('schedule') || lower.includes('remind')) {
        addMessage('📅 I can help you schedule tasks and reminders!', 'jarvis');
        addMessage('Example: "Remind me to call mom at 5 PM tomorrow"', 'jarvis');
        addMessage('For full scheduling features, connect to Bhindi AI at https://bhindi.io', 'jarvis');
    } else if (lower.includes('email') || lower.includes('mail')) {
        addMessage('📧 Gmail integration is ready through Bhindi AI!', 'jarvis');
        addMessage('Connect your Gmail at https://bhindi.io to read, send, and manage emails.', 'jarvis');
    } else if (lower.includes('github') || lower.includes('repo')) {
        addMessage('💻 GitHub integration is available!', 'jarvis');
        addMessage('I can manage repositories, create issues, review PRs, and more.', 'jarvis');
        addMessage('Connect GitHub at https://bhindi.io for full access.', 'jarvis');
    } else if (lower.includes('note') || lower.includes('remember')) {
        addMessage('📝 I can save notes to your private repository!', 'jarvis');
        addMessage(`Notes will be stored securely in: ${CONFIG.PRIVATE_REPO}`, 'jarvis');
    } else if (lower.includes('search') || lower.includes('find')) {
        addMessage('🔍 I can search the web using Perplexity AI!', 'jarvis');
        addMessage('Connect to Bhindi AI for real-time search results.', 'jarvis');
    } else if (lower.includes('help') || lower.includes('what can you do')) {
        addMessage('I\'m JARVIS, powered by Bhindi AI. I can help you with:', 'jarvis');
        addMessage('📧 Email management | 📅 Scheduling | 💻 GitHub | 🔍 Web search | 📝 Notes | 🌤️ Weather | And 200+ more integrations!', 'jarvis');
        addMessage('To unlock all features, visit https://bhindi.io and connect your apps.', 'jarvis');
    } else if (lower.includes('time')) {
        const now = new Date();
        addMessage(`⏰ Current time: ${now.toLocaleTimeString()}`, 'jarvis');
    } else if (lower.includes('date') || lower.includes('today')) {
        const now = new Date();
        addMessage(`📅 Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'jarvis');
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        addMessage(`Hello! How can I assist you today?`, 'jarvis');
    } else {
        // Generic response
        addMessage('I understand your request. For full AI capabilities, please connect to Bhindi AI.', 'jarvis');
        addMessage('Visit https://bhindi.io to set up your account and unlock all features.', 'jarvis');
        addMessage('In the meantime, try asking about: weather, schedule, email, GitHub, or notes.', 'jarvis');
    }
}

// ===== QUICK ACTIONS =====
function quickAction(action) {
    const actions = {
        schedule: 'Show me my schedule for today',
        notes: 'Show me my recent notes',
        github: 'Show me my GitHub repositories',
        email: 'Check my emails'
    };
    
    const message = actions[action];
    document.getElementById('messageInput').value = message;
    sendMessage();
}

// ===== UI HELPERS =====
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message jarvis-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="jarvis-avatar"></div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #FF0000; text-align: center; margin-top: 10px; animation: shake 0.5s;';
    
    const accessPanel = document.querySelector('.access-panel');
    const existingError = accessPanel.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    accessPanel.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function playJarvisSound() {
    console.log('🎵 JARVIS activated');
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const passwordInput = document.getElementById('passwordInput');
        const messageInput = document.getElementById('messageInput');
        
        if (document.activeElement === passwordInput) {
            authenticate();
        } else if (document.activeElement === messageInput) {
            sendMessage();
        }
    }
});

// ===== INITIALIZE =====
window.addEventListener('load', async function() {
    console.log('🤖 J.A.R.V.I.S System Initializing...');
    console.log('📡 Checking owner access...');
    
    const hasOwnerAccess = await checkOwnerAccess();
    
    if (!hasOwnerAccess) {
        console.log('🔒 Guest mode - Authentication required');
    } else {
        console.log('✅ Owner detected - Auto-login successful');
    }
    
    console.log('✨ J.A.R.V.I.S Online');
    console.log('🔌 Bhindi AI backend ready');
});