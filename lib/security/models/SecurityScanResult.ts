import { SecurityFinding } from './SecurityFinding';

export type SecurityScanStatus = 'passed' | 'warning' | 'rejected';

export interface SecurityScanResult {
  status: SecurityScanStatus;
  checksPerformed: string[];
  findings: SecurityFinding[];
  contentHash?: string;
  hashAlgorithm?: string;
  scannerVersion: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
