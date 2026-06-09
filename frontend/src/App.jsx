import { useState, useEffect } from 'react';
import './App.css';
import Chatbot from './Chatbot';

/* ============================================
   NAVBAR COMPONENT
   ============================================ */
function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add scrolled class when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#footer' },
  ];

  return (
    <nav id="navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#home" className="navbar-logo" id="nav-logo">
          <div className="logo-icon" aria-hidden="true">🏛️</div>
          <div className="logo-text">
            Gov<span>Buddy</span> AI
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul className="navbar-links" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} id={`nav-link-${link.label.toLowerCase()}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="navbar-cta">
          <button className="btn-primary" id="nav-cta-btn" onClick={onOpenChat}>
            Get Started
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-toggle"
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="menu">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <button className="btn-primary" onClick={() => { setMenuOpen(false); onOpenChat(); }}>
          Get Started →
        </button>
      </div>
    </nav>
  );
}

/* ============================================
   HERO SECTION COMPONENT
   ============================================ */
function HeroSection({ onOpenChat }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      {/* Animated Background */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="hero-inner">
        {/* Live Badge */}
        <div className="hero-badge" role="status" aria-label="Platform status: Live">
          <span className="hero-badge-dot" aria-hidden="true" />
          Now Live — AI-Powered Gov Services
        </div>

        {/* Main Headline */}
        <h1 id="hero-heading" className="hero-title">
          Navigate Government
          <span className="line-accent">Services with AI</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          GovBuddy AI makes government services effortless. From RTI filings to scholarship
          discovery — get instant help, in your language, 24/7.
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons">
          <button className="btn-primary" id="hero-cta-primary" onClick={onOpenChat}>
            🚀 Try GovBuddy AI
          </button>
          <a href="#about" className="btn-secondary" id="hero-cta-secondary">
            Learn More →
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats" aria-label="Platform statistics">
          <div className="hero-stat">
            <span className="hero-stat-value">50K+</span>
            <span className="hero-stat-label">Users Helped</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">12+</span>
            <span className="hero-stat-label">Languages</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">99%</span>
            <span className="hero-stat-label">Accuracy</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">24/7</span>
            <span className="hero-stat-label">Availability</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FEATURES SECTION COMPONENT
   ============================================ */

// Feature card data
const featuresData = [
  {
    id: 'ai-chatbot',
    icon: '🤖',
    iconClass: 'icon-blue',
    title: 'AI Chatbot',
    description:
      'Get instant, accurate answers to any government-related query. Our multilingual AI understands context and provides step-by-step guidance.',
    tags: ['Multilingual', 'Context-Aware', 'Instant'],
  },
  {
    id: 'ocr-reader',
    icon: '📄',
    iconClass: 'icon-cyan',
    title: 'OCR Document Reader',
    description:
      'Upload any government document — Aadhaar, ration card, certificates — and extract key information instantly with our advanced OCR engine.',
    tags: ['PDF Support', 'Auto Extract', 'Secure'],
  },
  {
    id: 'scholarship-finder',
    icon: '🎓',
    iconClass: 'icon-purple',
    title: 'Scholarship Finder',
    description:
      'Discover scholarships and government schemes you qualify for based on your profile. Never miss an opportunity due to lack of information.',
    tags: ['Personalized', 'Central + State', 'Deadline Alerts'],
  },
  {
    id: 'rti-assistant',
    icon: '⚖️',
    iconClass: 'icon-green',
    title: 'RTI Assistant',
    description:
      'Draft, file, and track Right to Information applications with AI guidance. Know your rights and exercise them effectively.',
    tags: ['Auto Draft', 'Status Tracking', 'Legal Help'],
  },
  {
    id: 'voice-support',
    icon: '🎤',
    iconClass: 'icon-orange',
    title: 'Voice Support',
    description:
      'Interact with GovBuddy in your native language using voice commands. Designed for accessibility and ease of use for all citizens.',
    tags: ['12+ Languages', 'Offline Mode', 'Accessible'],
  },
  {
    id: 'form-guidance',
    icon: '📝',
    iconClass: 'icon-pink',
    title: 'Form Guidance',
    description:
      'Fill government forms correctly, every time. Our AI walks you through each field with examples and validation checks to avoid rejections.',
    tags: ['Auto-Fill', 'Validation', 'Error-Free'],
  },
];

function FeatureCard({ feature }) {
  return (
    <article className="feature-card" id={`feature-card-${feature.id}`} aria-label={feature.title}>
      <div className="feature-card-inner">
        {/* Icon */}
        <div
          className={`feature-icon-wrapper ${feature.iconClass}`}
          aria-hidden="true"
        >
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className="feature-card-title">{feature.title}</h3>

        {/* Description */}
        <p className="feature-card-desc">{feature.description}</p>

        {/* Tags */}
        <div className="feature-tags" aria-label={`${feature.title} capabilities`}>
          {feature.tags.map((tag) => (
            <span key={tag} className="feature-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="features" aria-labelledby="features-heading">
      <div className="container">
        {/* Header */}
        <div className="features-header">
          <div className="section-tag" aria-hidden="true">
            ✦ Our Features
          </div>
          <h2 id="features-heading" className="features-title">
            Everything You Need to{' '}
            <span className="gradient-text">Navigate Government</span>
          </h2>
          <p className="features-subtitle">
            Six powerful AI tools designed to simplify every interaction with Indian government
            services — so you can focus on what matters most.
          </p>
        </div>

        {/* Grid of Feature Cards */}
        <div className="features-grid" role="list">
          {featuresData.map((feature) => (
            <div role="listitem" key={feature.id}>
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   ABOUT SECTION COMPONENT
   ============================================ */
function AboutSection() {
  const values = [
    {
      id: 'transparency',
      icon: '🔍',
      title: 'Radical Transparency',
      description: 'Every AI response is explainable and traceable to official government sources.',
    },
    {
      id: 'accessibility',
      icon: '♿',
      title: 'Inclusive by Design',
      description: 'Built for every Indian citizen — from metro professionals to rural communities.',
    },
    {
      id: 'security',
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your documents and queries are encrypted end-to-end. We never sell your data.',
    },
  ];

  const terminalLines = [
    { type: 'cmd', content: 'govbuddy --check rti-status' },
    { type: 'out', content: 'Fetching RTI application status...', success: false },
    { type: 'out', content: '✓ Application #RTI-2024-08819: Received', success: true },
    { type: 'cmd', content: 'govbuddy --find scholarships --state MH' },
    { type: 'out', content: '✓ Found 14 matching schemes for your profile', success: true },
    { type: 'cmd', content: 'govbuddy --translate --lang hi' },
    { type: 'out', content: '✓ Response translated to Hindi', success: true },
  ];

  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      {/* Background Glow */}
      <div className="about-bg-glow" aria-hidden="true" />

      <div className="container">
        <div className="about-inner">
          {/* Left: Content */}
          <div className="about-content">
            <div className="section-tag" aria-hidden="true">
              ✦ About GovBuddy
            </div>
            <h2 id="about-heading" className="about-title">
              Built to Bridge the{' '}
              <span className="gradient-text">Governance Gap</span>
            </h2>
            <p className="about-description">
              India's government ecosystem is vast and often complex. GovBuddy AI was built to be
              the intelligent layer between citizens and government services — making information
              accessible, processes faster, and outcomes better.
            </p>
            <p className="about-description">
              Powered by cutting-edge large language models fine-tuned on Indian government data,
              we provide guidance that's not just accurate — but genuinely helpful and in your
              own language.
            </p>

            {/* Values */}
            <div className="about-values" role="list" aria-label="Our core values">
              {values.map((val) => (
                <div
                  key={val.id}
                  className="about-value-item"
                  id={`about-value-${val.id}`}
                  role="listitem"
                >
                  <span className="about-value-icon" aria-hidden="true">{val.icon}</span>
                  <div className="about-value-text">
                    <h4>{val.title}</h4>
                    <p>{val.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="about-visual" aria-hidden="true">
            {/* Fake Terminal */}
            <div className="terminal-card" role="img" aria-label="GovBuddy AI terminal demo">
              <div className="terminal-header">
                <span className="terminal-dot dot-red" />
                <span className="terminal-dot dot-yellow" />
                <span className="terminal-dot dot-green" />
                <span className="terminal-title">govbuddy-ai — terminal</span>
              </div>
              <div className="terminal-body">
                {terminalLines.map((line, i) => (
                  <div key={i} className="terminal-line">
                    {line.type === 'cmd' ? (
                      <>
                        <span className="terminal-prompt">$</span>
                        <span className="terminal-command">{line.content}</span>
                      </>
                    ) : (
                      <span className={`terminal-output ${line.success ? 'success' : ''}`}>
                        {line.content}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="about-stat-cards">
              <div className="about-stat-card">
                <span className="about-stat-card-value">28</span>
                <span className="about-stat-card-label">States Covered</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-card-value">500+</span>
                <span className="about-stat-card-label">Gov Schemes</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-card-value">1M+</span>
                <span className="about-stat-card-label">Queries Answered</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-card-value">4.9★</span>
                <span className="about-stat-card-label">User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER COMPONENT
   ============================================ */
function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'AI Chatbot', href: '#features' },
      { label: 'OCR Reader', href: '#features' },
      { label: 'Scholarship Finder', href: '#features' },
      { label: 'RTI Assistant', href: '#features' },
      { label: 'Voice Support', href: '#features' },
    ],
    Resources: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
    Company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: '𝕏', label: 'Twitter/X', href: '#' },
    { icon: '💼', label: 'LinkedIn', href: '#' },
    { icon: '⭐', label: 'GitHub', href: '#' },
    { icon: '▶', label: 'YouTube', href: '#' },
  ];

  return (
    <footer id="footer" className="footer" aria-label="Site footer">
      <div className="footer-inner">
        {/* Top Grid */}
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo" aria-label="GovBuddy AI">
              <div className="logo-icon" aria-hidden="true">🏛️</div>
              <span>GovBuddy AI</span>
            </div>
            <p className="footer-brand-desc">
              Making Indian government services accessible to every citizen through the power
              of artificial intelligence. Your rights, simplified.
            </p>
            {/* Social Links */}
            <nav className="footer-social" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer-social-link"
                  aria-label={social.label}
                  id={`footer-social-${social.label.toLowerCase().replace('/', '-')}`}
                >
                  {social.icon}
                </a>
              ))}
            </nav>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([colTitle, links]) => (
            <div key={colTitle} className="footer-col">
              <h4>{colTitle}</h4>
              <ul role="list">
                {links.map((link) => (
                  <li key={link.label} role="listitem">
                    <a href={link.href} id={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear}{' '}
            <a href="#home" aria-label="GovBuddy AI home">GovBuddy AI</a>
            . Made with ❤️ for 🇮🇳 India.
          </p>
          <nav className="footer-legal" aria-label="Legal links">
            <a href="#" id="footer-privacy">Privacy Policy</a>
            <a href="#" id="footer-terms">Terms of Service</a>
            <a href="#" id="footer-cookies">Cookie Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   ROOT APP COMPONENT
   Manages page routing: 'home' | 'chat'
   ============================================ */
function App() {
  // 'home' shows the marketing page, 'chat' shows the chatbot
  const [page, setPage] = useState('home');

  // Show the Chatbot page
  if (page === 'chat') {
    return <Chatbot onGoHome={() => setPage('home')} />;
  }

  // Show the Landing page (default)
  return (
    <>
      <Navbar onOpenChat={() => setPage('chat')} />
      <main id="main-content">
        <HeroSection onOpenChat={() => setPage('chat')} />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}

export default App;