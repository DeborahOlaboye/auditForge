/**
 * Test audit workflow
 */

const { SmartContractAuditorAgent } = require('./dist/agents/SmartContractAuditorAgent');
const fs = require('fs');

async function testAudit() {
  console.log('🔍 Testing Smart Contract Auditor\n');

  // Read test contract
  const vulnerableContract = fs.readFileSync(
    './tests/contracts/vulnerable-reentrancy.sol',
    'utf-8'
  );

  // Initialize auditor
  const auditor = new SmartContractAuditorAgent();

  try {
    console.log('⏳ Running audit (AI analysis disabled for test)...\n');

    const report = await auditor.auditContract(
      vulnerableContract,
      'VulnerableBank',
      {
        enableAIAnalysis: false // Disable AI for quick test
      }
    );

    console.log('✅ Audit Complete!\n');
    console.log('═'.repeat(60));
    console.log('📊 AUDIT RESULTS');
    console.log('═'.repeat(60));
    console.log(`\nContract: ${report.contractName}`);
    console.log(`Risk Score: ${report.executiveSummary.overallRiskScore}/10`);
    console.log(`Recommendation: ${report.executiveSummary.deploymentRecommendation}`);

    console.log('\n🔴 Vulnerabilities:');
    console.log(`  Critical: ${report.executiveSummary.criticalCount}`);
    console.log(`  High: ${report.executiveSummary.highCount}`);
    console.log(`  Medium: ${report.executiveSummary.mediumCount}`);
    console.log(`  Low: ${report.executiveSummary.lowCount}`);
    console.log(`  Info: ${report.executiveSummary.infoCount}`);
    console.log(`  Total: ${report.executiveSummary.totalVulnerabilities}`);

    if (report.vulnerabilities.length > 0) {
      console.log('\n📋 Detailed Findings:\n');
      report.vulnerabilities.forEach((vuln, index) => {
        console.log(`${index + 1}. [${vuln.severity}] ${vuln.name} (${vuln.id})`);
        console.log(`   Location: Line ${vuln.location.line}`);
        console.log(`   ${vuln.description}`);
        console.log('');
      });
    }

    // Test export
    console.log('📄 Testing export formats...\n');

    const markdown = await auditor.exportMarkdown(report);
    fs.writeFileSync('./test-report.md', markdown);
    console.log('✅ Markdown report saved to: test-report.md');

    const json = await auditor.exportJSON(report);
    fs.writeFileSync('./test-report.json', json);
    console.log('✅ JSON report saved to: test-report.json');

    console.log('\n' + '═'.repeat(60));
    console.log('✨ Test completed successfully!');
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testAudit();
