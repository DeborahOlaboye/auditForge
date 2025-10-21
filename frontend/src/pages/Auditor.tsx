
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auditContract } from '../services/api';
import type { AuditReport, Vulnerability } from '../types';

const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;
    }
}`;

export default function Auditor() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'gas' | 'ai'>('overview');
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);

  const onLoadSample = () => setCode(sampleContract);

  const onClearCode = () => {
    setCode('');
    setReport(null);
    setError(null);
  };

  const onRunAudit = async () => {
    if (!code.trim()) {
      alert('Please enter some Solidity code first!');
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    setActiveTab('overview');

    try {
      const r = await auditContract(code, 'Contract', false);
      setReport(r);
    } catch (e: any) {
      setError(e?.message || 'Audit failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 9) return { level: 'CRITICAL', color: 'critical', message: '⚠️ DO NOT DEPLOY - Critical vulnerabilities detected' };
    if (score >= 7) return { level: 'HIGH RISK', color: 'high', message: '⚠️ REVIEW REQUIRED - Fix high severity issues before deployment' };
    if (score >= 4) return { level: 'MEDIUM RISK', color: 'medium', message: '⚠️ REVIEW RECOMMENDED - Address issues before production' };
    return { level: 'LOW RISK', color: 'safe', message: '✓ SAFE TO DEPLOY - No critical issues found' };
  };

  const toggleVulnerability = (id: string) => {
    setExpandedVuln(expandedVuln === id ? null : id);
  };

  return (
    <div className="auditor-page">
      {/* Navigation Bar */}
      <nav className="auditor-navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🔨</span>
            <span className="logo-text">AuditForge</span>
          </Link>
          <div className="page-title">
            <h2>Smart Contract Auditor</h2>
            <div className="breadcrumb">
              <Link to="/">Home</Link> → Audit
            </div>
          </div>
          <div className="nav-actions">
            <a href="https://github.com/yourusername/smart-contract-auditor" target="_blank" rel="noreferrer" className="icon-button" title="GitHub">
              <span>⭐</span>
            </a>
            <button className="icon-button" title="Help">
              <span>?</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Audit Interface */}
      <div className="audit-interface">
        {/* Left Panel: Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <div className="editor-header-left">
              <div className="tab-indicator">Contract.sol</div>
              {code && <button className="icon-btn" onClick={onClearCode} title="Clear">×</button>}
            </div>
            <div className="editor-header-center">
              <span className="file-info">{code.split('\n').length} lines | Solidity</span>
            </div>
            <div className="editor-header-right">
              <button className="icon-btn" onClick={onLoadSample} title="Load Sample">
                <span>🧪</span>
              </button>
            </div>
          </div>

          <div className="editor-main">
            {!code ? (
              <div className="editor-placeholder">
                <div className="placeholder-icon">📄</div>
                <h3>Paste Your Solidity Contract</h3>
                <p>Or upload a .sol file, or try a sample contract</p>
                <div className="placeholder-actions">
                  <button className="btn-secondary" onClick={onLoadSample}>
                    🧪 Try Sample Contract
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                className="code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your code here&#10;}"
                spellCheck={false}
              />
            )}
          </div>

          <div className="editor-footer">
            {!loading ? (
              <>
                <div className="footer-left">
                  <button className="text-btn" onClick={onClearCode} disabled={!code}>
                    Clear Code
                  </button>
                </div>
                <button className="btn-audit" onClick={onRunAudit} disabled={!code}>
                  <span className="btn-icon">🔨</span>
                  <span>Run Security Audit</span>
                </button>
                <div className="footer-right">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked /> Show AI insights
                  </label>
                </div>
              </>
            ) : (
              <div className="analysis-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-text">
                  <span className="analyzing-text">Analyzing contract...</span>
                  <button className="text-btn" onClick={() => setLoading(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="results-panel">
          {!report && !error && !loading && (
            <div className="results-empty">
              <div className="empty-icon">🛡️</div>
              <h3>Ready to Audit</h3>
              <p>Paste your contract code and click 'Run Security Audit' to begin analysis</p>
              <div className="empty-visual">
                <div className="flow-step">📝</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">🔍</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">🛡️</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="results-loading">
              <div className="loading-anvil">⚒️</div>
              <h3>Forging Security Analysis...</h3>
              <div className="loading-steps">
                <div className="step completed">✓ Code parsed successfully</div>
                <div className="step active">⏳ Running 20+ vulnerability checks...</div>
                <div className="step">⏸ AI analysis pending...</div>
              </div>
              <p className="loading-time">Usually completes in 3-5 seconds</p>
            </div>
          )}

          {error && (
            <div className="results-error">
              <div className="error-icon">⚠️</div>
              <h3>Analysis Failed</h3>
              <p>{error}</p>
              <button className="btn-secondary" onClick={onRunAudit}>Try Again</button>
            </div>
          )}

          {report && (
            <div className="results-display">
              {/* Results Header */}
              <div className="results-header">
                <div className="risk-gauge-container">
                  <div className={`risk-gauge ${getRiskLevel(report.executiveSummary.overallRiskScore).color}`}>
                    <svg viewBox="0 0 120 120" className="gauge-svg">
                      <circle cx="60" cy="60" r="50" className="gauge-background" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="gauge-fill"
                        strokeDasharray={`${(report.executiveSummary.overallRiskScore / 10) * 314} 314`}
                      />
                    </svg>
                    <div className="gauge-content">
                      <div className="gauge-score">{report.executiveSummary.overallRiskScore.toFixed(1)}</div>
                      <div className="gauge-label">{getRiskLevel(report.executiveSummary.overallRiskScore).level}</div>
                    </div>
                  </div>
                </div>

                <div className="summary-stats">
                  <div className="stat-box critical">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-number">{report.executiveSummary.criticalCount}</div>
                    <div className="stat-label">Critical</div>
                  </div>
                  <div className="stat-box high">
                    <div className="stat-icon">🟠</div>
                    <div className="stat-number">{report.executiveSummary.highCount}</div>
                    <div className="stat-label">High Severity</div>
                  </div>
                  <div className="stat-box total">
                    <div className="stat-icon">🛡️</div>
                    <div className="stat-number">{report.executiveSummary.totalVulnerabilities}</div>
                    <div className="stat-label">Total Found</div>
                  </div>
                </div>

                <div className="header-actions">
                  <button className="btn-secondary btn-sm">Export Report ▾</button>
                </div>
              </div>

              <div className={`deployment-banner ${getRiskLevel(report.executiveSummary.overallRiskScore).color}`}>
                {getRiskLevel(report.executiveSummary.overallRiskScore).message}
              </div>

              {/* Results Tabs */}
              <div className="results-tabs">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="tab-icon">📊</span> Overview
                </button>
                <button
                  className={`tab ${activeTab === 'vulnerabilities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vulnerabilities')}
                >
                  <span className="tab-icon">🔍</span> Vulnerabilities ({report.vulnerabilities.length})
                </button>
                <button
                  className={`tab ${activeTab === 'gas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gas')}
                >
                  <span className="tab-icon">⚡</span> Gas Optimizations
                </button>
                <button
                  className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai')}
                >
                  <span className="tab-icon">🤖</span> AI Insights
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="executive-summary">
                      <h4>Executive Summary</h4>
                      <p>
                        This smart contract contains {report.executiveSummary.criticalCount} critical
                        vulnerabilities that require immediate attention. Overall risk score: {report.executiveSummary.overallRiskScore.toFixed(1)}/10.
                        {report.executiveSummary.criticalCount > 0
                          ? ' Recommendation: DO NOT DEPLOY until critical issues are resolved.'
                          : report.executiveSummary.highCount > 0
                          ? ' Recommendation: Review and fix high-severity issues before deployment.'
                          : ' No critical issues detected.'}
                      </p>
                    </div>

                    {report.vulnerabilities.length > 0 && (
                      <div className="top-concerns">
                        <h4>Top Concerns</h4>
                        <div className="concerns-grid">
                          {report.vulnerabilities.slice(0, 3).map((vuln) => (
                            <div key={vuln.id} className={`concern-card ${vuln.severity.toLowerCase()}`}>
                              <div className={`severity-badge ${vuln.severity.toLowerCase()}`}>{vuln.severity}</div>
                              <h5>{vuln.name}</h5>
                              <p className="location">Line {vuln.location.line}</p>
                              <p className="impact">{vuln.description.substring(0, 80)}...</p>
                              <button
                                className="view-details-btn"
                                onClick={() => {
                                  setActiveTab('vulnerabilities');
                                  setExpandedVuln(vuln.id);
                                }}
                              >
                                View Details →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="quick-actions">
                      <button
                        className="btn-primary"
                        onClick={() => setActiveTab('vulnerabilities')}
                      >
                        View All Vulnerabilities →
                      </button>
                      <button className="btn-secondary">Download Full Report</button>
                    </div>
                  </div>
                )}

                {activeTab === 'vulnerabilities' && (
                  <div className="vulnerabilities-tab">
                    {report.vulnerabilities.length === 0 ? (
                      <div className="no-vulnerabilities">
                        <div className="success-icon">✓</div>
                        <h3>No Vulnerabilities Detected! 🎉</h3>
                        <p>This contract passed all security checks. However, always conduct thorough testing before deployment.</p>
                        <p className="recommendation">Consider getting a professional audit for production contracts.</p>
                      </div>
                    ) : (
                      <>
                        <div className="vulnerability-filters">
                          <div className="filter-chips">
                            <button className="filter-chip active">All ({report.vulnerabilities.length})</button>
                            {report.executiveSummary.criticalCount > 0 && (
                              <button className="filter-chip critical">Critical ({report.executiveSummary.criticalCount})</button>
                            )}
                            {report.executiveSummary.highCount > 0 && (
                              <button className="filter-chip high">High ({report.executiveSummary.highCount})</button>
                            )}
                            {report.executiveSummary.mediumCount > 0 && (
                              <button className="filter-chip medium">Medium ({report.executiveSummary.mediumCount})</button>
                            )}
                          </div>
                        </div>

                        <div className="vulnerability-list">
                          {report.vulnerabilities.map((vuln) => (
                            <div key={vuln.id} className={`vulnerability-card ${vuln.severity.toLowerCase()} ${expandedVuln === vuln.id ? 'expanded' : ''}`}>
                              <div className="vuln-header" onClick={() => toggleVulnerability(vuln.id)}>
                                <div className="vuln-header-left">
                                  <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
                                  <h4>{vuln.name}</h4>
                                </div>
                                <button className="expand-btn">{expandedVuln === vuln.id ? '▲' : '▼'}</button>
                              </div>
                              <div className="vuln-meta">
                                Line {vuln.location.line} • {vuln.location.function || 'Global scope'}
                              </div>

                              {expandedVuln === vuln.id && (
                                <div className="vuln-details">
                                  <div className="detail-section">
                                    <h5>Description</h5>
                                    <p>{vuln.description}</p>
                                  </div>

                                  {vuln.location.snippet && (
                                    <div className="detail-section">
                                      <h5>Vulnerable Code</h5>
                                      <pre className="code-block vulnerable">
                                        <code>{vuln.location.snippet}</code>
                                      </pre>
                                    </div>
                                  )}

                                  <div className="detail-section">
                                    <h5>Recommended Fix</h5>
                                    <p>{vuln.recommendation}</p>
                                  </div>

                                  {vuln.references && vuln.references.length > 0 && (
                                    <div className="detail-section">
                                      <h5>References</h5>
                                      <ul className="references-list">
                                        {vuln.references.map((ref, idx) => (
                                          <li key={idx}>{ref}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="vuln-actions">
                                    <button className="action-btn">Copy Fix</button>
                                    <button className="action-btn">Mark as False Positive</button>
                                    <button className="action-btn">Learn More →</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'gas' && (
                  <div className="gas-tab">
                    <div className="gas-summary">
                      <h4>Gas Optimization Opportunities</h4>
                      <p>Gas optimization suggestions will be available in the next version.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="ai-tab">
                    <div className="ai-section">
                      <h4>Overall Assessment</h4>
                      <p>
                        I've analyzed your smart contract and identified {report.executiveSummary.totalVulnerabilities} potential
                        security issues. {report.executiveSummary.criticalCount > 0
                          ? 'The most pressing concerns are the critical vulnerabilities that could lead to significant security breaches.'
                          : 'While there are no critical issues, it\'s important to address the identified concerns before production deployment.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
