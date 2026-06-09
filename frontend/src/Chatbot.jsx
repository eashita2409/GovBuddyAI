import { useState, useEffect, useRef, useCallback } from 'react';
import './Chatbot.css';

/* ============================================
   DATA & CONSTANTS
   ============================================ */

// Sidebar navigation items
const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard', badge: null },
  { id: 'schemes',    icon: '📋', label: 'Schemes',   badge: 'New' },
  { id: 'scholarships', icon: '🎓', label: 'Scholarships', badge: null },
  { id: 'ocr',        icon: '📄', label: 'OCR Upload', badge: null },
  { id: 'rti',        icon: '⚖️', label: 'RTI Assistant', badge: null },
];

// Recent chat history items shown in sidebar
const RECENT_CHATS = [
  { id: 'c1', icon: '🎓', title: 'Engineering Scholarships', preview: 'AICTE Pragati, NSP...' },
  { id: 'c2', icon: '📋', title: 'PM Kisan Eligibility', preview: 'Checking farm records...' },
  { id: 'c3', icon: '⚖️', title: 'RTI for Road Repair', preview: 'Draft application ready' },
  { id: 'c4', icon: '📄', title: 'Aadhaar OCR Scan', preview: 'Extracted 12 fields' },
];

// Quick prompt chips shown on welcome screen
const QUICK_PROMPTS = [
  { emoji: '🎓', text: 'Engineering scholarships?' },
  { emoji: '📋', text: 'Check PM Kisan eligibility' },
  { emoji: '⚖️', text: 'File an RTI application' },
  { emoji: '📄', text: 'Upload & scan document' },
  { emoji: '🗣️', text: 'Switch language to Hindi' },
  { emoji: '🔍', text: 'Find state government schemes' },
];

// Format a Date object as "hh:mm AM/PM"
function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Backend API base URL — change this if your server runs on a different port
const API_BASE_URL = 'http://localhost:5000';

/* ============================================
   callBackendAPI
   Sends a message to the Express backend and
   returns the AI reply text.
   Throws an error if the request fails.
   ============================================ */
async function callBackendAPI(message) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  // If the server returned an error status, read the error body
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.reply; // the AI's response string
}

/* ============================================
   MESSAGE BUBBLE COMPONENT
   Renders a single chat message (user or AI)
   ============================================ */
