/**
 * Quick Start Example
 * Demonstrates basic usage of the Smart Contract Security Auditor
 */

import { SmartContractAuditorAgent } from '../src/agents/SmartContractAuditorAgent';

// Sample vulnerable contract
const vulnerableContract = `
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: Reentrancy attack
    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");

        // External call BEFORE state update
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0; // Too late!
    }

    // VULNERABLE: Missing access control
    function emergencyWithdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}
`;

async function main() {
  console.log('🔍 Smart Contract Security Auditor - Quick Start Example\n');

  // Initialize the auditor agent
  const auditor = new SmartContractAuditorAgent();

  try {
    // Perform audit
    console.log('⏳ Analyzing contract...\n');

    const report = await auditor.auditContract(
      vulnerableContract,
      'VulnerableBank',
      {
        enableAIAnalysis: true // Enable AI-powered deep analysis
      }
    );

    // Display results
    console.log('📊 Audit Results\n');
    console.log('═'.repeat(50));

    // Executive Summary
    console.log('\n📋 Executive Summary');
    console.log(`   Contract: ${report.contractName}`);
    console.log(`   Risk Score: ${report.executiveSummary.overallRiskScore}/10`);
    console.log(
      `   Recommendation: ${report.executiveSummary.deploymentRecommendation}`
    );

    // Vulnerability Counts
    console.log('\n🔴 Vulnerabilities Found:');
    console.log(`   Critical: ${report.executiveSummary.criticalCount}`);
    console.log(`   High: ${report.executiveSummary.highCount}`);
    console.log(`   Medium: ${report.executiveSummary.mediumCount}`);
    console.log(`   Low: ${report.executiveSummary.lowCount}`);
    console.log(`   Info: ${report.executiveSummary.infoCount}`);

    // Top Concerns
    if (report.executiveSummary.topConcerns.length > 0) {
      console.log('\n⚠️  Top Concerns:');
      report.executiveSummary.topConcerns.forEach((concern, i) => {
        console.log(`   ${i + 1}. ${concern}`);
      });
    }

    // Detailed Findings
    console.log('\n🔎 Detailed Findings:\n');
    report.vulnerabilities.forEach((vuln, index) => {
      console.log(`${index + 1}. [${vuln.severity}] ${vuln.name} (${vuln.id})`);
      console.log(`   Location: Line ${vuln.location.line}`);
      console.log(`   ${vuln.description}`);
      console.log(`   Recommendation: ${vuln.recommendation}`);
      console.log('');
    });

    // Export Report
    console.log('\n📄 Exporting Report...\n');

    const markdown = await auditor.exportMarkdown(report);
    console.log('✅ Markdown report generated');
    console.log(`   Preview (first 500 chars):\n`);
    console.log(markdown.substring(0, 500) + '...\n');

    const json = await auditor.exportJSON(report);
    console.log('✅ JSON report generated');
    console.log(`   Size: ${json.length} bytes\n`);

    // Summary
    console.log('═'.repeat(50));
    console.log('\n✨ Audit Complete!');
    console.log(`   Analysis Time: ${report.metadata.analysisTime}ms`);
    console.log(
      `   Total Issues: ${report.executiveSummary.totalVulnerabilities}`
    );

    if (report.executiveSummary.deploymentRecommendation === 'DO_NOT_DEPLOY') {
      console.log('\n🚫 DO NOT DEPLOY - Critical vulnerabilities found!');
    } else if (
      report.executiveSummary.deploymentRecommendation === 'REVIEW'
    ) {
      console.log('\n⚠️  REVIEW REQUIRED - Address issues before deployment');
    } else {
      console.log('\n✅ Contract appears safe for deployment');
    }

    console.log('\n');
  } catch (error: any) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main };
