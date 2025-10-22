/**
 * SP-01: Inefficient Storage Packing
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const storagePackingRule: VulnerabilityRule = {
  id: 'SP-01',
  name: 'Inefficient Storage Packing',
  severity: Severity.INFO,
  description: 'Storage variables could be better packed to save gas',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    // Simplified check
    return [];
  },
  recommendation: 'Reorder state variables to optimize storage slots',
  references: ['Gas Optimization']
};
