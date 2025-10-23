/**
 * EM-01: Missing Event Emission
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const eventMissingRule: VulnerabilityRule = {
  id: 'EM-01',
  name: 'Missing Event Emission',
  severity: Severity.LOW,
  description: 'State-changing functions should emit events',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const func of metadata.functions) {
      // Check if function modifies state
      const modifiesState = func.stateMutability !== 'view' && func.stateMutability !== 'pure';

      if (modifiesState && !func.name.startsWith('_')) {
        vulnerabilities.push({
          id: 'EM-01',
          name: 'Missing Event Emission',
          severity: Severity.LOW,
          description: `Function "${func.name}" modifies state but may not emit events`,
          location: func.location,
          technicalExplanation: 'Functions that modify state should emit events for off-chain tracking and transparency.',
          exploitScenario: 'State changes without events make it difficult to track contract behavior and audit trails.',
          recommendation: 'Add event emission for all significant state changes.',
          codeSnippet: `event ${func.name.charAt(0).toUpperCase() + func.name.slice(1)}(...);`,
          references: ['Best Practice'],
          confidence: 0.50
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Emit events for all state changes',
  references: ['Best Practice']
};
