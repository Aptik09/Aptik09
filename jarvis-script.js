// ===== JARVIS AI SYSTEM - BHINDI POWERED =====
const CONFIG = {
    OWNER_USERNAME: 'Aptik09',
    OWNER_NAME: 'Aptik Pandey',
    PASSWORD: 'jarvis2024',
    PRIVATE_REPO: 'Aptik09/bhindi-jarvis-ai'
};

let isAuthenticated = false;
let isOwner = false;
let conversationHistory = [];

// ===== AUTO AUTHENTICATION =====
async function checkOwnerAccess() {
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
                autoLogin();
                return true;
            }
        }
    } catch (error) {
        console.log('Not logged in to GitHub');
    }
    return false;
}

function autoLogin() {
    showMainInterface();
    greetUser();
}

// ===== AUTHENTICATION =====
function authenticate() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    
    if (password === CONFIG.PASSWORD) {
        isAuthenticated = true;
        showMainInterface();
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

// ===== GREETING =====
function greetUser() {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    const messages = [
        `${greeting}, ${isOwner ? 'Sir' : 'Guest'}. J.A.R.V.I.S at your service.`,
        'All systems operational. I\'m ready to assist you.',
        isOwner ? 'I can help with GitHub, scheduling, notes, weather, and more.' : 'Limited access mode active.',
        'What can I do for you today?'
    ];
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    messages.forEach((msg, index) => {
        setTimeout(() => addMessage(msg, 'jarvis'), index * 800);
    });
}

// ===== MESSAGING =====
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    processMessage(message);
}

function addMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'jarvis') {
        messageDiv.innerHTML = `
            <div class="jarvis-avatar"></div>
            <div class="message-content"><p>${text}</p></div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content user-content"><p>${text}</p></div>
            <div class="user-avatar">👤</div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    conversationHistory.push({ role: sender, content: text });
}

// ===== MESSAGE PROCESSING =====
async function processMessage(message) {
    showTypingIndicator();
    await new Promise(resolve => setTimeout(resolve, 1000));
    removeTypingIndicator();
    
    const lower = message.toLowerCase();
    
    // Permission check
    if (!isOwner && (lower.includes('email') || lower.includes('github') || lower.includes('private'))) {
        addMessage('⚠️ This feature is restricted to the owner only.', 'jarvis');
        return;
    }
    
    // Greetings
    if (lower.match(/\b(hi|hello|hey|greetings)\b/)) {
        const greetings = [
            'Hello! How may I assist you?',
            'Greetings! What can I do for you?',
            'Hi there! Ready to help.',
            'Hello! I\'m at your service.'
        ];
        addMessage(greetings[Math.floor(Math.random() * greetings.length)], 'jarvis');
        return;
    }
    
    // Time
    if (lower.includes('time')) {
        const now = new Date();
        addMessage(`⏰ Current time: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`, 'jarvis');
        return;
    }
    
    // Date
    if (lower.includes('date') || lower.includes('today')) {
        const now = new Date();
        addMessage(`📅 Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'jarvis');
        return;
    }
    
    // Weather
    if (lower.includes('weather')) {
        addMessage('🌤️ Weather service available!', 'jarvis');
        addMessage('For real-time weather data, connect to Bhindi AI at https://bhindi.io', 'jarvis');
        addMessage('Once connected, I can provide detailed weather forecasts for any location.', 'jarvis');
        return;
    }
    
    // Schedule/Reminders
    if (lower.includes('schedule') || lower.includes('remind')) {
        addMessage('📅 Scheduling capabilities ready!', 'jarvis');
        addMessage('I can create reminders and scheduled tasks through Bhindi AI.', 'jarvis');
        addMessage('Example: "Remind me to call mom at 5 PM tomorrow"', 'jarvis');
        addMessage('Connect at https://bhindi.io for full scheduling features.', 'jarvis');
        return;
    }
    
    // Email
    if (lower.includes('email') || lower.includes('mail')) {
        addMessage('📧 Email management available!', 'jarvis');
        addMessage('Through Bhindi AI, I can:', 'jarvis');
        addMessage('• Read and organize your emails\n• Send emails\n• Search your inbox\n• Set up filters', 'jarvis');
        addMessage('Connect Gmail at https://bhindi.io', 'jarvis');
        return;
    }
    
    // GitHub
    if (lower.includes('github') || lower.includes('repo')) {
        addMessage('💻 GitHub integration ready!', 'jarvis');
        addMessage('I can help you:', 'jarvis');
        addMessage('• Manage repositories\n• Create and close issues\n• Review pull requests\n• Check commit history', 'jarvis');
        addMessage('Connect GitHub at https://bhindi.io', 'jarvis');
        return;
    }
    
    // Notes
    if (lower.includes('note') || lower.includes('remember') || lower.includes('save')) {
        addMessage('📝 Note-taking system active!', 'jarvis');
        addMessage(`Your notes are securely stored in: ${CONFIG.PRIVATE_REPO}`, 'jarvis');
        addMessage('I can save and retrieve notes for you through Bhindi AI.', 'jarvis');
        return;
    }
    
    // Search
    if (lower.includes('search') || lower.includes('find') || lower.includes('look up')) {
        addMessage('🔍 Web search powered by Perplexity AI!', 'jarvis');
        addMessage('I can search the web for accurate, real-time information.', 'jarvis');
        addMessage('Connect to Bhindi AI for live search results.', 'jarvis');
        return;
    }
    
    // Help
    if (lower.includes('help') || lower.includes('what can you do') || lower.includes('capabilities')) {
        addMessage('🤖 I\'m JARVIS - Your Personal AI Assistant', 'jarvis');
        addMessage('**Current Capabilities:**', 'jarvis');
        addMessage('✅ Time & Date information\n✅ Basic conversations\n✅ System status', 'jarvis');
        addMessage('**With Bhindi AI Connection:**', 'jarvis');
        addMessage('📧 Email • 📅 Calendar • 💻 GitHub • 🔍 Search • 🌤️ Weather • 📝 Notes • And 200+ more!', 'jarvis');
        addMessage('Visit https://bhindi.io to unlock full capabilities.', 'jarvis');
        return;
    }
    
    // Status
    if (lower.includes('status') || lower.includes('how are you')) {
        addMessage('✅ All systems operational!', 'jarvis');
        addMessage('Core functions: Online ✓', 'jarvis');
        addMessage('Authentication: Active ✓', 'jarvis');
        addMessage('Bhindi AI: Ready for connection', 'jarvis');
        return;
    }
    
    // Bhindi/Setup
    if (lower.includes('bhindi') || lower.includes('setup') || lower.includes('connect')) {
        addMessage('🔗 Bhindi AI Setup Guide:', 'jarvis');
        addMessage('1️⃣ Visit https://bhindi.io', 'jarvis');
        addMessage('2️⃣ Create your account', 'jarvis');
        addMessage('3️⃣ Connect your apps (GitHub, Gmail, etc.)', 'jarvis');
        addMessage('4️⃣ Start using JARVIS with full AI power!', 'jarvis');
        addMessage('📚 Documentation: https://docs.bhindi.io', 'jarvis');
        return;
    }
    
    // Default response
    const responses = [
        'I understand. For advanced AI responses, please connect to Bhindi AI.',
        'Interesting question! Connect to Bhindi AI for detailed answers.',
        'I can help better with Bhindi AI connected. Visit https://bhindi.io',
        'That\'s a great question! Full AI capabilities available at https://bhindi.io'
    ];
    addMessage(responses[Math.floor(Math.random() * responses.length)], 'jarvis');
    addMessage('Try asking about: time, date, weather, schedule, email, GitHub, or help.', 'jarvis');
}

// ===== QUICK ACTIONS =====
function quickAction(action) {
    const actions = {
        schedule: 'Show me my schedule',
        notes: 'Show my notes',
        github: 'Show my GitHub repositories',
        email: 'Check my emails'
    };
    document.getElementById('messageInput').value = actions[action];
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
    errorDiv.style.cssText = 'color: #FF0000; text-align: center; margin-top: 10px;';
    
    const accessPanel = document.querySelector('.access-panel');
    const existingError = accessPanel.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    accessPanel.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// ===== KEYBOARD EVENTS =====
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
    console.log('🤖 J.A.R.V.I.S Initializing...');
    const hasOwnerAccess = await checkOwnerAccess();
    console.log(hasOwnerAccess ? '✅ Owner auto-login' : '🔒 Guest mode');
    console.log('✨ J.A.R.V.I.S Online');
});