// ===== JARVIS AI SYSTEM =====
// Configuration
const CONFIG = {
    PASSWORD: 'jarvis2024', // Change this to your secure password
    API_ENDPOINT: 'https://api.bhindi.io/v1', // Will be configured later
    GITHUB_REPO: 'Aptik09/jarvis-brain',
    OWNER_NAME: 'Aptik Pandey'
};

// State Management
let isAuthenticated = false;
let conversationHistory = [];

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
        `${greeting}, Sir. J.A.R.V.I.S at your service.`,
        'All systems operational. How may I assist you today?',
        'I have access to your GitHub, calendar, email, and notes.',
        'Simply ask me anything, and I will handle it for you.'
    ];
    
    // Clear welcome message and add greeting
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
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Process message
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
    
    // Add to conversation history
    conversationHistory.push({ role: sender, content: text });
}

// ===== AI PROCESSING =====
async function processUserMessage(message) {
    // Show typing indicator
    showTypingIndicator();
    
    // Detect intent
    const intent = detectIntent(message);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Handle based on intent
    switch (intent) {
        case 'schedule':
            handleSchedule(message);
            break;
        case 'notes':
            handleNotes(message);
            break;
        case 'github':
            handleGitHub(message);
            break;
        case 'email':
            handleEmail(message);
            break;
        case 'search':
            handleSearch(message);
            break;
        case 'weather':
            handleWeather(message);
            break;
        default:
            handleGeneral(message);
    }
}

function detectIntent(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('schedule') || lower.includes('remind') || lower.includes('calendar')) {
        return 'schedule';
    }
    if (lower.includes('note') || lower.includes('remember') || lower.includes('save')) {
        return 'notes';
    }
    if (lower.includes('github') || lower.includes('repo') || lower.includes('code')) {
        return 'github';
    }
    if (lower.includes('email') || lower.includes('mail') || lower.includes('send')) {
        return 'email';
    }
    if (lower.includes('search') || lower.includes('find') || lower.includes('look up')) {
        return 'search';
    }
    if (lower.includes('weather') || lower.includes('temperature')) {
        return 'weather';
    }
    
    return 'general';
}

// ===== INTENT HANDLERS =====
function handleSchedule(message) {
    addMessage('I can help you schedule tasks and reminders. This feature will be connected to Bhindi Scheduler once the backend is configured.', 'jarvis');
    addMessage('For now, I\'ve noted your request: "' + message + '"', 'jarvis');
}

function handleNotes(message) {
    addMessage('I will remember that for you, Sir. This will be stored in your private GitHub repository once the backend is configured.', 'jarvis');
}

function handleGitHub(message) {
    addMessage('GitHub integration is ready. I can help you manage repositories, create issues, and review code once the API is connected.', 'jarvis');
}

function handleEmail(message) {
    addMessage('Email functionality will be available once you connect your Gmail account through the backend configuration.', 'jarvis');
}

function handleSearch(message) {
    addMessage('I can search the web for you using Perplexity AI once the backend is configured. For now, I\'ve noted your query.', 'jarvis');
}

function handleWeather(message) {
    addMessage('Weather information will be available once the OpenWeather API is connected.', 'jarvis');
}

function handleGeneral(message) {
    const responses = [
        'I understand, Sir. Let me process that for you.',
        'Interesting question. The full AI capabilities will be available once the backend is configured.',
        'I\'m here to help. This feature requires the Bhindi AI backend connection.',
        'Noted. I will be able to provide more detailed responses once all systems are online.'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    addMessage(response, 'jarvis');
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
    if (indicator) {
        indicator.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid #FF0000;
        color: #FF6B6B;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

function playJarvisSound() {
    // Optional: Add Jarvis sound effect
    const audio = document.getElementById('jarvisSound');
    if (audio) {
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Enter key for password
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                authenticate();
            }
        });
    }
    
    // Enter key for messages
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: flex;
            gap: 5px;
            padding: 10px 0;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #FFD700;
            border-radius: 50%;
            animation: typingBounce 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        .user-message {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
        }
        
        .user-content {
            background: rgba(255, 165, 0, 0.2);
            border: 1px solid rgba(255, 165, 0, 0.4);
        }
        
        .user-avatar {
            width: 50px;
            height: 50px;
            background: rgba(255, 165, 0, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== BACKEND API INTEGRATION (To be implemented) =====
class JarvisAPI {
    constructor() {
        this.baseURL = CONFIG.API_ENDPOINT;
        this.token = null;
    }
    
    async initialize() {
        // Will connect to Bhindi AI backend
        console.log('Initializing Jarvis AI backend...');
    }
    
    async sendMessage(message) {
        // Will send message to Bhindi AI
        console.log('Sending to AI:', message);
    }
    
    async getSchedules() {
        // Will fetch from Bhindi Scheduler
        console.log('Fetching schedules...');
    }
    
    async getNotes() {
        // Will fetch from Bhindi Notes
        console.log('Fetching notes...');
    }
    
    async searchWeb(query) {
        // Will use Perplexity Search
        console.log('Searching web:', query);
    }
}

// Initialize API
const jarvisAPI = new JarvisAPI();

console.log('J.A.R.V.I.S System Loaded');
console.log('Version: 1.0.0');
console.log('Status: Ready for configuration');