/**
 * AR-01: Improper Use of Assert
 */

import { VulnerabilityRule, Severity } from '../../types';

export const assertVsRequireRule: VulnerabilityRule = {
  id: 'AR-01',
  name: 'Improper Use of Assert',
  severity: Severity.LOW,
  description: 'Assert should only be used for invariants, not input validation',
  pattern: /assert\s*\(/g,
  recommendation: 'Use require() for input validation, assert() only for invariants',
  references: ['Best Practice']
};
