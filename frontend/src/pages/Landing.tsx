import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.svg" alt="AuditForge Logo" className="logo-image" />
            <span className="logo-text">AuditForge</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="https://github.com/yourusername/smart-contract-auditor" target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <Link to="/auditor">
            <button className="btn-primary">Try Free Audit</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="pre-heading">AI-POWERED SMART CONTRACT SECURITY</div>
            <h1 className="hero-heading">
              Forging Secure<br />
              Smart Contracts
            </h1>
            <p className="hero-subheading">
              Detect vulnerabilities, prevent exploits, protect your DeFi protocol.
              Enterprise-grade security audits in seconds, powered by ADK-TS.
            </p>
            <div className="hero-cta-group">
              <Link to="/auditor">
                <button className="btn-primary btn-large">
                  <span>🔍 Audit Your Contract</span>
                </button>
              </Link>
              <button className="btn-secondary btn-large">
                <span>▶ Watch Demo</span>
              </button>
            </div>
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>20+ Vulnerabilities Detected</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>Built with ADK-TS</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">❤️</span>
                <span>Free for Open Source</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="forge-illustration">
              <div className="anvil">
                <div className="code-particle">{'{ }'}</div>
                <div className="code-particle">;</div>
                <div className="code-particle">const</div>
                <div className="forge-glow"></div>
                <div className="anvil-body">⚒️</div>
                <div className="spark"></div>
                <div className="spark"></div>
                <div className="spark"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar / Stats */}
      <section className="trust-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-number">$3B+</div>
            <div className="stat-label">Lost to exploits in 2024</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">🔍</div>
            <div className="stat-number forge-color">20+</div>
            <div className="stat-label">Vulnerability types detected</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">⚡</div>
            <div className="stat-number steel-color">&lt;5 sec</div>
            <div className="stat-label">Average audit time</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">💚</div>
            <div className="stat-number safe-color">100%</div>
            <div className="stat-label">Free for open source</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pre-heading">FEATURES</div>
            <h2 className="section-heading">Everything You Need for Smart Contract Security</h2>
            <p className="section-subheading">
              Built with ADK-TS multi-agent architecture for comprehensive security analysis
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container shield-icon">
                <span className="feature-icon">🛡️</span>
              </div>
              <h4 className="feature-title">20+ Vulnerability Detectors</h4>
              <p className="feature-description">
                Pattern-based detection for reentrancy, overflow, access control, and 17+ other common vulnerabilities
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container brain-icon">
                <span className="feature-icon">🧠</span>
              </div>
              <h4 className="feature-title">AI-Powered Deep Analysis</h4>
              <p className="feature-description">
                LLM-driven semantic analysis catches business logic flaws that traditional scanners miss
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container git-icon">
                <span className="feature-icon">🔗</span>
              </div>
              <h4 className="feature-title">GitHub PR Integration</h4>
              <p className="feature-description">
                Automatic security reviews on every pull request. Continuous monitoring for your repositories
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container doc-icon">
                <span className="feature-icon">📄</span>
              </div>
              <h4 className="feature-title">Instant Reports</h4>
              <p className="feature-description">
                Comprehensive audit reports in seconds. Multiple formats: JSON, PDF, Markdown
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container chat-icon">
                <span className="feature-icon">💬</span>
              </div>
              <h4 className="feature-title">Natural Language Explanations</h4>
              <p className="feature-description">
                Understand vulnerabilities with clear explanations and step-by-step fix recommendations
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container network-icon">
                <span className="feature-icon">🔄</span>
              </div>
              <h4 className="feature-title">Multi-Agent Architecture</h4>
              <p className="feature-description">
                Coordinated ADK-TS agents for parsing, analysis, and reporting. Extensible and powerful
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pre-heading">HOW IT WORKS</div>
            <h2 className="section-heading">From Code to Security in 3 Steps</h2>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-icon">📝</div>
              <h4 className="step-title">Submit Your Contract</h4>
              <p className="step-description">
                Paste Solidity code, upload file, or connect GitHub repository
              </p>
              <div className="step-visual">
                <div className="code-mockup">
                  <div className="code-line">pragma solidity ^0.8.0;</div>
                  <div className="code-line">contract MyContract {'{ }'}</div>
                </div>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-icon">⚙️</div>
              <h4 className="step-title">AI Analysis</h4>
              <p className="step-description">
                Multi-agent system analyzes AST, runs 20+ detectors, performs LLM reasoning
              </p>
              <div className="step-visual">
                <div className="analysis-animation">
                  <div className="analysis-node"></div>
                  <div className="analysis-node"></div>
                  <div className="analysis-node"></div>
                </div>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-icon">📊</div>
              <h4 className="step-title">Get Instant Report</h4>
              <p className="step-description">
                Receive comprehensive audit with severity scores, explanations, and fix recommendations
              </p>
              <div className="step-visual">
                <div className="report-mockup">
                  <div className="report-badge critical">Critical</div>
                  <div className="report-badge high">High</div>
                  <div className="report-badge safe">Safe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Screenshot Section */}
      <section className="demo-section">
        <div className="section-container">
          <h2 className="section-heading">See AuditForge in Action</h2>
          <p className="section-subheading">Professional-grade security audits at your fingertips</p>
          <div className="demo-mockup">
            <div className="browser-chrome">
              <div className="browser-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="browser-url">auditforge.com/auditor</div>
            </div>
            <div className="demo-interface">
              <div className="demo-left">
                <div className="demo-code">
                  <div className="demo-code-line">// Vulnerable Contract</div>
                  <div className="demo-code-line highlight-line">function withdraw() public {'{'}</div>
                  <div className="demo-code-line">  uint balance = balances[msg.sender];</div>
                  <div className="demo-code-line highlight-line">  msg.sender.call.value(balance)("");</div>
                  <div className="demo-code-line">{'}'}</div>
                </div>
              </div>
              <div className="demo-right">
                <div className="demo-finding">
                  <div className="finding-badge critical">CRITICAL</div>
                  <div className="finding-title">Reentrancy Vulnerability</div>
                  <div className="finding-desc">External call before state update</div>
                </div>
              </div>
            </div>
          </div>
          <div className="demo-cta">
            <Link to="/auditor">
              <button className="btn-primary btn-large">Try Live Demo</button>
            </Link>
            <a href="#" className="text-link">Or watch 3-minute video →</a>
          </div>
        </div>
      </section>

      {/* Vulnerability Detection Showcase */}
      <section className="vulnerability-showcase">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pre-heading">COMPREHENSIVE DETECTION</div>
            <h2 className="section-heading">20+ Vulnerability Types Detected</h2>
            <p className="section-subheading">From common patterns to complex business logic flaws</p>
          </div>
          <div className="vulnerability-grid">
            {[
              { severity: 'critical', name: 'Reentrancy Attacks', desc: 'Detects recursive external calls' },
              { severity: 'critical', name: 'Unchecked Low-Level Calls', desc: 'Finds unsafe call operations' },
              { severity: 'high', name: 'Integer Overflow/Underflow', desc: 'Catches arithmetic issues' },
              { severity: 'high', name: 'Access Control Issues', desc: 'Identifies permission flaws' },
              { severity: 'medium', name: 'Timestamp Dependence', desc: 'Detects block.timestamp usage' },
              { severity: 'medium', name: 'DoS with Block Gas Limit', desc: 'Finds unbounded loops' },
              { severity: 'low', name: 'Zero-Address Checks', desc: 'Validates address parameters' },
              { severity: 'info', name: 'Gas Optimization', desc: 'Suggests efficiency improvements' }
            ].map((vuln, index) => (
              <div key={index} className={`vuln-card ${vuln.severity}`}>
                <div className={`vuln-badge ${vuln.severity}`}>{vuln.severity.toUpperCase()}</div>
                <div className="vuln-name">{vuln.name}</div>
                <div className="vuln-desc">{vuln.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Integration Section */}
      <section className="github-section">
        <div className="section-container github-container">
          <div className="github-visual">
            <div className="github-mockup">
              <div className="gh-header">
                <span className="gh-icon">🤖</span>
                <span className="gh-bot">AuditForge Bot</span>
                <span className="gh-commented">commented</span>
              </div>
              <div className="gh-body">
                <div className="gh-status warning">⚠️ Security issues detected</div>
                <div className="gh-finding">
                  <span className="gh-badge critical">CRITICAL</span>
                  <span>Reentrancy vulnerability in withdraw()</span>
                </div>
                <div className="gh-finding">
                  <span className="gh-badge high">HIGH</span>
                  <span>Missing access control on setOwner()</span>
                </div>
                <div className="gh-footer">View full report →</div>
              </div>
            </div>
          </div>
          <div className="github-content">
            <div className="section-pre-heading">GITHUB INTEGRATION</div>
            <h3 className="subsection-heading">Security on Autopilot</h3>
            <p className="github-description">
              AuditForge automatically reviews every pull request containing Solidity changes.
              Instant feedback for developers, continuous security monitoring for teams.
              Integrates seamlessly into your existing workflow.
            </p>
            <div className="github-features">
              <div className="gh-feature">✓ Automatic PR comments</div>
              <div className="gh-feature">✓ Inline code suggestions</div>
              <div className="gh-feature">✓ Severity-based review status</div>
              <div className="gh-feature">✓ Configurable rule sets</div>
              <div className="gh-feature">✓ Team notifications</div>
            </div>
            <div className="github-cta">
              <button className="btn-primary">Install GitHub App</button>
              <a href="#" className="text-link">View integration docs →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-stack-section">
        <div className="section-container">
          <h3 className="subsection-heading centered">Built with Cutting-Edge Technology</h3>
          <div className="tech-badges">
            <div className="tech-badge">
              <div className="tech-logo">🔷</div>
              <div className="tech-name">ADK-TS</div>
            </div>
            <div className="tech-badge">
              <div className="tech-logo">📘</div>
              <div className="tech-name">TypeScript</div>
            </div>
            <div className="tech-badge">
              <div className="tech-logo">🤖</div>
              <div className="tech-name">Claude AI</div>
            </div>
            <div className="tech-badge">
              <div className="tech-logo">◆</div>
              <div className="tech-name">Solidity</div>
            </div>
            <div className="tech-badge">
              <div className="tech-logo">🐙</div>
              <div className="tech-name">GitHub</div>
            </div>
            <div className="tech-badge">
              <div className="tech-logo">⚛️</div>
              <div className="tech-name">React</div>
            </div>
          </div>
          <p className="tech-tagline">Powered by ADK-TS Multi-Agent Architecture</p>
          <a href="#" className="text-link">Learn about our architecture →</a>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-heading">Start Forging Secure Contracts Today</h2>
            <p className="section-subheading">Free for open source projects. No credit card required.</p>
          </div>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h4 className="pricing-title">Open Source</h4>
              <div className="pricing-price">$0</div>
              <p className="pricing-desc">Perfect for individual developers and OSS projects</p>
              <ul className="pricing-features">
                <li>✓ Unlimited audits</li>
                <li>✓ All vulnerability detectors</li>
                <li>✓ Web interface access</li>
                <li>✓ GitHub integration</li>
                <li>✓ Community support</li>
              </ul>
              <Link to="/auditor">
                <button className="btn-secondary btn-block">Start Auditing</button>
              </Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">MOST POPULAR</div>
              <h4 className="pricing-title">Professional</h4>
              <div className="pricing-price">$49<span className="price-period">/month</span></div>
              <p className="pricing-desc">For teams and commercial projects</p>
              <ul className="pricing-features">
                <li>✓ Everything in Free</li>
                <li>✓ Priority analysis</li>
                <li>✓ API access</li>
                <li>✓ Private audits</li>
                <li>✓ Priority support</li>
                <li>✓ Custom rule sets</li>
              </ul>
              <button className="btn-primary btn-block btn-large">Get Started</button>
            </div>
            <div className="pricing-card">
              <h4 className="pricing-title">Enterprise</h4>
              <div className="pricing-price">Custom</div>
              <p className="pricing-desc">For organizations and DAOs</p>
              <ul className="pricing-features">
                <li>✓ Everything in Pro</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
                <li>✓ On-premise deployment</li>
                <li>✓ SLA guarantee</li>
                <li>✓ Training & onboarding</li>
              </ul>
              <button className="btn-secondary btn-block">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-container faq-container">
          <div className="faq-left">
            <h3 className="subsection-heading">Frequently Asked Questions</h3>
            <p className="faq-subheading">Everything you need to know about AuditForge</p>
            <a href="#" className="text-link">More questions? Join our Discord →</a>
          </div>
          <div className="faq-right">
            {[
              {
                q: 'How accurate is AuditForge?',
                a: 'AuditForge combines pattern-based detection with AI analysis for high accuracy. Our hybrid approach catches both common vulnerabilities and complex business logic flaws.'
              },
              {
                q: 'Does it replace professional audits?',
                a: 'AuditForge is a powerful first line of defense but should complement, not replace, professional audits for mission-critical contracts. Use it during development and before final deployment.'
              },
              {
                q: 'What vulnerabilities can it detect?',
                a: 'We detect 20+ vulnerability types including reentrancy, access control issues, integer overflow, unchecked calls, delegatecall risks, and more. See our full list above.'
              },
              {
                q: 'How does GitHub integration work?',
                a: 'Install our GitHub App, and AuditForge will automatically comment on PRs with Solidity changes, providing inline security feedback and blocking merges if critical issues are found.'
              },
              {
                q: 'Is my code stored anywhere?',
                a: 'Code is only processed in-memory during analysis and never permanently stored. For API users, logs contain only metadata, not source code.'
              },
              {
                q: 'Can I use it for commercial projects?',
                a: 'Yes! Our Professional and Enterprise plans are designed for commercial use. The free tier is for open source projects only.'
              }
            ].map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <h2 className="cta-heading">Ready to Forge Secure Smart Contracts?</h2>
          <p className="cta-subheading">Join hundreds of developers protecting their Web3 projects</p>
          <div className="cta-buttons">
            <Link to="/auditor">
              <button className="btn-primary-inverse btn-large">Start Free Audit</button>
            </Link>
            <button className="btn-secondary-inverse btn-large">Schedule Demo</button>
          </div>
          <div className="cta-trust">
            <span>🔒 No credit card required</span>
            <span>•</span>
            <span>❤️ Open source friendly</span>
            <span>•</span>
            <span>🔨 Built with ADK-TS</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🔨</span>
                <span className="logo-text">AuditForge</span>
              </div>
              <p className="footer-tagline">Forging Secure Smart Contracts</p>
              <div className="footer-social">
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Discord</a>
              </div>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Product</h5>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">GitHub Integration</a>
              <a href="#">API Docs</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Resources</h5>
              <a href="#">Documentation</a>
              <a href="#">Blog</a>
              <a href="#">Vulnerability Database</a>
              <a href="#">Community</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <a href="#">About</a>
              <a href="#">Hackathon Story</a>
              <a href="#">Security</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="footer-newsletter">
              <h5 className="footer-heading">Stay Updated</h5>
              <p>Get security tips and product updates</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button className="btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 AuditForge. Built with ADK-TS for IQ AI Hackathon.</p>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
