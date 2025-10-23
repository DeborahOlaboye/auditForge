/**
 * DC-01: Delegatecall to Untrusted Address
 */

import { VulnerabilityRule, Severity, Vulnerability, ContractMetadata } from '../../types';

export const delegatecallRule: VulnerabilityRule = {
  id: 'DC-01',
  name: 'Delegatecall to Untrusted Address',
  severity: Severity.CRITICAL,
  description: 'Delegatecall to user-controlled addresses can lead to complete contract takeover',
  pattern: (ast: any, metadata: ContractMetadata): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];

    for (const call of metadata.externalCalls) {
      if (call.type === 'delegatecall') {
        vulnerabilities.push({
          id: 'DC-01',
          name: 'Delegatecall to Untrusted Address',
          severity: Severity.CRITICAL,
          description: 'Delegatecall usage detected - verify target address is trusted',
          location: call.location,
          technicalExplanation: 'Delegatecall executes code from another contract in the context of the calling contract, preserving msg.sender and storage. If the target is malicious or user-controlled, it can completely take over the contract.',
          exploitScenario: 'An attacker provides a malicious contract address that, when called via delegatecall, overwrites critical storage slots like the owner address, draining funds or destroying the contract.',
          recommendation: 'Only use delegatecall with trusted, whitelisted contract addresses. Implement strict access controls and validate target addresses.',
          codeSnippet: `// Vulnerable:\nfunction execute(address target, bytes memory data) public {\n  target.delegatecall(data); // target is user-controlled!\n}\n\n// Fixed:\nmapping(address => bool) public trustedTargets;\n\nfunction execute(address target, bytes memory data) public onlyOwner {\n  require(trustedTargets[target], "Untrusted target");\n  target.delegatecall(data);\n}`,
          references: [
            'SWC-112: Delegatecall to Untrusted Callee',
            'Parity Wallet Hack (2017)'
          ],
          confidence: 0.90
        });
      }
    }

    return vulnerabilities;
  },
  recommendation: 'Whitelist approved contracts and restrict delegatecall usage',
  references: ['SWC-112']
};
