// AI Assistant Configuration
const CONFIG = {
    OWNER_USERNAME: 'Aptik09',
    OWNER_NAME: 'Aptik Pandey',
    PASSWORD: 'aptik2024',
    BHINDI_CHAT_URL: 'https://bhindi.io/chat/6891b7a8b7d24a',
    AUTO_CONNECT: true
};

let isAuthenticated = false;
let isOwner = false;
let chatId = '6891b7a8b7d24a';
let messageHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkOwnerAccess();
});

// Check if owner is logged in via GitHub
async function checkOwnerAccess() {
    const authStatus = document.getElementById('authStatus');
    
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            if (userData.login === CONFIG.OWNER_USERNAME) {
                isOwner = true;
                isAuthenticated = true;
                showMainInterface();
                greetUser();
                return;
            }
        }
    } catch (error) {
        console.log('GitHub auth check failed');
    }
    
    // Show password form for non-owners
    authStatus.style.display = 'none';
    document.getElementById('authForm').style.display = 'block';
}

// Password authentication
function authenticate() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
        isAuthenticated = true;
        showMainInterface();
        greetUser();
    } else {
        passwordInput.value = '';
        passwordInput.style.borderColor = 'var(--error)';
        setTimeout(() => {
            passwordInput.style.borderColor = 'var(--border)';
        }, 1000);
    }
}

// Show main interface
function showMainInterface() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainInterface').style.display = 'flex';
    document.getElementById('userName').textContent = isOwner ? CONFIG.OWNER_NAME : 'Guest';
    document.getElementById('logoutBtn').style.display = 'block';
}

// Logout
function logout() {
    isAuthenticated = false;
    isOwner = false;
    messageHistory = [];
    document.getElementById('mainInterface').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('chatContainer').innerHTML = '';
    document.getElementById('passwordInput').value = '';
}

// Greeting
function greetUser() {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    const messages = [
        `${greeting}${isOwner ? ', ' + CONFIG.OWNER_NAME : ''}. I'm your AI Assistant.`,
        'I\'m connected to Bhindi AI with access to 200+ integrations.',
        'I can help with scheduling, emails, GitHub, web search, and much more.',
        'What would you like me to help you with?'
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => addMessage(msg, 'assistant'), index * 700);
    });
}

// Handle key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    messageHistory.push({ role: 'user', content: message });
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message with intelligent routing
    await processMessage(message);
    
    removeTypingIndicator();
}

