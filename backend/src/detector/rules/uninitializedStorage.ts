/**
 * US-01: Uninitialized Storage Pointers
 */

import { VulnerabilityRule, Severity } from '../../types';

export const uninitializedStorageRule: VulnerabilityRule = {
  id: 'US-01',
  name: 'Uninitialized Storage Pointers',
  severity: Severity.MEDIUM,
  description: 'Local structs without explicit storage location can corrupt state',
  pattern: /struct\s+\w+\s+\w+\s*;/g,
  recommendation: 'Explicitly declare memory or storage for struct variables',
  references: ['SWC-109']
};
