/**
 * RN-01: Weak Randomness
 */

import { VulnerabilityRule, Severity } from '../../types';

export const randomnessRule: VulnerabilityRule = {
  id: 'RN-01',
  name: 'Weak Randomness Source',
  severity: Severity.HIGH,
  description: 'Using block properties for randomness is predictable',
  pattern: /block\.timestamp|block\.number|block\.difficulty|blockhash/g,
  recommendation: 'Use Chainlink VRF or similar oracle for secure randomness',
  references: ['SWC-120', 'Predictable Randomness']
};
