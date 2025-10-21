/**
 * ZA-01: Missing Zero Address Check
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const zeroAddressRule: VulnerabilityRule = {
  id: 'ZA-01',
  name: 'Missing Zero Address Check',
  severity: Severity.LOW,
  description: 'Address parameters should be validated against zero address',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const func of metadata.functions) {
      const hasAddressParam = func.parameters.some(p => p.type === 'address');

      if (hasAddressParam && ['public', 'external'].includes(func.visibility)) {
        vulnerabilities.push({
          id: 'ZA-01',
          name: 'Missing Zero Address Check',
          severity: Severity.LOW,
          description: `Function "${func.name}" accepts address parameter without zero address validation`,
          location: func.location,
          technicalExplanation: 'Address parameters should be validated to ensure they are not the zero address (0x0) to prevent accidental loss of funds or broken functionality.',
          exploitScenario: 'User accidentally passes zero address, causing funds to be permanently locked or functionality to break.',
          recommendation: 'Add require statement to check address != address(0).',
          codeSnippet: `// Vulnerable:\nfunction setOwner(address newOwner) public {\n  owner = newOwner;\n}\n\n// Fixed:\nfunction setOwner(address newOwner) public {\n  require(newOwner != address(0), "Zero address");\n  owner = newOwner;\n}`,
          references: ['Best Practice'],
          confidence: 0.60
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Add require(address != address(0)) checks',
  references: ['Best Practice']
};
