/**
 * AC-01: Access Control Issues Detection
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const accessControlRule: VulnerabilityRule = {
  id: 'AC-01',
  name: 'Missing Access Control',
  severity: Severity.HIGH,
  description: 'Critical functions lack proper access control modifiers',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    // Critical function names that should have access control
    const criticalFunctions = ['withdraw', 'transferOwnership', 'setOwner', 'pause', 'unpause', 'mint', 'burn'];

    for (const func of metadata.functions) {
      const isCritical = criticalFunctions.some(name =>
        func.name.toLowerCase().includes(name.toLowerCase())
      );

      const hasAccessControl = func.modifiers.some(mod =>
        ['onlyOwner', 'onlyAdmin', 'requiresAuth', 'authorized'].includes(mod)
      );

      if (isCritical && !hasAccessControl && ['public', 'external'].includes(func.visibility)) {
        vulnerabilities.push({
          id: 'AC-01',
          name: 'Missing Access Control',
          severity: Severity.HIGH,
          description: `Critical function "${func.name}" is ${func.visibility} without access control`,
          location: func.location,
          technicalExplanation: 'Functions that modify critical contract state or handle funds should be restricted to authorized addresses only.',
          exploitScenario: `Any user can call ${func.name}() and perform privileged operations, potentially draining funds or taking over the contract.`,
          recommendation: `Add access control modifier such as "onlyOwner" or implement role-based access control.`,
          codeSnippet: `// Vulnerable:\nfunction ${func.name}() public {\n  // critical operation\n}\n\n// Fixed:\nfunction ${func.name}() public onlyOwner {\n  // critical operation\n}`,
          references: [
            'SWC-105: Unprotected Ether Withdrawal',
            'CWE-284: Improper Access Control'
          ],
          confidence: 0.90
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Add appropriate access control modifiers to critical functions',
  references: ['SWC-105', 'CWE-284']
};
