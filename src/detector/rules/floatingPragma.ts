/**
 * FP-01: Floating Pragma
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const floatingPragmaRule: VulnerabilityRule = {
  id: 'FP-01',
  name: 'Floating Pragma',
  severity: Severity.MEDIUM,
  description: 'Pragma version not locked to specific compiler version',
  pattern: /pragma\s+solidity\s+[\^~]/g,
  recommendation: 'Lock pragma to specific Solidity version for production contracts',
  references: ['SWC-103']
};
