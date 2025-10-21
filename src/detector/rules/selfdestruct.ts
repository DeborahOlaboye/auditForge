/**
 * SD-01: Unprotected Selfdestruct
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const selfdestructRule: VulnerabilityRule = {
  id: 'SD-01',
  name: 'Unprotected Selfdestruct',
  severity: Severity.HIGH,
  description: 'Selfdestruct without proper access control can destroy the contract',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const func of metadata.functions) {
      if (func.name.toLowerCase().includes('destruct') || func.name.toLowerCase().includes('kill')) {
        const hasAccessControl = func.modifiers.some(mod =>
          ['onlyOwner', 'onlyAdmin'].includes(mod)
        );

        if (!hasAccessControl) {
          vulnerabilities.push({
            id: 'SD-01',
            name: 'Unprotected Selfdestruct',
            severity: Severity.HIGH,
            description: `Function "${func.name}" may contain selfdestruct without access control`,
            location: func.location,
            technicalExplanation: 'The selfdestruct() function permanently destroys the contract and sends all remaining Ether to a specified address. Without proper access control, anyone can destroy the contract.',
            exploitScenario: 'An attacker calls the selfdestruct function, permanently destroying the contract and potentially stealing all funds.',
            recommendation: 'Protect selfdestruct with onlyOwner or equivalent modifier. Consider if selfdestruct is even necessary.',
            codeSnippet: `// Vulnerable:\nfunction destroy(address payable recipient) public {\n  selfdestruct(recipient);\n}\n\n// Fixed:\nfunction destroy(address payable recipient) public onlyOwner {\n  selfdestruct(recipient);\n}`,
            references: [
              'SWC-106: Unprotected SELFDESTRUCT Instruction',
              'Parity Wallet Hack (2017)'
            ],
            confidence: 0.85
          });
        }
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Add onlyOwner modifier to selfdestruct functions',
  references: ['SWC-106']
};
