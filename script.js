// Generate stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

// Generate particles around orb
const orb = document.getElementById('orb');
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const angle = (Math.PI * 2 * i) / 20;
    const distance = 150;
    particle.style.left = Math.cos(angle) * distance + 125 + 'px';
    particle.style.top = Math.sin(angle) * distance + 125 + 'px';
    particle.style.animationDelay = (i * 0.2) + 's';
    orb.appendChild(particle);
}

// Password unlock - CHANGE THIS PASSWORD TO YOUR OWN
const PASSWORD = 'jarvis2025';

function unlock() {
    const input = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMessage');
    
    if (input.value === PASSWORD) {
        document.getElementById('lockScreen').classList.add('hidden');
        document.getElementById('jarvisOrb').style.display = 'none';
        document.getElementById('welcomeText').style.display = 'none';
        document.getElementById('chatInterface').classList.add('active');
        errorMsg.style.display = 'none';
    } else {
        errorMsg.style.display = 'block';
        input.value = '';
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

// Enter key to unlock
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        unlock();
    }
});

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message and get AI response
        setTimeout(() => {
            hideTypingIndicator();
            const response = processMessage(message);
            addMessage(response, 'assistant');
        }, 1000);
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.textContent = 'JARVIS is thinking...';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello, Aptik! How can I assist you today?";
    }
    
    // Time queries
    if (lowerMessage.includes('time')) {
        const now = new Date();
        return `The current time is ${now.toLocaleTimeString()}.`;
    }
    
    // Date queries
    if (lowerMessage.includes('date') || lowerMessage.includes('today')) {
        const now = new Date();
        return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    }
    
    // Weather queries
    if (lowerMessage.includes('weather')) {
        return "I'm currently in development mode. Weather integration will be available soon through the backend API.";
    }
    
    // Email queries
    if (lowerMessage.includes('email')) {
        return "Email integration is being set up. Soon I'll be able to read, send, and manage your emails.";
    }
    
    // Calendar queries
    if (lowerMessage.includes('calendar') || lowerMessage.includes('schedule')) {
        return "Calendar integration is in progress. I'll soon be able to manage your appointments and reminders.";
    }
    
    // GitHub queries
    if (lowerMessage.includes('github') || lowerMessage.includes('repository') || lowerMessage.includes('repo')) {
        return "GitHub integration is being configured. I'll be able to manage your repositories, issues, and pull requests.";
    }
    
    // Help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return "I'm JARVIS, your personal AI assistant. I'm currently being built to help you with:\n\n• Email management\n• Calendar & scheduling\n• GitHub operations\n• Web search & research\n• Task automation\n• Note-taking & memory\n• And much more!\n\nI'm in development mode, but more features are being added every day.";
    }
    
    // Status queries
    if (lowerMessage.includes('status') || lowerMessage.includes('how are you')) {
        return "All systems operational. I'm running in development mode and learning new capabilities. How can I help you?";
    }
    
    // Default response
    return "I understand your request. I'm currently in development mode, but I'm learning fast. Soon I'll have full access to all your apps and services. Is there anything else I can help you with?";
}

// Enter key to send message
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
document.getElementById('chatInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Initialize
console.log('JARVIS initialized successfully');
console.log('Version: 1.0.0 (Development Mode)');
console.log('Status: Online');
console.log('Owner: Aptik Pandey');
console.log('Repository: https://github.com/Aptik09/Aptik09');