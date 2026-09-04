export type SecuritySeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface SecurityFinding {
  code: string;
  severity: SecuritySeverity;
  message: string;
  details?: Record<string, unknown>;
}
