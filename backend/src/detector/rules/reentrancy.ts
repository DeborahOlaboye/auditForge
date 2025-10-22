/**
 * RE-01: Reentrancy Attack Detection
 * Detects potential reentrancy vulnerabilities
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const reentrancyRule: VulnerabilityRule = {
  id: 'RE-01',
  name: 'Reentrancy Vulnerability',
  severity: Severity.CRITICAL,
  description: 'External calls followed by state changes can lead to reentrancy attacks',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    // Check each function for reentrancy patterns
    for (const func of metadata.functions) {
      const hasExternalCall = metadata.externalCalls.some(
        call => call.location.functionName === func.name && call.type === 'call'
      );

      // Simplified reentrancy check
      if (hasExternalCall && !func.modifiers.includes('nonReentrant')) {
        vulnerabilities.push({
          id: 'RE-01',
          name: 'Reentrancy Vulnerability',
          severity: Severity.CRITICAL,
          description: `Function "${func.name}" makes external calls without reentrancy protection`,
          location: func.location,
          technicalExplanation: 'External calls using .call{value:}() can allow malicious contracts to reenter the function before state changes are finalized, potentially draining funds.',
          exploitScenario: 'An attacker creates a malicious contract with a fallback function that calls back into this function, withdrawing funds multiple times before the balance is updated.',
          recommendation: 'Use the checks-effects-interactions pattern: perform all state changes before making external calls, or use a ReentrancyGuard modifier.',
          codeSnippet: `// Vulnerable:\nfunction withdraw() public {\n  (bool success, ) = msg.sender.call{value: balance}("");\n  balance = 0; // State change after external call\n}\n\n// Fixed:\nfunction withdraw() public nonReentrant {\n  uint amount = balance;\n  balance = 0; // State change before external call\n  (bool success, ) = msg.sender.call{value: amount}("");\n}`,
          references: [
            'CWE-841: Improper Enforcement of Behavioral Workflow',
            'SWC-107: Reentrancy',
            'The DAO Hack (2016)'
          ],
          confidence: 0.85
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Implement checks-effects-interactions pattern or use ReentrancyGuard',
  references: ['SWC-107', 'CWE-841']
};
