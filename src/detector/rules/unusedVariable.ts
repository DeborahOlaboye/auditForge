/**
 * UV-01: Unused Variables
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const unusedVariableRule: VulnerabilityRule = {
  id: 'UV-01',
  name: 'Unused Variables',
  severity: Severity.LOW,
  description: 'Declared variables that are never used',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    // Simplified - would need full dataflow analysis in production
    return [];
  },
  recommendation: 'Remove unused variables or prefix with underscore',
  references: ['Code Quality']
};
