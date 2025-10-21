# Quick Start Guide

Get the Smart Contract Security Auditor up and running in 5 minutes!

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- OpenAI API key (for AI analysis) - Get one at https://platform.openai.com/api-keys

## Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Solidity parser
- Express API server
- OpenAI/Anthropic SDKs
- TypeScript and development tools

### Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Minimum required configuration:**
```bash
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
NODE_ENV=development
LLM_PROVIDER=openai
```

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Running the Application

### Option 1: Development Mode (Recommended for Testing)

```bash
npm run dev
```

This starts the server with hot-reload enabled. Any code changes will automatically restart the server.

### Option 2: Production Mode

```bash
npm start
```

This runs the built JavaScript from the `dist/` directory.

## Verify Installation

### Test 1: Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Test 2: Quick Audit

Create a test file `test-contract.sol`:
```solidity
pragma solidity ^0.8.0;

contract Test {
    mapping(address => uint256) public balances;

    function withdraw() public {
        uint256 balance = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: balance}("");
        balances[msg.sender] = 0;
    }
}
```

Audit via API:
```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "code": "pragma solidity ^0.8.0;\n\ncontract Test {\n  mapping(address => uint256) public balances;\n\n  function withdraw() public {\n    uint256 balance = balances[msg.sender];\n    (bool success, ) = msg.sender.call{value: balance}(\"\");\n    balances[msg.sender] = 0;\n  }\n}",
  "contractName": "Test"
}
EOF
```

You should receive a detailed audit report detecting the reentrancy vulnerability!

### Test 3: Run Example Script

```bash
node dist/examples/quick-start.js
```

This runs a complete audit example and displays:
- Executive summary
- Vulnerability counts
- Detailed findings
- Recommendations

## Usage Examples

### Programmatic Usage

Create `my-audit.ts`:
```typescript
import { SmartContractAuditorAgent } from './src/agents/SmartContractAuditorAgent';

const auditor = new SmartContractAuditorAgent();

const solidityCode = `
  pragma solidity ^0.8.0;
  contract MyContract {
    // Your contract code
  }
`;

async function audit() {
  const report = await auditor.auditContract(solidityCode, 'MyContract', {
    enableAIAnalysis: true
  });

  console.log('Risk Score:', report.executiveSummary.overallRiskScore);
  console.log('Vulnerabilities:', report.vulnerabilities.length);

  // Export to markdown
  const markdown = await auditor.exportMarkdown(report);
  console.log(markdown);
}

audit();
```

Run it:
```bash
npx tsx my-audit.ts
```

### API Usage with cURL

**Audit a contract:**
```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "pragma solidity ^0.8.0; contract Example { }",
    "contractName": "Example",
    "options": {
      "enableAIAnalysis": true
    }
  }'
```

**Export to Markdown:**
```bash
curl -X POST http://localhost:3000/api/audit/123/export/markdown \
  -H "Content-Type: application/json" \
  -d '{
    "report": { ... }
  }'
```

### API Usage with JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function auditContract(code: string) {
  const response = await axios.post(`${API_BASE}/audit`, {
    code,
    contractName: 'MyContract',
    options: { enableAIAnalysis: true }
  });

  return response.data.report;
}

const report = await auditContract(solidityCode);
console.log(`Found ${report.executiveSummary.totalVulnerabilities} issues`);
```

### API Usage with Python

```python
import requests

def audit_contract(code):
    response = requests.post('http://localhost:3000/api/audit', json={
        'code': code,
        'contractName': 'MyContract',
        'options': {'enableAIAnalysis': True}
    })
    return response.json()['report']

report = audit_contract(solidity_code)
print(f"Risk Score: {report['executiveSummary']['overallRiskScore']}/10")
```

## Testing

### Run Tests

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Common Issues

### Issue: "Cannot find module"

**Solution:** Make sure you've built the project:
```bash
npm run build
```

### Issue: "API key not configured"

**Solution:** Check your `.env` file:
```bash
cat .env | grep OPENAI_API_KEY
```

Make sure it's set and valid.

### Issue: "Port 3000 already in use"

**Solution:** Change the port in `.env`:
```bash
PORT=3001
```

Or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: AI analysis fails

**Solution:**
1. Verify API key is valid
2. Check you have API credits
3. Set `enableAIAnalysis: false` to use pattern-only detection

## Next Steps

1. **Read the Documentation**
   - [README.md](README.md) - Project overview
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical details
   - [API.md](docs/API.md) - API reference
   - [ATP_INTEGRATION.md](docs/ATP_INTEGRATION.md) - Tokenization concepts

2. **Try Different Contracts**
   - Use the sample vulnerable contracts in `tests/contracts/`
   - Test your own smart contracts
   - Compare results with professional audits

3. **Explore the Code**
   - Check vulnerability rules in `src/detector/rules/`
   - Review the multi-agent architecture
   - Study the AI analysis prompts

4. **Contribute**
   - Add new vulnerability rules
   - Improve detection accuracy
   - Enhance documentation
   - See [CONTRIBUTING.md](CONTRIBUTING.md)

## Support

- **Documentation**: [Full docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-contract-auditor/issues)
- **Discord**: [IQ AI Community](https://discord.gg/UbQaZkznwr)

## Pro Tips

1. **Enable AI Analysis** for best results (requires API key)
2. **Test incrementally** - audit small contracts first
3. **Compare outputs** with known vulnerabilities
4. **Use rate limiting** - default is 10 requests/minute
5. **Cache results** for repeated audits of same contract

## What's Next?

After getting familiar with basic usage:

- [ ] Set up GitHub integration for automatic PR reviews
- [ ] Deploy to production (Vercel + Railway)
- [ ] Integrate into your CI/CD pipeline
- [ ] Build custom vulnerability rules
- [ ] Contribute to the project

---

**Happy Auditing! 🛡️**

For detailed usage, see the full [README.md](README.md)
