# AuditForge

**Forging Secure Smart Contracts**

AI-powered smart contract security auditor built with ADK-TS. Detects vulnerabilities, prevents exploits, protects your DeFi protocol.

[Try Live Demo](https://audit-forge.vercel.app/) | [Documentation](https://github.com/DeborahOlaboye/auditForge)

---

## Overview

AuditForge is an AI-powered smart contract security auditor that analyzes Solidity code for vulnerabilities in seconds. Built with ADK-TS's multi-agent architecture, it brings enterprise-grade security analysis to every blockchain developer—from solo builders to established DeFi protocols.

### The Problem

- **$3+ billion** lost to smart contract exploits in 2024 alone
- Professional audits cost **$5,000-$100,000** and take **weeks**
- Small teams and solo developers can't afford professional security reviews
- Critical vulnerabilities slip into production, putting user funds at risk

### The Solution

AuditForge provides instant, professional-grade security audits for free:
- **3-5 second** analysis time
- **20+ vulnerability types** detected
- **AI-powered** deep semantic analysis
- **GitHub integration** for continuous monitoring
- **$0 cost** for open-source projects

---

## Project Structure

AuditForge is organized into two main components:

```
auditForge/
├── backend/          # ADK-TS powered API server (Node.js + TypeScript)
│   ├── src/
│   │   ├── agents/   # ADK-TS agents for security auditing
│   │   ├── api/      # Express REST API
│   │   └── detector/ # Vulnerability detection engine
│   ├── package.json
│   └── README.md     # Backend deployment guide
│
├── frontend/         # React + TypeScript web interface
│   ├── src/
│   │   ├── pages/    # Auditor UI
│   │   └── services/ # API client
│   ├── package.json
│   └── README.md
│
├── docs/             # Documentation
├── examples/         # Sample contracts
└── README.md         # This file
```

### Quick Links

- **Backend**: [./backend/README.md](./backend/README.md) - API server deployment
- **Frontend**: [./frontend/README.md](./frontend/README.md) - Web UI deployment
- **Live Demo**: https://audit-forge.vercel.app/
- **API Docs**: [./docs/API.md](./docs/API.md)

---

## Why AuditForge?

### For Solo Developers
> "I can't afford a $50K audit, but I can't deploy without security confidence."

**AuditForge gives you:**
- Free, instant security analysis
- Clear explanations in plain English
- Step-by-step fix recommendations
- Confidence to deploy safely

### For Development Teams
> "We need continuous security monitoring integrated into our workflow."

**AuditForge provides:**
- Automatic GitHub PR reviews
- CI/CD pipeline integration via API
- Team collaboration features
- Catch issues before production

### For DeFi Protocols
> "A single vulnerability could drain our entire treasury."

**AuditForge protects:**
- Multi-million dollar treasuries
- User funds and protocol reputation
- Against common and novel attack vectors
- With AI-powered business logic analysis

### For Security Firms
> "We need tools that augment our auditors, not replace them."

**AuditForge enables:**
- Automated first-pass analysis
- Focus human expertise on complex logic
- Faster turnaround times
- Comprehensive coverage

---

## Features

### Core Capabilities

#### Comprehensive Vulnerability Detection
- **20+ vulnerability patterns** detected automatically
- **Reentrancy attacks** (The DAO-style exploits)
- **Integer overflow/underflow** (pre-0.8.0 Solidity)
- **Access control issues** (unauthorized function calls)
- **Unchecked return values** (silent failures)
- **Front-running vulnerabilities** (MEV attacks)
- **DoS attacks** (block gas limit, unbounded loops)
- **Timestamp dependence** (weak randomness)
- **Delegatecall to untrusted addresses**
- **And 12+ more** critical security issues

#### AI-Powered Deep Analysis
- **LLM-driven semantic analysis** using GPT-4/Claude
- **Business logic flaw detection** beyond pattern matching
- **Natural language explanations** of vulnerabilities
- **Exploit scenario walkthroughs** for understanding impact
- **Contextual fix recommendations** with code examples
- **False positive validation** by AI reasoning

#### Lightning Fast
- **< 5 seconds** average audit time
- **Real-time feedback** as you code
- **Instant results** via web interface
- **Async processing** for large contracts

#### GitHub Integration
- **Automatic PR reviews** for Solidity changes
- **Inline code comments** with security findings
- **Status checks** (approve/block based on severity)
- **Continuous monitoring** of repositories
- **Team notifications** for critical issues

#### Comprehensive Reports
- **Executive summaries** for stakeholders
- **Detailed vulnerability breakdowns** with severity levels
- **Gas optimization suggestions** for efficiency
- **AI insights** on architecture and design
- **Multiple export formats:**
  - PDF (professional audit report)
  - JSON (machine-readable, CI/CD integration)
  - Markdown (GitHub-friendly)
  - HTML (shareable web view)

#### Developer-Friendly Interface
- **Monaco Editor** integration (VS Code experience)
- **Syntax highlighting** for Solidity
- **Line-by-line vulnerability highlighting**
- **Interactive code fixes** (copy corrected code)
- **Dark mode** support
- **Mobile responsive** design

### Advanced Features

#### Multiple Integration Points
- **Web Interface**: No installation required
- **REST API**: Programmatic access for automation
- **GitHub App**: Install once, continuous monitoring
- **CLI Tool**: Terminal-based auditing (coming soon)

#### Sample Contracts
- **Pre-loaded examples** of common vulnerabilities
- **Educational resource** for learning security
- **Testing playground** for experimenting
- **Real-world exploit recreations**

#### Analytics & Insights
- **Risk scoring** (0-10 scale)
- **Vulnerability distribution** visualization
- **Historical tracking** (if authenticated)
- **Comparison to best practices**

#### Educational Content
- **CWE/SWC references** for each vulnerability
- **Links to real-world exploits** (The DAO, etc.)
- **Security best practices** recommendations
- **OpenZeppelin library** suggestions
---

## Architecture

AuditForge uses a sophisticated multi-agent architecture powered by ADK-TS:
````
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────┐  │
│  │ Web Interface│  GitHub App  │   REST API   │    CLI   │  │
│  └──────────────┴──────────────┴──────────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Main Auditor Agent (ADK-TS Core)                │
│  • Orchestrates audit workflow                               │
│  • Manages context and state                                 │
│  • Coordinates sub-agents                                    │
│  • Handles error recovery                                    │
└─────────────────────────────────────────────────────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Parser Agent    │  │  Analyzer Agent  │  │  Reporter Agent  │
│                  │  │                  │  │                  │
│ • AST parsing    │  │ • Vuln detection │  │ • Report gen     │
│ • Code structure │  │ • AI analysis    │  │ • Multi-format   │
│ • Metadata       │  │ • Risk scoring   │  │ • Visualization  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Solidity Parser (@solidity-parser/parser)         │   │
│  │  • LLM Integration (OpenAI GPT-4 / Anthropic Claude) │   │
│  │  • Vulnerability Rule Engine (20+ patterns)          │   │
│  │  • Report Formatters (PDF, JSON, Markdown, HTML)     │   │
│  │  • GitHub API Client (@octokit/rest)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  • Audit Results Cache (Redis)                              │
│  • User Preferences (PostgreSQL - optional)                 │
│  • Historical Analytics (PostgreSQL - optional)             │
└─────────────────────────────────────────────────────────────┘
````

### Key Design Decisions

**Why Multi-Agent?**
- **Separation of concerns**: Each agent has a focused responsibility
- **Parallel processing**: Agents can work concurrently
- **Extensibility**: Easy to add new analysis agents
- **Maintainability**: Independent agent development and testing

**Why Hybrid Analysis?**
- **Pattern matching**: Fast, deterministic, catches known issues
- **AI reasoning**: Catches novel vulnerabilities, validates findings
- **Best of both worlds**: High recall + low false positives

**Why ADK-TS?**
- **Agent coordination**: Built-in multi-agent orchestration
- **Task planning**: Complex workflow management
- **LLM integration**: Simplified AI model interaction
- **Context management**: State preservation across agents
- **Error handling**: Robust failure recovery

---

## ADK-TS Implementation

### What is ADK-TS?

**ADK-TS (Agent Development Kit for TypeScript)** is a comprehensive framework for building sophisticated AI agents with multi-LLM support, advanced tools, and flexible conversation flows.

### How AuditForge Uses ADK-TS

#### 1. Main Agent Implementation

**File**: `src/agents/ADKSmartContractAuditorAgent.ts`

Our main auditor agent leverages ADK-TS's `AgentBuilder` for AI-powered orchestration:


#### 2. Multi-LLM Support via ADK-TS

ADK-TS provides seamless integration with multiple LLM providers:

The agent automatically maps to ADK-TS model identifiers:
- `openai` + `gpt-4` → `gpt-4-turbo-preview`
- `anthropic` → `claude-3-5-sonnet-20241022`

#### 3. Agent Orchestration

#### 4. AI-Powered Analysis

ADK-TS enables intelligent security analysis.

### ADK-TS Features We Leverage

1. **AgentBuilder API**
   - Fluent interface for agent creation
   - Model selection and configuration
   - Built-in runner for executing queries

2. **Multi-Provider LLM Support**
   - OpenAI (GPT-4, GPT-3.5)
   - Anthropic (Claude 3.5 Sonnet)
   - Seamless provider switching

3. **Agent Coordination**
   - State management across sub-agents
   - Error handling and recovery
   - Context preservation

4. **Type Safety**
   - Full TypeScript support
   - Strong typing for agent responses
   - IntelliSense support in development

### Project Structure with ADK-TS

```
src/
├── agents/
│   ├── ADKSmartContractAuditorAgent.ts   # ✨ ADK-TS powered main agent
│   ├── parser/ParserAgent.ts              # Sub-agent: Solidity parsing
│   └── report/ReportAgent.ts              # Sub-agent: Report generation
├── analyzer/
│   └── AIAnalyzer.ts                      # AI analysis with LLM integration
├── detector/
│   └── VulnerabilityDetector.ts           # Pattern-based detection (20+ rules)
└── api/
    └── server.ts                          # Express API (uses ADK-TS agent)
```

### Benefits of ADK-TS Integration

✅ **Rapid Development**: Pre-built agent patterns accelerate implementation
✅ **Multi-LLM Flexibility**: Switch between OpenAI and Anthropic seamlessly
✅ **Type Safety**: Full TypeScript support with strong typing
✅ **Production Ready**: Robust error handling and retry logic built-in
✅ **Scalability**: Stateless agents support horizontal scaling
✅ **Maintainability**: Clean separation between agent logic and business logic

#### Example PR Comment
````markdown
## AuditForge Security Audit

**Risk Level:** 🔴 HIGH RISK

**Issues Found:** 3 Critical, 5 High, 2 Medium

---

### ⚠️ Critical Issues

#### 1. Reentrancy Vulnerability
**File:** `contracts/Vault.sol`
**Lines:** 45-52
**Function:** `withdraw(uint256 amount)`

**Description:** External call before state update allows reentrancy attack.

**Recommendation:**
```solidity
// Move state update before external call
balances[msg.sender] -= amount;
(bool success,) = msg.sender.call{value: amount}("");
require(success);
```

[View Details](link) | [Learn More](link)

---

#### 2. Access Control Missing
**File:** `contracts/Vault.sol`
**Lines:** 78-82
**Function:** `setOwner(address newOwner)`

**Description:** Anyone can call this function and change the contract owner.

**Recommendation:**
```solidity
function setOwner(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    owner = newOwner;
}
```

---

### Summary

- **Action Required:** Fix 3 critical issues before merging
- **Full Report:** [View Complete Audit](link)
- **Gas Savings:** 5 optimization opportunities found

---

*Powered by AuditForge built with love for ADK-TS hackathon*
````

---