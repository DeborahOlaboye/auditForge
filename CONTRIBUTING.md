# Contributing to Smart Contract Security Auditor

Thank you for your interest in contributing! This project welcomes contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/smart-contract-auditor/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Sample contract code (if applicable)
   - Your environment (Node version, OS, etc.)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Consider implementation approach

### Adding Vulnerability Rules

New security rules are highly valuable! Here's how:

1. **Research the Vulnerability**
   - Study real-world exploits
   - Review CWE/SWC classifications
   - Gather reference materials

2. **Create Rule File**
   ```typescript
   // src/detector/rules/myRule.ts
   import { VulnerabilityRule, Severity } from '../../types';

   export const myRule: VulnerabilityRule = {
     id: 'MY-01',
     name: 'My Vulnerability Name',
     severity: Severity.HIGH,
     description: 'Clear description',
     pattern: (ast, metadata) => {
       // Detection logic
       return vulnerabilities;
     },
     recommendation: 'How to fix',
     references: ['CWE-XXX', 'SWC-XXX']
   };
   ```

3. **Add Test Contract**
   ```solidity
   // tests/contracts/vulnerable-my-rule.sol
   contract VulnerableExample {
     // Code that should trigger your rule
   }
   ```

4. **Write Tests**
   ```typescript
   // tests/unit/myRule.test.ts
   describe('MY-01 Rule', () => {
     it('should detect vulnerability', async () => {
       const code = fs.readFileSync('tests/contracts/vulnerable-my-rule.sol');
       const report = await auditor.auditContract(code);
       expect(report.vulnerabilities.some(v => v.id === 'MY-01')).toBe(true);
     });
   });
   ```

5. **Register Rule**
   ```typescript
   // src/detector/rules/index.ts
   import { myRule } from './myRule';
   export const vulnerabilityRules = [
     // ... existing rules
     myRule
   ];
   ```

### Code Style

- Use TypeScript with strict mode
- Follow existing code patterns
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Write JSDoc comments for public APIs

### Testing Requirements

- All new features need tests
- Maintain >70% code coverage
- Test both positive and negative cases
- Include integration tests for API endpoints

### Pull Request Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/smart-contract-auditor.git
   cd smart-contract-auditor
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write code following style guide
   - Add tests
   - Update documentation

3. **Test Locally**
   ```bash
   npm install
   npm run lint
   npm test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: My feature description"
   ```

   Commit message format:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements
   - `Docs:` for documentation only
   - `Test:` for test additions/changes

5. **Push and Create PR**
   ```bash
   git push origin feature/my-feature
   ```

   Then create Pull Request on GitHub with:
   - Clear title
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots (if UI changes)

6. **Code Review**
   - Address review comments
   - Make requested changes
   - Update PR

### Development Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env
nano .env

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── agents/              # Agent implementations
│   ├── SmartContractAuditorAgent.ts (Main orchestrator)
│   ├── parser/         # Solidity parser
│   └── report/         # Report generation
├── detector/           # Vulnerability detection
│   └── rules/          # Individual security rules
├── analyzer/           # AI analysis
├── api/                # REST API server
├── types/              # TypeScript types
└── utils/              # Utilities

tests/
├── contracts/          # Test Solidity contracts
├── unit/               # Unit tests
└── integration/        # Integration tests

docs/
├── ARCHITECTURE.md     # Technical architecture
├── API.md              # API documentation
└── ATP_INTEGRATION.md  # Tokenization concepts
```

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Trolling, insulting comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to [maintainer email].

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Eligible for ATP revenue sharing (when implemented)
- Invited to governance discussions

## Questions?

- Open a [Discussion](https://github.com/yourusername/smart-contract-auditor/discussions)
- Join [Discord](https://discord.gg/UbQaZkznwr)
- Review existing [Issues](https://github.com/yourusername/smart-contract-auditor/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Web3 more secure!** 🛡️