function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-ai'}`} aria-hidden="true">
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Content (sender + bubble) */}
      <div className="message-content">
        <div className="message-meta">
          <span className="message-sender">
            {isUser ? 'You' : 'GovBuddy AI'}
          </span>
          <span className="message-time">{message.time}</span>
        </div>

        {/* Bubble */}
        {message.data && message.data.type === 'scholarship' ? (
          /* Rich scholarship response */
          <div className="message-bubble" role="article" aria-label="AI scholarship response">
            <div className="ai-response-title">
              <span aria-hidden="true">🎓</span>
              Scholarships Found
            </div>
            <p style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {message.data.text}
            </p>
            <div className="ai-scheme-list">
              {message.data.schemes.map((scheme, i) => (
                <div className="ai-scheme-item" key={i}>
                  <span className="scheme-check" aria-hidden="true">✓</span>
                  <div className="scheme-info">
                    <strong>{scheme.name}</strong>
                    <span>{scheme.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            {message.data.note && (
              <p className="ai-response-note">
                <span aria-hidden="true">ℹ️</span>
                {message.data.note}
              </p>
            )}
          </div>
        ) : (
          /* Plain text bubble */
          <div
            className="message-bubble"
            style={{ whiteSpace: 'pre-wrap' }}
            role="article"
            aria-label={isUser ? 'Your message' : 'AI response'}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   TYPING INDICATOR COMPONENT
   Animated dots shown while AI is "thinking"
   ============================================ */
function TypingIndicator() {
  return (
    <div className="message-row ai" role="status" aria-label="GovBuddy AI is typing">
      <div className="message-avatar avatar-ai" aria-hidden="true">🤖</div>
      <div className="message-content">
        <div className="message-meta">
          <span className="message-sender">GovBuddy AI</span>
        </div>
        <div className="typing-indicator" aria-hidden="true">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SIDEBAR COMPONENT
   ============================================ */
function Sidebar({ isOpen, activeNav, onNavClick, onNewChat, onLogoClick, onClose }) {
  return (
    <>
      {/* Dark overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="chat-sidebar"
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Navigation sidebar"
      >
        {/* Top Accent Line (via CSS ::before) */}

        {/* Header: Logo + New Chat */}
        <div className="sidebar-header">
          <button
            className="sidebar-logo"
            onClick={onLogoClick}
            aria-label="Go to GovBuddy AI home"
            id="sidebar-logo-btn"
          >
            <div className="sidebar-logo-icon" aria-hidden="true">🏛️</div>
            <div className="sidebar-logo-text">
              Gov<span>Buddy</span> AI
            </div>
          </button>

          <button
            id="new-chat-btn"
            className="new-chat-btn"
            onClick={onNewChat}
            aria-label="Start a new chat"
          >
            <span className="new-chat-icon" aria-hidden="true">✦</span>
            New Chat
          </button>
        </div>

        {/* Scrollable body */}
        <div className="sidebar-body">

          {/* Recent Chats Section */}
          <div>
            <p className="sidebar-section-label">Recent Chats</p>
            <ul className="recent-chats" role="list">
              {RECENT_CHATS.map((chat) => (
                <li
                  key={chat.id}
                  className={`chat-history-item ${chat.id === 'c1' ? 'active' : ''}`}
                  role="listitem"
                  onClick={onNewChat}
                  id={`chat-history-${chat.id}`}
                  aria-label={`Chat: ${chat.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onNewChat()}
                >
                  <div className="chat-history-icon" aria-hidden="true">{chat.icon}</div>
                  <div className="chat-history-text">
                    <div className="chat-history-title">{chat.title}</div>
                    <div className="chat-history-preview">{chat.preview}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Section */}
          <div>
            <p className="sidebar-section-label">Navigation</p>
            <nav className="sidebar-nav" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => onNavClick(item.id)}
                  aria-label={item.label}
                  aria-current={activeNav === item.id ? 'page' : undefined}
                >
                  <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className="sidebar-nav-badge" aria-label={`${item.badge} badge`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

        </div>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" id="sidebar-user-profile" role="button" tabIndex={0}>
            <div className="sidebar-user-avatar" aria-hidden="true">A</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Aisha Eashi</div>
              <div className="sidebar-user-status">
                <span className="status-dot" aria-hidden="true" />
                Active
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================================
   CHAT INPUT COMPONENT
   ============================================ */
function ChatInput({ onSend, isLoading }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [inputText]);

  // Handle send action
  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputText, isLoading, onSend]);

  // Send on Enter (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice button toggle (placeholder — no real API)
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const canSend = inputText.trim().length > 0 && !isLoading;

  return (
    <div className="chat-input-area" role="region" aria-label="Chat input">
      <div className="chat-input-wrapper">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="chat-input-field"
          className="chat-input-field"
          placeholder="Ask about scholarships, RTI, government schemes…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Type your message"
          aria-multiline="true"
          disabled={isLoading}
        />

        <div className="chat-input-actions">
          {/* Voice Button */}
          <button
            id="voice-input-btn"
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
            title="Voice input"
          >
            {isRecording ? '⏹' : '🎤'}
          </button>

          {/* Send Button */}
          <button
            id="send-message-btn"
            className="send-btn"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            title="Send (Enter)"
          >
            <svg className="send-icon" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <p className="chat-input-hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

/* ============================================
   MAIN CHATBOT PAGE COMPONENT
   ============================================ */
function ChatbotPage({ onGoHome }) {
  // State
  const [messages, setMessages]       = useState([]);  // array of message objects
  const [isTyping, setIsTyping]       = useState(false); // AI typing animation
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [activeNav, setActiveNav]     = useState('dashboard'); // selected nav
  const [hasStarted, setHasStarted]   = useState(false); // whether chat has started
  const [apiError, setApiError]       = useState(null);  // last API error message

  const messagesEndRef = useRef(null); // for auto-scroll

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // --- Load demo conversation on first render ---
  useEffect(() => {
    // Small delay so the user sees the welcome screen briefly first
    const timer = setTimeout(() => {
      const userMsg = {
        id: 'demo-user',
        role: 'user',
        text: 'Which scholarships are available for engineering students?',
        time: formatTime(new Date()),
        data: null,
      };
      // Demo AI reply uses fixed content (no API call needed for the demo)
      const aiMsg = {
        id: 'demo-ai',
        role: 'ai',
        text: 'You may be eligible for AICTE Pragati Scholarship, NSP Scholarships, and State Government schemes. Once you add your OpenAI API key to the backend .env file, I can give you real-time personalised answers!',
        time: formatTime(new Date()),
        data: null,
      };

      setHasStarted(true);
      setMessages([userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
      }, 1400);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // --- Handle user sending a new message ---
  // Calls the real Express backend via fetch()
  const handleSend = useCallback(async (text) => {
    const userMsg = {
      id: Date.now() + '-user',
      role: 'user',
      text,
      time: formatTime(new Date()),
      data: null,
    };

    setHasStarted(true);
    setApiError(null);                        // clear any previous error
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Call the Express backend — POST /api/chat
      const reply = await callBackendAPI(text);

      const aiMsg = {
        id: Date.now() + '-ai',
        role: 'ai',
        text: reply,
        time: formatTime(new Date()),
        data: null,
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      // Show a friendly error bubble if the backend is unreachable
      console.error('[GovBuddy] API error:', err.message);
      setApiError(err.message);

      const errMsg = {
        id: Date.now() + '-error',
        role: 'ai',
        text: `⚠️ Could not reach the backend: ${err.message}\n\nPlease make sure the Express server is running on http://localhost:5000 and your OPENAI_API_KEY is set in backend/.env`,
        time: formatTime(new Date()),
        data: null,
      };
      setMessages((prev) => [...prev, errMsg]);

    } finally {
      setIsTyping(false);
    }
  }, []);

  // --- Handle quick prompt chip click ---
  const handleChipClick = (chipText) => {
    handleSend(chipText);
  };

  // --- Handle New Chat (reset) ---
  const handleNewChat = () => {
    setMessages([]);
    setHasStarted(false);
    setSidebarOpen(false);
  };

  return (
    <div className="chat-page" id="chatbot-page">

      {/* ---- SIDEBAR ---- */}
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        onNavClick={(id) => { setActiveNav(id); setSidebarOpen(false); }}
        onNewChat={handleNewChat}
        onLogoClick={onGoHome}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ---- MAIN CHAT AREA ---- */}
      <div className="chat-main" role="main" aria-label="Chat area">

        {/* Chat Header */}
        <header className="chat-header" id="chat-header">
          <div className="chat-header-left">
            {/* Mobile Hamburger */}
            <button
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              aria-controls="chat-sidebar"
              aria-expanded={sidebarOpen}
              id="sidebar-toggle-btn"
            >
              <div className="hamburger-icon" aria-hidden="true">
                <span /><span /><span />
              </div>
            </button>

            {/* Title */}
            <div>
              <div className="chat-header-title">AI Assistant</div>
              <div className="chat-header-subtitle">
                <span className="online-indicator" aria-hidden="true" />
                Online · Responding instantly
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="chat-header-actions">
            <button
              id="clear-chat-btn"
              className="header-action-btn"
              onClick={handleNewChat}
              aria-label="Clear chat"
              title="Clear chat"
            >
              🗑️
            </button>
            <button
              id="settings-btn"
              className="header-action-btn"
              aria-label="Settings"
              title="Settings"
            >
              ⚙️
            </button>
            {/* Back to Landing Page */}
            <button
              id="back-to-home-btn"
              className="back-to-home-btn"
              onClick={onGoHome}
              aria-label="Back to home"
            >
              ← <span>Home</span>
            </button>
          </div>
        </header>

        {/* Messages or Welcome Screen */}
        {!hasStarted ? (
          /* Welcome Screen */
          <div className="chat-messages" style={{ justifyContent: 'center' }}>
            <div className="chat-welcome">
              <div className="welcome-icon-wrap" aria-hidden="true">🤖</div>
              <div className="welcome-text">
                <h1 id="chat-welcome-heading" className="welcome-heading">
                  Hello! I'm <span>GovBuddy AI</span>
                </h1>
                <p className="welcome-subtitle">
                  Your intelligent guide to Indian government services. Ask me anything —
                  scholarships, RTI, forms, schemes, documents.
                </p>
              </div>
              <div className="welcome-chips" role="list" aria-label="Quick prompts">
                {QUICK_PROMPTS.map((chip) => (
                  <button
                    key={chip.text}
                    className="welcome-chip"
                    role="listitem"
                    onClick={() => handleChipClick(chip.text)}
                    aria-label={`Quick prompt: ${chip.text}`}
                    id={`quick-prompt-${chip.text.replace(/\s+/g, '-').toLowerCase().slice(0, 20)}`}
                  >
                    <span aria-hidden="true">{chip.emoji}</span>
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div
            className="chat-messages"
            id="chat-messages-area"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator while AI processes */}
            {isTyping && <TypingIndicator />}

            {/* Invisible anchor to scroll to */}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        )}

        {/* Chat Input */}
        <ChatInput onSend={handleSend} isLoading={isTyping} />
      </div>

    </div>
  );
}

export default ChatbotPage;