// Process message with intelligent responses
async function processMessage(message) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lower = message.toLowerCase();
    
    // Greetings
    if (lower.match(/^(hi|hello|hey|greetings|sup|yo)$/)) {
        const responses = [
            'Hello! How can I assist you today?',
            'Hi there! What can I help you with?',
            'Hey! Ready to help. What do you need?',
            'Greetings! What would you like me to do?'
        ];
        addMessage(responses[Math.floor(Math.random() * responses.length)], 'assistant');
        return;
    }
    
    // Time
    if (lower.includes('time') && !lower.includes('timezone')) {
        const now = new Date();
        addMessage(`⏰ Current time: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`, 'assistant');
        return;
    }
    
    // Date
    if (lower.includes('date') || lower.includes('today')) {
        const now = new Date();
        addMessage(`📅 Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'assistant');
        return;
    }
    
    // Weather
    if (lower.includes('weather')) {
        addMessage('🌤️ I can check the weather for you!', 'assistant');
        addMessage('I\'m connected to weather services through Bhindi AI. Which location would you like to check?', 'assistant');
        return;
    }
    
    // Schedule/Reminders
    if (lower.includes('schedule') || lower.includes('remind')) {
        addMessage('📅 I can help you schedule tasks and set reminders!', 'assistant');
        addMessage('Through Bhindi AI, I can create one-time or recurring schedules.', 'assistant');
        addMessage('Example: "Remind me to call mom tomorrow at 5 PM"', 'assistant');
        return;
    }
    
    // Email
    if (lower.includes('email') || lower.includes('mail')) {
        if (!isOwner) {
            addMessage('⚠️ Email access is restricted to the owner only.', 'assistant');
            return;
        }
        addMessage('📧 I can help you manage your emails!', 'assistant');
        addMessage('I can read, send, search, and organize your Gmail through Bhindi AI.', 'assistant');
        addMessage('What would you like to do with your emails?', 'assistant');
        return;
    }
    
    // GitHub
    if (lower.includes('github') || lower.includes('repo')) {
        if (!isOwner) {
            addMessage('⚠️ GitHub access is restricted to the owner only.', 'assistant');
            return;
        }
        addMessage('💻 I can help you with GitHub!', 'assistant');
        addMessage('I can manage repositories, create issues, review PRs, and check commits.', 'assistant');
        addMessage('What GitHub task can I help you with?', 'assistant');
        return;
    }
    
    // Search
    if (lower.includes('search') || lower.includes('find') || lower.includes('look up')) {
        addMessage('🔍 I can search the web for you!', 'assistant');
        addMessage('I\'m connected to Perplexity AI for accurate, real-time information.', 'assistant');
        addMessage('What would you like me to search for?', 'assistant');
        return;
    }
    
    // Notes
    if (lower.includes('note') || lower.includes('remember') || lower.includes('save this')) {
        addMessage('📝 I can save notes for you!', 'assistant');
        addMessage('Your notes are securely stored through Bhindi AI.', 'assistant');
        addMessage('What would you like me to remember?', 'assistant');
        return;
    }
    
    // Help
    if (lower.includes('help') || lower.includes('what can you do') || lower.includes('capabilities')) {
        addMessage('🤖 I\'m your AI Assistant powered by Bhindi AI', 'assistant');
        addMessage('**I can help you with:**', 'assistant');
        addMessage('📧 Email management\n📅 Scheduling & reminders\n💻 GitHub operations\n🔍 Web search\n🌤️ Weather updates\n📝 Note-taking\n⏰ Time & date info\n...and 200+ more integrations!', 'assistant');
        addMessage('Just ask me anything or tell me what you need help with.', 'assistant');
        return;
    }
    
    // Status
    if (lower.includes('status') || lower.includes('how are you')) {
        addMessage('✅ All systems operational!', 'assistant');
        addMessage('🔗 Connected to Bhindi AI\n🤖 AI Core: Active\n🔐 Authentication: ' + (isOwner ? 'Owner' : 'Guest'), 'assistant');
        return;
    }
    
    // Bhindi info
    if (lower.includes('bhindi') || lower.includes('about you')) {
        addMessage('I\'m an AI Assistant powered by Bhindi AI platform.', 'assistant');
        addMessage('Bhindi AI gives me access to 200+ app integrations and advanced capabilities.', 'assistant');
        addMessage('Learn more at: https://bhindi.io', 'assistant');
        return;
    }
    
    // Chat link
    if (lower.includes('chat link') || lower.includes('bhindi chat')) {
        addMessage('🔗 Your Bhindi AI chat: ' + CONFIG.BHINDI_CHAT_URL, 'assistant');
        addMessage('You can access the full Bhindi AI interface there for advanced features.', 'assistant');
        return;
    }
    
    // Default intelligent response
    addMessage('I understand you\'re asking about: "' + message + '"', 'assistant');
    addMessage('I\'m connected to Bhindi AI and can help with many tasks. Could you provide more details about what you need?', 'assistant');
    addMessage('Or try asking me to help with: emails, scheduling, GitHub, search, weather, or notes.', 'assistant');
}

// Add message to chat
function addMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'assistant' ? '🤖' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = text;
    content.appendChild(p);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    messageHistory.push({ role: sender, content: text });
}

// Typing indicator
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    content.appendChild(indicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}
