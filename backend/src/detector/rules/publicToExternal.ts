/**
 * PE-01: Public Functions Could Be External
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const publicToExternalRule: VulnerabilityRule = {
  id: 'PE-01',
  name: 'Public Functions Could Be External',
  severity: Severity.INFO,
  description: 'Public functions not called internally should be external for gas savings',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const func of metadata.functions) {
      if (func.visibility === 'public' && !func.name.startsWith('_')) {
        vulnerabilities.push({
          id: 'PE-01',
          name: 'Public Function Could Be External',
          severity: Severity.INFO,
          description: `Function "${func.name}" is public but could be external`,
          location: func.location,
          technicalExplanation: 'Functions that are not called internally can be marked as external instead of public, saving gas.',
          exploitScenario: 'Not a security issue, but wastes gas unnecessarily.',
          recommendation: 'Change visibility from public to external if the function is not called internally.',
          codeSnippet: `// Before:\nfunction ${func.name}() public { }\n\n// After:\nfunction ${func.name}() external { }`,
          references: ['Gas Optimization'],
          confidence: 0.50
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Change public to external for gas optimization',
  references: ['Gas Optimization']
};
