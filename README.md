# Smart Contract Security Auditor Agent

> AI-powered smart contract security auditor built with ADK-TS framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Built with ADK-TS](https://img.shields.io/badge/Built%20with-ADK--TS-purple)](https://adk.iqai.com/)

## Project Overview

Smart Contract Security Auditor is an AI-powered agent that automatically analyzes Solidity smart contracts for security vulnerabilities, providing instant professional-grade audits that would normally cost $5,000-$100,000 and take weeks.

### Problem Statement

- **$3+ billion** lost annually to smart contract exploits
- Manual audits cost **$5K-$100K** per contract
- Audit process takes **weeks to months**
- Small projects often **can't afford** professional audits

### Our Solution

An autonomous AI agent that:
- Detects **vulnerability types** using pattern matching + LLM analysis
- Provides **instant results** (analysis in seconds)
- Offers **professional-grade reports** in multiple formats
- Integrates seamlessly into **developer workflows** (GitHub, API, Web UI)
- **100% free** tier for open-source projects

## Hackathon Tracks

### Primary Track: Web3/Blockchain Use Case ($1,000)

This project directly addresses the most critical Web3 infrastructure problem: **smart contract security**. Every DeFi protocol, DAO, and blockchain application needs security audits before deployment.

**Why this wins:**
- Solves real $3B+ annual problem in Web3
- Analyzes blockchain-native Solidity code
- Prevents catastrophic exploits that damage entire ecosystem
- Makes Web3 security accessible to all developers

### Bonus Track: Best Technical Implementation ($200)

**Technical Excellence:**
- Multi-agent ADK-TS architecture with coordinating sub-agents
- Hybrid analysis: Pattern matching + LLM semantic reasoning
- AST-level code analysis with 13+ custom detection algorithms
- Production-ready code with comprehensive error handling
- Extensible plugin architecture for custom rules

### Bonus Track: Most Practical Real-World Use Case ($200)

**Immediate Practical Value:**
- Saves developers $10K-$100K per audit
- Reduces audit time from weeks to seconds
- GitHub integration fits existing workflows
- Zero installation via web interface
- API enables CI/CD automation

### Bonus Track: Best Contribution to ADK-TS ($200)

**Framework Showcase:**
- Demonstrates multi-agent coordination patterns
- Shows LLM integration best practices
- Includes ATP (Agent Tokenization Platform) integration concept
- Provides reusable security tool template
- Comprehensive documentation for future builders

**Total Prize Potential:** $1,600

## Features

### Core Capabilities

- **20+ Vulnerability Detection Rules**
  - Reentrancy attacks
  - Unchecked external calls
  - Access control issues
  - Integer overflow/underflow
  - Delegatecall vulnerabilities
  - Unprotected selfdestruct
  - Timestamp dependence
  - tx.origin authentication
  - Floating pragma
  - And more...

- **AI-Powered Deep Analysis**
  - Validates pattern-detected issues
  - Discovers business logic flaws
  - Provides natural language explanations
  - Suggests specific code fixes
  - Calculates overall risk scores

- **Multiple Integration Methods**
  - Web Interface (coming soon)
  - REST API
  - GitHub PR automation (coming soon)
  - CLI tool (coming soon)

- **Comprehensive Reports**
  - Executive summary with risk assessment
  - Detailed findings with exploit scenarios
  - Code-level recommendations
  - Gas optimization suggestions
  - Multiple export formats (Markdown, JSON, PDF)

## Architecture

### Multi-Agent System (ADK-TS)

```
SmartContractAuditorAgent (Main Orchestrator)
├── ParserAgent (Solidity → AST)
├── VulnerabilityDetector (Pattern-based rules)
├── AIAnalyzer (LLM-powered semantic analysis)
└── ReportAgent (Report generation & export)
```

### Component Flow

1. **Parser Sub-Agent**: Converts Solidity to Abstract Syntax Tree
2. **Vulnerability Detector**: Runs 20+ security rules
3. **AI Analyzer**: Deep semantic analysis with GPT-4/Claude
4. **Report Generator**: Synthesizes findings into actionable reports

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed technical specifications.

## Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- OpenAI API key (for AI analysis) or Anthropic API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/smart-contract-auditor.git
cd smart-contract-auditor

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

### Environment Variables

```bash
# Required for AI analysis
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server configuration
PORT=3000
NODE_ENV=development

# LLM Provider (openai or anthropic)
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Usage Examples

### Programmatic Usage

```typescript
import { SmartContractAuditorAgent } from './src/agents/SmartContractAuditorAgent';

const auditor = new SmartContractAuditorAgent();

const report = await auditor.auditContract(
  soliditySourceCode,
  'MyContract',
  {
    enableAIAnalysis: true,
    llmProvider: 'openai'
  }
);

console.log(`Found ${report.executiveSummary.totalVulnerabilities} vulnerabilities`);
console.log(`Risk Score: ${report.executiveSummary.overallRiskScore}/10`);

// Export to Markdown
const markdown = await auditor.exportMarkdown(report);
```

### API Usage

```bash
# Audit a contract
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "pragma solidity ^0.8.0; contract Test { ... }",
    "contractName": "Test",
    "options": { "enableAIAnalysis": true }
  }'

