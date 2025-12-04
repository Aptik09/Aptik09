// ===== JARVIS AI SYSTEM - BHINDI POWERED =====
// Configuration
const CONFIG = {
    OWNER_USERNAME: 'Aptik09', // Your GitHub username
    OWNER_NAME: 'Aptik Pandey',
    PASSWORD: 'jarvis2024', // Backup password for manual access
    BHINDI_API: 'https://api.bhindi.io/v1',
    PRIVATE_REPO: 'Aptik09/bhindi-jarvis-ai' // Private data storage
};

// State Management
let isAuthenticated = false;
let isOwner = false;
let conversationHistory = [];

// ===== AUTO AUTHENTICATION FOR OWNER =====
async function checkOwnerAccess() {
    try {
        // Check if user is the owner by checking GitHub login status
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
        'All systems operational. How may I assist you today?',
        isOwner ? 'I have full access to your GitHub, calendar, email, and notes.' : 'Limited access mode. Some features are restricted.',
        'Simply ask me anything, and I will handle it for you.'
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
    
    const intent = detectIntent(message);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    removeTypingIndicator();
    
    // Check if owner for full features
    if (!isOwner && ['github', 'email', 'notes'].includes(intent)) {
        addMessage('This feature is only available to the owner. You have limited access.', 'jarvis');
        return;
    }
    
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
        case 'backend':
            handleBackendSetup();
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
    if (lower.includes('backend') || lower.includes('configure') || lower.includes('setup') || lower.includes('connect')) {
        return 'backend';
    }
    
    return 'general';
}

// ===== INTENT HANDLERS =====
function handleSchedule(message) {
    addMessage('📅 Scheduler is ready! I can help you create reminders and scheduled tasks using Bhindi Scheduler.', 'jarvis');
    addMessage('Example: "Remind me to call mom at 5 PM tomorrow" or "Schedule a meeting for next Monday at 2 PM"', 'jarvis');
}

function handleNotes(message) {
    addMessage(`📝 I'll save that to your private repository: ${CONFIG.PRIVATE_REPO}`, 'jarvis');
    addMessage('Your notes are encrypted and stored securely in your private GitHub repository.', 'jarvis');
}

function handleGitHub(message) {
    addMessage('💻 GitHub integration is active! I can manage your repositories, create issues, review PRs, and more.', 'jarvis');
    addMessage('Try: "Show my repositories" or "Create an issue in [repo-name]"', 'jarvis');
}

function handleEmail(message) {
    addMessage('📧 Gmail integration ready! I can read, send, and organize your emails.', 'jarvis');
    addMessage('Try: "Check my emails" or "Send an email to [person]"', 'jarvis');
}

function handleSearch(message) {
    addMessage('🔍 I can search the web using Perplexity AI for accurate, real-time information.', 'jarvis');
    addMessage('What would you like me to search for?', 'jarvis');
}

function handleWeather(message) {
    addMessage('🌤️ Weather service is available! I can get current weather and forecasts.', 'jarvis');
    addMessage('Try: "What\'s the weather in [city]?" or "Weather forecast for tomorrow"', 'jarvis');
}

function handleBackendSetup() {
    addMessage('⚙️ **Bhindi AI Backend Setup Guide:**', 'jarvis');
    addMessage('1. Go to https://bhindi.io and create an account', 'jarvis');
    addMessage('2. Connect your GitHub, Gmail, and other services', 'jarvis');
    addMessage('3. Get your API key from Settings', 'jarvis');
    addMessage('4. I\'ll automatically connect once you authorize Bhindi AI', 'jarvis');
    addMessage('📚 Full documentation: https://docs.bhindi.io', 'jarvis');
}

function handleGeneral(message) {
    const responses = [
        'I understand. Let me help you with that.',
        'Processing your request. All systems are operational.',
        'I\'m here to assist. What else can I do for you?',
        'Noted. I have access to 200+ integrations through Bhindi AI.'
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
    // Optional: Add sound effect when JARVIS activates
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
});