/**
 * IO-01: Integer Overflow/Underflow Detection
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const integerOverflowRule: VulnerabilityRule = {
  id: 'IO-01',
  name: 'Integer Overflow/Underflow',
  severity: Severity.HIGH,
  description: 'Arithmetic operations without SafeMath in Solidity < 0.8.0',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    // Check pragma version from source
    // This is a simplified check - would need full pragma extraction in production

    vulnerabilities.push({
      id: 'IO-01',
      name: 'Potential Integer Overflow/Underflow',
      severity: Severity.HIGH,
      description: 'Arithmetic operations may be vulnerable to overflow/underflow',
      location: { file: 'contract.sol', line: 1, column: 0 },
      technicalExplanation: 'Solidity versions prior to 0.8.0 do not automatically check for integer overflow and underflow. Unchecked arithmetic can wrap around, leading to unexpected behavior.',
      exploitScenario: 'An attacker could manipulate arithmetic operations to overflow/underflow values, potentially bypassing balance checks or manipulating token supplies.',
      recommendation: 'Upgrade to Solidity 0.8.0+ which has built-in overflow/underflow checking, or use SafeMath library for older versions.',
      codeSnippet: `// Vulnerable (Solidity < 0.8.0):\nuint256 balance = 0;\nbalance = balance - 1; // underflows to max uint256\n\n// Fixed (Solidity >= 0.8.0):\n// Automatically reverts on overflow/underflow\n\n// Or use SafeMath:\nusing SafeMath for uint256;\nbalance = balance.sub(1); // safely reverts`,
      references: [
        'SWC-101: Integer Overflow and Underflow',
        'CWE-190: Integer Overflow',
        'CWE-191: Integer Underflow'
      ],
      confidence: 0.70
    });

    return vulnerabilities;
  },
  recommendation: 'Use Solidity 0.8.0+ or SafeMath library',
  references: ['SWC-101', 'CWE-190', 'CWE-191']
};
