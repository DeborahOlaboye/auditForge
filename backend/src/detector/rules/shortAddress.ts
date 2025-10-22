/**
 * SA-01: Short Address Attack
 */

import { VulnerabilityRule, Severity } from '../../types';

export const shortAddressRule: VulnerabilityRule = {
  id: 'SA-01',
  name: 'Short Address Attack',
  severity: Severity.LOW,
  description: 'Missing input validation for address length',
  pattern: /function.*\(.*address.*\).*external|function.*\(.*address.*\).*public/g,
  recommendation: 'Validate address parameter length',
  references: ['Short Address Attack']
};