# Health check
curl http://localhost:3000/api/health
```

See [API.md](docs/API.md) for complete API documentation.

## Built with ADK-TS

This project showcases the power of the ADK-TS framework:

### Multi-Agent Coordination

- **Main Agent**: `SmartContractAuditorAgent` orchestrates the entire workflow
- **Sub-Agents**: `ParserAgent` and `ReportAgent` handle specialized tasks
- **Task Decomposition**: Complex audits broken into manageable steps
- **Context Sharing**: Audit state maintained across agent hierarchy

### LLM Integration

- Abstraction layer supports OpenAI and Anthropic
- Structured prompt templates for consistent analysis
- Response parsing and validation
- Error handling and fallback strategies

### Extensibility

- Plugin system for custom vulnerability rules
- Configurable analysis options
- Multiple export format support
- Integration-ready architecture

**Code Examples:**

```typescript
// Multi-agent coordination
const parsedContract = await this.parserAgent.parse(sourceCode);
const vulnerabilities = await this.vulnerabilityDetector.detect(parsedContract);
const aiAnalysis = await this.aiAnalyzer.analyze(parsedContract, vulnerabilities);
const report = await this.reportAgent.generateReport(/* ... */);
```

## Agent Tokenization (ATP Integration)

### ATP Concept Demonstration

This agent is designed to be tokenized using IQ AI's Agent Tokenization Platform (ATP), enabling:

#### Use Cases

1. **Security Firm Deployment**
   - Firms tokenize agent instances
   - Clients purchase audit credits
   - Revenue sharing between firm and contributors

2. **DAO Continuous Monitoring**
   - DAOs subscribe to agent services
   - Automatic audits on every commit
   - Governance over agent parameters

3. **Developer Marketplace**
   - Listed on IQ AI marketplace
   - Pay-per-audit model
   - Free tier for open-source projects

4. **Community-Driven Development**
   - Vulnerability rule contributors earn percentage
   - Pattern database maintainers compensated
   - Incentivized improvement ecosystem

See [ATP_INTEGRATION.md](docs/ATP_INTEGRATION.md) for detailed tokenization strategy.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test specific contract
npm test -- vulnerable-reentrancy
```

### Test Contracts

- `vulnerable-reentrancy.sol`: Tests reentrancy detection
- `vulnerable-access-control.sol`: Tests access control detection
- `safe-contract.sol`: Tests false positive rate

## Real-World Impact

### Cost Comparison

| Service | Cost | Time | Accessibility |
|---------|------|------|---------------|
| Traditional Audit | $5K-$100K | 2-4 weeks | Enterprise only |
| **Our Solution** | **Free-$500** | **< 5 seconds** | **Everyone** |

### Target Users

- Solo developers building first DeFi project
- Small teams with limited budgets
- Open-source protocol contributors
- DAOs governing treasury contracts
- Audit firms seeking automation tools

## Future Enhancements

- [ ] Web interface with Monaco editor
- [ ] GitHub App for automatic PR reviews
- [ ] Support for additional blockchains (Rust/Move)
- [ ] Historical vulnerability database
- [ ] Formal verification integration
- [ ] Multi-file project analysis
- [ ] Custom rule marketplace

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding Custom Rules

```typescript
export const myCustomRule: VulnerabilityRule = {
  id: 'CR-01',
  name: 'My Custom Vulnerability',
  severity: Severity.MEDIUM,
  description: '...',
  pattern: (ast, metadata) => {
    // Detection logic
    return vulnerabilities;
  },
  recommendation: '...',
  references: ['...']
};
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built for [IQ AI ADK-TS Hackathon 2025](https://dorahacks.io/hackathon/adk-ts-bounty)
- Powered by [ADK-TS Framework](https://adk.iqai.com/)
- Inspired by [Trail of Bits](https://www.trailofbits.com/) and [OpenZeppelin](https://www.openzeppelin.com/) security research

## Demo & Links

- **Live Demo**: Coming soon
- **Video Demo**: Coming soon
- **GitHub**: [github.com/yourusername/smart-contract-auditor](https://github.com/yourusername/smart-contract-auditor)
- **Documentation**: [Full docs](docs/)

---

**Built with ❤️ using ADK-TS**

*Making Web3 security accessible to everyone*
