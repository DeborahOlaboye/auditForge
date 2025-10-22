/**
 * TX-01: Tx.origin Usage
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const txOriginRule: VulnerabilityRule = {
  id: 'TX-01',
  name: 'Tx.origin Authentication',
  severity: Severity.MEDIUM,
  description: 'Using tx.origin for authorization is vulnerable to phishing attacks',
  pattern: /tx\.origin/g,
  recommendation: 'Use msg.sender instead of tx.origin for authentication',
  references: ['SWC-115']
};
