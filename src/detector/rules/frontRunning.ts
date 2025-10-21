/**
 * FR-01: Front-Running Vulnerability
 */

import { VulnerabilityRule, Severity } from '../../types';

export const frontRunningRule: VulnerabilityRule = {
  id: 'FR-01',
  name: 'Front-Running Vulnerability',
  severity: Severity.HIGH,
  description: 'Price or state changes visible before execution can be front-run',
  pattern: /function\s+\w+.*public.*payable|function\s+\w+.*external.*payable/g,
  recommendation: 'Use commit-reveal scheme for sensitive operations',
  references: ['Front-Running', 'MEV']
};
