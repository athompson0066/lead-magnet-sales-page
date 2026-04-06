// ============================================================
// Lead Magnet Sales Page — Chat Widget + Interactions
// ============================================================

// Configuration
const CHAT_WIDGET_URL = 'https://n8n.srv1524386.hstgr.cloud/webhook/lead-magnet-chat';
const COMPANY_NAME = 'Aiolos Media';
const PRICING = {
  setup: 149,
  monthly: 99
};

// ============================================================
// Chat Widget
// ============================================================

let chatOpen = false;
let conversationId = generateSessionId();
let chatLoaded = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const widget = document.getElementById('chatWidget');
  const fab = document.getElementById('chatFab');
  
  if (chatOpen) {
    widget.classList.add('open');
    if (fab) fab.style.display = 'none';
    if (!chatLoaded) {
      loadChatHistory();
      chatLoaded = true;
    }
    document.getElementById('chatInput')?.focus();
  } else {
    widget.classList.remove('open');
    if (fab) fab.style.display = 'flex';
  }
}

function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadChatHistory() {
  // Load previous conversation from localStorage
  const saved = localStorage.getItem('leadgen_chat_' + conversationId);
  if (saved) {
    try {
      const history = JSON.parse(saved);
      const container = document.getElementById('chatMessages');
      history.forEach(msg => addMessageToUI(msg.text, msg.type, false));
    } catch (e) {
      console.log('No saved chat history');
    }
  }
}

function saveChatHistory() {
  const container = document.getElementById('chatMessages');
  const messages = Array.from(container.querySelectorAll('.chat-message')).map(m => ({
    type: m.classList.contains('bot') ? 'bot' : 'user',
    text: m.querySelector('p')?.textContent || ''
  }));
  localStorage.setItem('leadgen_chat_' + conversationId, JSON.stringify(messages));
}

function addMessageToUI(text, type = 'bot', save = true) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-message ${type}`;
  div.innerHTML = `<p>${escapeHtml(text)}</p>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  if (save) saveChatHistory();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  
  // Add user message
  addMessageToUI(text, 'user');
  input.value = '';
  
  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-message bot typing';
  typing.innerHTML = '<p><em>Typing...</em></p>';
  document.getElementById('chatMessages').appendChild(typing);
  scrollToBottom();
  
  try {
    // Send to n8n webhook
    const response = await fetch(CHAT_WIDGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        sessionId: conversationId,
        timestamp: new Date().toISOString()
      })
    });
    
    typing.remove();
    
    if (response.ok) {
      const data = await response.json();
      addMessageToUI(data.response || data.message || "Thanks for your message! Albert will get back to you shortly.");
    } else {
      // Fallback AI response (simulated)
      const reply = generateFallbackResponse(text);
      addMessageToUI(reply);
    }
  } catch (error) {
    typing.remove();
    console.error('Chat error:', error);
    // Fallback: route to Albert via Telegram
    const reply = generateFallbackResponse(text);
    addMessageToUI(reply);
  }
}

function generateFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  // Price questions
  if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('how much')) {
    return `Our Lead Magnet service is ${PRICING.setup} for setup (includes 30 days free) and ${PRICING.monthly}/month after. That includes your custom branded tool, lead dashboard, AI agent, and email/social integration. Would you like to schedule a call to get started?`;
  }
  
  // Demo questions
  if (lower.includes('demo') || lower.includes('see') || lower.includes('example') || lower.includes('how does it work')) {
    return `Here's a live demo of the tool: <a href="https://dr-amara.aiolosmedia.com" target="_blank">dr-amara.aiolosmedia.com</a>. This is what it looks like for one of our clients — a Toronto nutritionist. Click through to try the Metabolic Health Audit and see the full flow!`;
  }
  
  // Setup / getting started
  if (lower.includes('start') || lower.includes('begin') || lower.includes('setup') || lower.includes('get started')) {
    return `To get started, just click the PayPal button below to pay the ${PRICING.setup} setup fee. Once Albert receives your payment, he'll reach out within 24 hours to set up your custom branded lead magnet. <a href="https://paypal.me/aiolosmedia/${PRICING.setup}" target="_blank">Pay ${PRICING.setup} Setup Fee →</a>`;
  }
  
  // Time / how long
  if (lower.includes('how long') || lower.includes('time') || lower.includes('days') || lower.includes('weeks')) {
    return `Setup takes 24-48 hours after payment. Once it's live, you just add the link to your email signature and social bios — takes about 30 seconds. The leads start coming in after that.`;
  }
  
  // Features
  if (lower.includes('feature') || lower.includes('what do i get') || lower.includes('included')) {
    return `You get: a custom branded lead magnet tool (your colors, your logo), a lead dashboard with name/email/goals/budget for every lead, an AI sales agent that qualifies leads 24/7, and integration with email signature, Instagram, LinkedIn, and your website. Everything you need to capture and close more clients.`;
  }
  
  // Guarantee
  if (lower.includes('guarantee') || lower.includes('refund') || lower.includes('risk')) {
    return `We guarantee 10 qualified leads in your first 30 days, or we refund your ${PRICING.setup} setup fee — no questions asked. That's how confident we are this works. You can see it in action with zero risk.`;
  }
  
  // Contact / talk to Albert
  if (lower.includes('talk') || lower.includes('call') || lower.includes('speak') || lower.includes('email') || lower.includes('contact')) {
    return `You can email Albert directly at <a href="mailto:info@aiolosmedia.com">info@aiolosmedia.com</a>. Or just tell me your name and email here and I'll have him reach out to you within 24 hours.`;
  }
  
  // Qualification check
  if (lower.includes('interested') || lower.includes('yes') || lower.includes('sure') || lower.includes('okay')) {
    return `Great! To get your custom setup started, I just need your name and email. What's the best email to reach you?`;
  }
  
  // Name collection
  if (lower.includes('@') || lower.includes('email')) {
    return `Perfect, thanks! Albert will reach out to you within 24 hours with your custom setup. In the meantime, feel free to check out the demo at <a href="https://dr-amara.aiolosmedia.com" target="_blank">dr-amara.aiolosmedia.com</a> to see how it works!`;
  }
  
  // Default: be helpful and guide to next step
  return `Thanks for your question! The quick answer: our Lead Magnet service sets up a custom branded tool (like a Metabolic Health Audit) that captures qualified leads from your email, Instagram, and LinkedIn. ${PRICING.setup} setup + ${PRICING.monthly}/mo. Would you like to see a live demo, or should I help you get started?`;
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) container.scrollTop = container.scrollHeight;
}

function handleChatKeypress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// ============================================================
// FAQ Accordion
// ============================================================

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  
  // Toggle this one
  if (!wasOpen) {
    item.classList.add('open');
  }
}

// ============================================================
// Smooth scroll for anchor links
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// PayPal click tracking (optional)
// ============================================================

document.querySelectorAll('a[href*="paypal.me"]').forEach(link => {
  link.addEventListener('click', function() {
    console.log('PayPal clicked:', this.href);
    // Could fire a conversion event here
  });
});

// ============================================================
// Init on page load
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Add floating chat button if chat widget exists but no fab
  if (document.getElementById('chatWidget') && !document.getElementById('chatFab')) {
    const fab = document.createElement('button');
    fab.id = 'chatFab';
    fab.className = 'chat-fab';
    fab.innerHTML = '💬';
    fab.onclick = toggleChat;
    fab.style.display = 'none'; // Hidden when widget is open
    document.body.appendChild(fab);
    
    // Show fab after a delay if widget isn't open
    setTimeout(() => {
      if (!chatOpen) fab.style.display = 'flex';
    }, 3000);
  }
  
  // Close chat on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatOpen) toggleChat();
  });
});
