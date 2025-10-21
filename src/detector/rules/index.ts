/**
 * Vulnerability Detection Rules Engine
 * Contains 20+ security rules for smart contract analysis
 */

import { VulnerabilityRule, Severity } from '../../types';
import { reentrancyRule } from './reentrancy';
import { uncheckedCallRule } from './uncheckedCall';
import { accessControlRule } from './accessControl';
import { integerOverflowRule } from './integerOverflow';
import { delegatecallRule } from './delegatecall';
import { selfdestructRule } from './selfdestruct';
import { timestampDependenceRule } from './timestampDependence';
import { txOriginRule } from './txOrigin';
import { floatingPragmaRule } from './floatingPragma';
import { zeroAddressRule } from './zeroAddress';
import { unusedVariableRule } from './unusedVariable';
import { storagePackingRule } from './storagePacking';
import { publicToExternalRule } from './publicToExternal';
import { dosLoopsRule } from './dosLoops';
import { frontRunningRule } from './frontRunning';
import { uninitializedStorageRule } from './uninitializedStorage';
import { eventMissingRule } from './eventMissing';
import { shortAddressRule } from './shortAddress';
import { assertVsRequireRule } from './assertVsRequire';
import { randomnessRule } from './randomness';

export const vulnerabilityRules: VulnerabilityRule[] = [
  // Critical Severity
  reentrancyRule,
  uncheckedCallRule,
  delegatecallRule,

  // High Severity
  integerOverflowRule,
  accessControlRule,
  selfdestructRule,
  frontRunningRule,
  randomnessRule,

  // Medium Severity
  timestampDependenceRule,
  txOriginRule,
  floatingPragmaRule,
  dosLoopsRule,
  uninitializedStorageRule,

  // Low Severity
  zeroAddressRule,
  unusedVariableRule,
  eventMissingRule,
  shortAddressRule,
  assertVsRequireRule,

  // Info/Gas Optimization
  storagePackingRule,
  publicToExternalRule
];

export { VulnerabilityRule, Severity };
