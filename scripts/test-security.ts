/**
 * Comprehensive Security Test Suite for Phase 3A: Secure Content Ingestion
 * Covers Test Groups A through J matching exact specification requirements.
 */

import http from 'http';
import JSZip from 'jszip';
import {
  SecurityValidationService,
  FilenameValidator,
  FileSizeValidator,
  FileTypeValidator,
  FileSignatureValidator,
  ArchiveValidator,
  DocumentSecurityValidator,
  UrlSchemeValidator,
  IpRangeValidator,
  HostValidator,
  SsrfProtection,
  RedirectValidator,
  ContentHashService,
  DuplicateDetector,
} from '../lib/security';
import { prisma } from '../lib/db/prisma';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passedCount++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName}${detail ? ` - ${detail}` : ''}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('🛡️  PHASE 3A: SECURE CONTENT INGESTION TEST SUITE');
  console.log('============================================================\n');

  // -------------------------------------------------------------
  // Test Group A — Filename Attacks
  // -------------------------------------------------------------
  console.log('\x1b[36m[Group A] Filename Attacks\x1b[0m');

  const traversal1 = FilenameValidator.validate('../../etc/passwd');
  assert(
    !traversal1.valid && traversal1.findings.some((f) => f.code === 'FILENAME_PATH_TRAVERSAL'),
    'Path traversal with unix slashes (../../etc/passwd) rejected'
  );

  const traversal2 = FilenameValidator.validate('..\\..\\Windows\\System32\\cmd.exe');
  assert(
    !traversal2.valid && traversal2.findings.some((f) => f.code === 'FILENAME_PATH_TRAVERSAL'),
    'Path traversal with windows backslashes (..\\..\\Windows\\System32) rejected'
  );

  const nullByte1 = FilenameValidator.validate('file.pdf%00.exe');
  assert(
    !nullByte1.valid && nullByte1.findings.some((f) => f.code === 'FILENAME_NULL_BYTE'),
    'URL-encoded null byte injection (file.pdf%00.exe) rejected'
  );

  const nullByte2 = FilenameValidator.validate('document.pdf\0.exe');
  assert(
    !nullByte2.valid && nullByte2.findings.some((f) => f.code === 'FILENAME_NULL_BYTE'),
    'Raw null byte injection (document.pdf\\0.exe) rejected'
  );

  const doubleExt = FilenameValidator.validate('report.pdf.exe');
  assert(
    !doubleExt.valid && doubleExt.findings.some((f) => f.code === 'FILENAME_EXECUTABLE_DOUBLE_EXTENSION'),
    'Dangerous executable double extension (report.pdf.exe) rejected'
  );

  const reservedDevice = FilenameValidator.validate('CON.txt');
  assert(
    !reservedDevice.valid && reservedDevice.findings.some((f) => f.code === 'FILENAME_RESERVED_NAME'),
    'Windows reserved device name (CON.txt) rejected'
  );

  const excessiveLength = FilenameValidator.validate('A'.repeat(300) + '.pdf');
  assert(
    !excessiveLength.valid && excessiveLength.findings.some((f) => f.code === 'FILENAME_LENGTH_EXCEEDED'),
    'Excessive filename length (>255 chars) rejected'
  );

  // -------------------------------------------------------------
  // Test Group B — MIME Mismatch & Masquerading Executables
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group B] MIME Mismatch & Masquerading Executables\x1b[0m');

  // Disguised Windows PE Executable (MZ header) with .pdf name
  const fakePdfExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00');
  const fakePdfResult = await SecurityValidationService.validateUploadedFile(
    fakePdfExe,
    'annual_report.pdf',
    'application/pdf'
  );
  assert(!fakePdfResult.accepted, 'Executable disguised as PDF rejected');
  assert(
    fakePdfResult.scanResult.findings.some((f) => f.code === 'FILE_SIGNATURE_EXECUTABLE'),
    'Detected FILE_SIGNATURE_EXECUTABLE finding code'
  );

  // Disguised Linux ELF Executable with .png name
  const fakePngElf = Buffer.from('\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00');
  const fakePngResult = await SecurityValidationService.validateUploadedFile(
    fakePngElf,
    'photo.png',
    'image/png'
  );
  assert(!fakePngResult.accepted, 'ELF binary disguised as PNG rejected');

  // Declared MIME mismatch: .docx with application/x-msdownload
  const mismatchResult = FileTypeValidator.validate('doc.docx', 'application/x-msdownload');
  assert(
    !mismatchResult.valid && mismatchResult.findings.some((f) => f.code === 'FILE_DANGEROUS_MIME'),
    'Explicit executable declared MIME rejected'
  );

  // -------------------------------------------------------------
  // Test Group C — File Size Limits
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group C] File Size Limits\x1b[0m');

  // 30MB buffer for DOCUMENT (limit is 25MB)
  const oversizedDocBytes = 30 * 1024 * 1024;
  const sizeValidation = FileSizeValidator.validate(oversizedDocBytes, 'DOCUMENT');
  assert(!sizeValidation.valid, '30MB Document exceeds 25MB configured limit');
  assert(
    sizeValidation.findings.some((f) => f.code === 'FILE_SIZE_EXCEEDED'),
    'Emits FILE_SIZE_EXCEEDED finding with limit in message'
  );

  const emptyValidation = FileSizeValidator.validate(0, 'DOCUMENT');
  assert(!emptyValidation.valid, '0-byte empty file rejected');

  // -------------------------------------------------------------
  // Test Group D — Archive Bomb & Zip Slip Protection
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group D] Archive Bomb & Zip Slip Protection\x1b[0m');

  // Construct a ZIP with high compression ratio (sparse data)
  const zipBomb = new JSZip();
  // Add a huge repetitive text file that compresses to almost nothing
  zipBomb.file('massive.txt', '0'.repeat(15 * 1024 * 1024)); // 15MB uncompressed
  const zipBombBuffer = await zipBomb.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const bombResult = await ArchiveValidator.inspectZip(zipBombBuffer);
  // Uncompressed 15MB compresses down to ~15KB, ratio ~ 1000:1 (limit is 100)
  assert(
    bombResult.compressionRatio > 100,
    `High compression ratio computed: ${bombResult.compressionRatio}:1`
  );
  assert(!bombResult.valid, 'Archive with high compression ratio (>100:1) rejected');

  // Construct a ZIP with path traversal entry (Zip Slip)
  const zipSlip = new JSZip();
  zipSlip.file('../../etc/cron.d/malicious', 'evil script');
  const zipSlipBuffer = await zipSlip.generateAsync({ type: 'nodebuffer' });
  const zipSlipResult = await ArchiveValidator.inspectZip(zipSlipBuffer);
  assert(
    !zipSlipResult.valid && zipSlipResult.findings.some((f) => f.code === 'ARCHIVE_ZIP_SLIP_ATTEMPT'),
    'Zip Slip path traversal entry detected and rejected'
  );

  // -------------------------------------------------------------
  // Test Group E — Suspicious Documents (PDF Scripts, Macros)
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group E] Suspicious Documents (PDF JS, Office Macros)\x1b[0m');

  // PDF containing embedded JavaScript
  const maliciousPdf = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R /OpenAction << /S /JavaScript /JS (app.alert(1)) >> >>\nendobj\n%%EOF'
  );
  const pdfInspection = DocumentSecurityValidator.inspectPdf(maliciousPdf);
  assert(
    !pdfInspection.valid && pdfInspection.findings.some((f) => f.code === 'PDF_EMBEDDED_JAVASCRIPT'),
    'PDF with embedded /JavaScript detected and rejected'
  );

  // PDF containing Launch action
  const launchPdf = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Type /Action /S /Launch /F (cmd.exe) >>\nendobj\n%%EOF'
  );
  const launchInspection = DocumentSecurityValidator.inspectPdf(launchPdf);
  assert(
    !launchInspection.valid && launchInspection.findings.some((f) => f.code === 'PDF_LAUNCH_ACTION'),
    'PDF with /Launch action detected and rejected'
  );

  // DOCX containing VBA Macro
  const macroDocx = new JSZip();
  macroDocx.file('[Content_Types].xml', '<Types></Types>');
  macroDocx.file('word/document.xml', '<w:document></w:document>');
  macroDocx.file('word/vbaProject.bin', Buffer.from('VBA MACRO BINARY'));
  const macroBuffer = await macroDocx.generateAsync({ type: 'nodebuffer' });

  const docxInspection = await DocumentSecurityValidator.inspectOfficePackage(macroBuffer, 'docx');
  assert(
    !docxInspection.valid && docxInspection.findings.some((f) => f.code === 'OFFICE_MACROS_DETECTED'),
    'Macro-enabled Word document (vbaProject.bin) detected and rejected'
  );

  // -------------------------------------------------------------
  // Test Group F — SSRF Protection & Private IP Ranges
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group F] SSRF Protection & Private IP Blocking\x1b[0m');

  const ssrfUrls = [
    'http://localhost/admin',
    'http://127.0.0.1:3000/api',
    'http://127.0.0.2',
    'http://10.0.0.5/internal',
    'http://172.16.0.1/status',
    'http://192.168.1.1/router',
    'http://169.254.169.254/latest/meta-data/',
    'http://[::1]:8080',
    'http://0.0.0.0',
  ];

  for (const url of ssrfUrls) {
    const res = await SecurityValidationService.validateUrl(url);
    assert(!res.accepted, `Blocked SSRF target: ${url}`);
  }

  // Hostname encoding check (dword representation of 127.0.0.1 = 2130706433)
  const dwordCheck = HostValidator.validate('2130706433');
  assert(!dwordCheck.valid, 'Blocked decimal dword representation of 127.0.0.1');

  // -------------------------------------------------------------
  // Test Group G — Invalid URL Schemes
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group G] Invalid URL Schemes\x1b[0m');

  const invalidSchemes = [
    'file:///etc/passwd',
    'file://C:/Windows/win.ini',
    'ftp://example.com/file.txt',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'gopher://gopher.floodgap.com',
    'blob:http://example.com/uuid',
  ];

  for (const schemeUrl of invalidSchemes) {
    const res = UrlSchemeValidator.validate(schemeUrl);
    assert(!res.valid, `Rejected forbidden URL scheme: ${schemeUrl}`);
  }

  // -------------------------------------------------------------
  // Test Group H — Redirect Attacks (SSRF via Redirect)
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group H] Redirect Attacks (Redirect SSRF)\x1b[0m');

  // Spin up a transient local HTTP server to test redirect protection
  const redirectServer = http.createServer((req, res) => {
    if (req.url === '/redirect-to-localhost') {
      res.writeHead(302, { Location: 'http://127.0.0.1:9999/secret' });
      res.end();
    } else if (req.url === '/redirect-chain-1') {
      res.writeHead(302, { Location: '/redirect-chain-2' });
      res.end();
    } else if (req.url === '/redirect-chain-2') {
      res.writeHead(302, { Location: 'http://169.254.169.254/meta-data' });
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Safe content');
    }
  });

  await new Promise<void>((resolve) => redirectServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (redirectServer.address() as any).port;

  try {
    // Attempt fetching a redirect that leads to 127.0.0.1
    const redirectAttackUrl = `http://127.0.0.1:${port}/redirect-to-localhost`;
    const fetchRes = await RedirectValidator.safeFetch(redirectAttackUrl);
    assert(
      !fetchRes.ok,
      'Redirect targeting 127.0.0.1 caught and blocked by SSRF redirect validator'
    );
  } finally {
    redirectServer.close();
  }

  // -------------------------------------------------------------
  // Test Group I — SHA-256 Hashing & Duplicate Detection
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group I] SHA-256 Hashing & Duplicate Detection\x1b[0m');

  const testFileBytes = Buffer.from('Consistent test content for SHA-256 source verification');
  const hash1 = ContentHashService.hashBuffer(testFileBytes);
  const hash2 = ContentHashService.hashBuffer(testFileBytes);

  assert(hash1 === hash2, `Identical byte buffer produces identical SHA-256 (${hash1.slice(0, 16)}...)`);
  assert(hash1.length === 64, 'SHA-256 hash length is 64 hex characters');

  // Test Duplicate Detection with mock user & project
  const testUser1 = await prisma.user.upsert({
    where: { email: 'user1-test@omnicontent.ai' },
    update: {},
    create: {
      email: 'user1-test@omnicontent.ai',
      passwordHash: 'test-hash',
      name: 'User One',
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: 'user2-test@omnicontent.ai' },
    update: {},
    create: {
      email: 'user2-test@omnicontent.ai',
      passwordHash: 'test-hash',
      name: 'User Two',
    },
  });

  const mockProjectId1 = `project_test_${Date.now()}`;

  // Seed source with testUser1
  const seededProject = await prisma.project.create({
    data: {
      id: mockProjectId1,
      title: 'Security Ingestion Test Workspace',
      userId: testUser1.id,
    },
  });

  const seededSource = await prisma.source.create({
    data: {
      title: 'Original Source A',
      sourceType: 'TEXT',
      rawContent: 'Consistent test content for SHA-256 source verification',
      contentHash: hash1,
      securityStatus: 'PASSED',
      projectId: seededProject.id,
    },
  });

  // Check duplicate within same project
  const sameProjectDup = await DuplicateDetector.checkDuplicate({
    contentHash: hash1,
    userId: testUser1.id,
    projectId: mockProjectId1,
  });
  assert(
    sameProjectDup.isDuplicate && sameProjectDup.isSameProject,
    'Duplicate in same project identified correctly'
  );

  // Check duplicate from different user (privacy boundary test)
  const differentUserDup = await DuplicateDetector.checkDuplicate({
    contentHash: hash1,
    userId: testUser2.id,
    projectId: 'different_project',
  });
  assert(
    !differentUserDup.isDuplicate,
    'Privacy preserved: different user receives no duplicate leak'
  );

  // Clean up seeded test records
  await prisma.source.deleteMany({ where: { id: seededSource.id } });
  await prisma.project.deleteMany({ where: { id: seededProject.id } });

  // -------------------------------------------------------------
  // Test Group J — Valid Sources
  // -------------------------------------------------------------
  console.log('\n\x1b[36m[Group J] Valid Sources Pass Ingestion\x1b[0m');

  // 1. Valid PDF
  const validPdf = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n100\n%%EOF'
  );
  const validPdfResult = await SecurityValidationService.validateUploadedFile(
    validPdf,
    'valid_paper.pdf',
    'application/pdf'
  );
  assert(validPdfResult.accepted, 'Valid PDF passed security validation');
  assert(validPdfResult.scanResult.status === 'passed', 'Security status is PASSED');

  // 2. Valid PNG
  const validPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
    0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
    0x15, 0xc4, 0x89,
  ]);
  const validPngResult = await SecurityValidationService.validateUploadedFile(
    validPng,
    'chart.png',
    'image/png'
  );
  assert(validPngResult.accepted, 'Valid PNG passed security validation');

  // 3. Valid DOCX
  const validDocx = new JSZip();
  validDocx.file('[Content_Types].xml', '<Types></Types>');
  validDocx.file('word/document.xml', '<w:document></w:document>');
  const validDocxBuffer = await validDocx.generateAsync({ type: 'nodebuffer' });
  const validDocxResult = await SecurityValidationService.validateUploadedFile(
    validDocxBuffer,
    'document.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  assert(validDocxResult.accepted, 'Valid DOCX passed security validation');

  // 4. Valid PPTX
  const validPptx = new JSZip();
  validPptx.file('[Content_Types].xml', '<Types></Types>');
  validPptx.file('ppt/presentation.xml', '<p:presentation></p:presentation>');
  const validPptxBuffer = await validPptx.generateAsync({ type: 'nodebuffer' });
  const validPptxResult = await SecurityValidationService.validateUploadedFile(
    validPptxBuffer,
    'deck.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
  assert(validPptxResult.accepted, 'Valid PPTX passed security validation');

  // 5. Valid YouTube URL
  const ytUrlResult = await SecurityValidationService.validateUrl(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  assert(ytUrlResult.accepted, 'Valid YouTube URL passed URL security validation');

  // 6. Valid Public Web URL
  const webUrlResult = await SecurityValidationService.validateUrl('https://example.com');
  assert(webUrlResult.accepted, 'Valid Public Web URL passed URL security validation');

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
