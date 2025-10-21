/**
 * UR-01: Unchecked Low-Level Call Detection
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const uncheckedCallRule: VulnerabilityRule = {
  id: 'UR-01',
  name: 'Unchecked Low-Level Call',
  severity: Severity.CRITICAL,
  description: 'Low-level calls without return value checks can fail silently',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const call of metadata.externalCalls) {
      if (['call', 'delegatecall', 'send'].includes(call.type) && !call.checked) {
        vulnerabilities.push({
          id: 'UR-01',
          name: 'Unchecked Low-Level Call',
          severity: Severity.CRITICAL,
          description: `Unchecked ${call.type}() return value`,
          location: call.location,
          technicalExplanation: `The ${call.type}() function returns a boolean indicating success or failure. Not checking this return value means the contract will continue execution even if the call failed.`,
          exploitScenario: 'An attacker could force the external call to fail (e.g., by consuming all gas), but the contract continues assuming the call succeeded, potentially leading to incorrect state or loss of funds.',
          recommendation: `Always check the return value: require(success, "Call failed"); or use if-statement to handle failure.`,
          codeSnippet: `// Vulnerable:\n(bool success, ) = target.call(data);\n// continues without checking success\n\n// Fixed:\n(bool success, ) = target.call(data);\nrequire(success, "Call failed");`,
          references: [
            'SWC-104: Unchecked Call Return Value',
            'CWE-252: Unchecked Return Value'
          ],
          confidence: 0.95
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Always verify return values from low-level calls',
  references: ['SWC-104', 'CWE-252']
};
