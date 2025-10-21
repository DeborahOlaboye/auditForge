/**
 * DOS-01: DoS with Block Gas Limit
 */

import { VulnerabilityRule, Severity } from '../../types';

export const dosLoopsRule: VulnerabilityRule = {
  id: 'DOS-01',
  name: 'DoS with Block Gas Limit',
  severity: Severity.MEDIUM,
  description: 'Unbounded loops over dynamic arrays can lead to DoS',
  pattern: /for\s*\([^)]*\.length/g,
  recommendation: 'Implement pagination or pull pattern for large arrays',
  references: ['SWC-128']
};
