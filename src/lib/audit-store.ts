import { AuditResult } from './audit-engine/types';

// In-memory store for audit results (will be replaced with DB)
const audits = new Map<string, AuditResult>();

export function saveAudit(id: string, result: AuditResult): void {
  audits.set(id, result);
}

export function getAudit(id: string): AuditResult | undefined {
  return audits.get(id);
}

export function listAuditsByAgency(agencyId: string): AuditResult[] {
  return Array.from(audits.values()).filter(
    (a) => a.agencyId === agencyId
  );
}

export function listAuditsByClient(clientId: string): AuditResult[] {
  return Array.from(audits.values()).filter(
    (a) => a.clientId === clientId
  );
}

export function deleteAudit(id: string): boolean {
  return audits.delete(id);
}

// For future: migrate to DB
// export async function saveAuditToDb(result: AuditResult): Promise<void> {
//   await db.insert(audits).values({
//     id: result.id,
//     agency_id: result.agencyId,
//     client_id: result.clientId,
//     audit_type: 'WEBSITE',
//     data: JSON.stringify(result),
//     report_url: result.id,
//     created_at: result.timestamp,
//   });
// }