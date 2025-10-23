/**
 * TD-01: Timestamp Dependence
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const timestampDependenceRule: VulnerabilityRule = {
  id: 'TD-01',
  name: 'Timestamp Dependence',
  severity: Severity.MEDIUM,
  description: 'Usage of block.timestamp for critical logic can be manipulated by miners',
  pattern: /block\.timestamp|now/g,
  recommendation: 'Use block.number for time-sensitive logic or accept miner manipulation risk',
  references: ['SWC-116']
};
