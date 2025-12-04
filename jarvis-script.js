// AI Assistant Configuration
const CONFIG = {
    OWNER_USERNAME: 'Aptik09',
    OWNER_NAME: 'Aptik Pandey',
    PASSWORD: 'aptik2024',
    BHINDI_API_URL: 'https://api.bhindi.io/v1/chat',
    CHAT_ID: null
};

let isAuthenticated = false;
let isOwner = false;
let bhindiApiKey = null;

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
    
    // Load Bhindi API key from localStorage
    bhindiApiKey = localStorage.getItem('bhindi_api_key');
}

// Logout
function logout() {
    isAuthenticated = false;
    isOwner = false;
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
        'I can help you with tasks, answer questions, and automate workflows.',
        'What can I help you with today?'
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => addMessage(msg, 'assistant'), index * 600);
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
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process with Bhindi AI if available, otherwise use fallback
    if (bhindiApiKey) {
        await processBhindiMessage(message);
    } else {
        await processFallbackMessage(message);
    }
    
    removeTypingIndicator();
}

// Process message with Bhindi AI
async function processBhindiMessage(message) {
    try {
        const response = await fetch(CONFIG.BHINDI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bhindiApiKey}`
            },
            body: JSON.stringify({
                chatId: CONFIG.CHAT_ID,
                message: message
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            addMessage(data.response, 'assistant');
            CONFIG.CHAT_ID = data.chatId;
        } else {
            throw new Error('API request failed');
        }
    } catch (error) {
        console.error('Bhindi AI error:', error);
        addMessage('I encountered an error connecting to the AI backend. Using fallback mode.', 'assistant');
        await processFallbackMessage(message);
    }
}

// Fallback message processing
async function processFallbackMessage(message) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lower = message.toLowerCase();
    
    // Greetings
    if (lower.match(/\b(hi|hello|hey|greetings)\b/)) {
        addMessage('Hello! How can I assist you today?', 'assistant');
        return;
    }
    
    // Time
    if (lower.includes('time')) {
        const now = new Date();
        addMessage(`Current time: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`, 'assistant');
        return;
    }
    
    // Date
    if (lower.includes('date') || lower.includes('today')) {
        const now = new Date();
        addMessage(`Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'assistant');
        return;
    }
    
    // Setup Bhindi
    if (lower.includes('setup') || lower.includes('connect') || lower.includes('bhindi')) {
        addMessage('To unlock full AI capabilities:', 'assistant');
        addMessage('1. Visit https://bhindi.io and create an account', 'assistant');
        addMessage('2. Generate an API key from Settings', 'assistant');
        addMessage('3. Save it here by typing: /setkey YOUR_API_KEY', 'assistant');
        return;
    }
    
    // Set API key
    if (lower.startsWith('/setkey ')) {
        const key = message.substring(8).trim();
        if (key.length > 20) {
            localStorage.setItem('bhindi_api_key', key);
            bhindiApiKey = key;
            addMessage('✓ API key saved successfully! Full AI capabilities are now active.', 'assistant');
        } else {
            addMessage('Invalid API key format. Please check and try again.', 'assistant');
        }
        return;
    }
    
    // Help
    if (lower.includes('help') || lower.includes('what can you do')) {
        addMessage('I can help you with:', 'assistant');
        addMessage('• Answering questions\n• Time and date information\n• General assistance', 'assistant');
        addMessage('\nFor advanced features (scheduling, email, GitHub, etc.), connect to Bhindi AI by typing "setup"', 'assistant');
        return;
    }
    
    // Status
    if (lower.includes('status')) {
        const status = bhindiApiKey ? 'Connected ✓' : 'Not connected';
        addMessage(`System Status: Online ✓\nBhindi AI: ${status}`, 'assistant');
        return;
    }
    
    // Default response
    addMessage('I understand you\'re asking about: "' + message + '"', 'assistant');
    addMessage('For more intelligent responses, connect to Bhindi AI by typing "setup"', 'assistant');
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
