/**
 * Dynamite Sports Learner – Basketball Coach
 * Main JavaScript Application
 */

// ===== STATE MANAGEMENT =====
const appState = {
    chatOpen: false,
};

// ===== DOM ELEMENTS =====
const chatToggleButton = document.getElementById('chat-toggle-button');
const footerCtaButton = document.getElementById('footer-cta-button');
const mobileChatButton = document.getElementById('mobile-chat-button');
const chatPanel = document.getElementById('chat-panel');
const navLinks = document.querySelectorAll('.nav-link');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    restoreChatState();
    initializeScrollAnimations();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Chat toggle functionality
    chatToggleButton.addEventListener('click', toggleChat);
    footerCtaButton.addEventListener('click', toggleChat);
    mobileChatButton.addEventListener('click', toggleChat);

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Keyboard accessibility
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Responsive chat button visibility
    window.addEventListener('resize', debounce(updateChatButtonVisibility, 250));
}

// ===== CHAT FUNCTIONALITY =====
function toggleChat() {
    appState.chatOpen = !appState.chatOpen;
    
    if (appState.chatOpen) {
        openChat();
    } else {
        closeChat();
    }

    // Persist state
    localStorage.setItem('chatOpen', JSON.stringify(appState.chatOpen));
}

function openChat() {
    chatPanel.classList.add('active');
    mobileChatButton.classList.add('active');
    
    // Announce for accessibility
    announceToScreenReader('Chat window opened. Your basketball coach is ready to help!');
    
    // Focus management
    chatPanel.focus();
}

function closeChat() {
    chatPanel.classList.remove('active');
    mobileChatButton.classList.remove('active');
    
    // Announce for accessibility
    announceToScreenReader('Chat window closed.');
}

function restoreChatState() {
    const savedState = localStorage.getItem('chatOpen');
    if (savedState === 'true') {
        appState.chatOpen = false; // Set to false initially
        toggleChat(); // Toggle to true
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections and cards
    document.querySelectorAll('section, .about-card, .features-list li').forEach(el => {
        observer.observe(el);
    });
}

// ===== NAVIGATION =====
function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    // If it's an internal link, handle smooth scroll
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            
            // Update active nav link
            navLinks.forEach(link => link.classList.remove('active'));
            e.currentTarget.classList.add('active');
        }
    }
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Shift + C to toggle chat
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        toggleChat();
    }

    // Escape key to close chat
    if (e.key === 'Escape' && appState.chatOpen) {
        closeChat();
    }
}

// ===== UTILITY FUNCTIONS =====
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => announcement.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function updateChatButtonVisibility() {
    const isMobile = window.innerWidth <= 768;
    mobileChatButton.style.display = isMobile ? 'flex' : 'none';
}

// ===== CHATBOT INTEGRATION HELPER =====
/**
 * Use this function to embed your AI chatbot
 * Replace 'YOUR_CHATBOT_URL' with your actual chatbot endpoint
 * 
 * Example usage:
 * embedChatbot('https://your-chatbot-service.com/chat');
 */
function embedChatbot(chatbotUrl) {
    const chatPlaceholder = document.querySelector('.chat-placeholder');
    const iframe = document.createElement('iframe');
    
    iframe.id = 'chatbot';
    iframe.src = chatbotUrl;
    iframe.title = 'AI Basketball Coach';
    iframe.setAttribute('allow', 'camera; microphone; autoplay');
    iframe.setAttribute('loading', 'lazy');
    
    // Clear placeholder content
    chatPlaceholder.innerHTML = '';
    chatPlaceholder.appendChild(iframe);
    
    // Log for debugging
    console.log('Chatbot embedded successfully:', chatbotUrl);
}

/**
 * Alternative: Use this function for a custom messaging system
 * Example usage:
 * initializeCustomChat({ apiEndpoint: 'https://your-api.com/chat' });
 */
function initializeCustomChat(config) {
    const { apiEndpoint, welcomeMessage } = config;

    console.log('Initializing custom chat with config:', config);

    // Add welcome message
    if (welcomeMessage) {
        console.log('Welcome message:', welcomeMessage);
    }

    // Setup API communication
    if (apiEndpoint) {
        console.log('Chat API endpoint configured:', apiEndpoint);
    }

    // Placeholder for chat logic
    // Implement your custom chat handling here
}

// ===== EXPORT FOR EXTERNAL USE =====
window.BasketballCoach = {
    toggleChat,
    embedChatbot,
    initializeCustomChat,
    announceToScreenReader,
};

// ===== LOG INITIALIZATION =====
console.log('🏀 Dynamite Sports Learner – Basketball Coach loaded successfully!');
console.log('Keyboard shortcut: Ctrl+Shift+C to toggle chat');
