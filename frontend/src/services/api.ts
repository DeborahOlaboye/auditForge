import type { AuditReport } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_BASE || '/api';

export async function health(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function auditContract(code: string, contractName = 'Contract', enableAIAnalysis = false): Promise<AuditReport> {
  const res = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, contractName, options: { enableAIAnalysis } })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Audit failed');
  return data.report as AuditReport;
}
