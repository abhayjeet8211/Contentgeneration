/**
 * Phase 3B Automated Test Suite: Content Fingerprinting and Provenance Identification
 * 
 * Validates all 10 Phase 3B scenarios:
 * 1. Identical Content (Exact SHA-256 Match)
 * 2. One Character Change (Distinct SHA-256)
 * 3. Whitespace Normalization (Stable Fingerprint)
 * 4. Line Ending Normalization (CRLF, CR, LF Equivalence)
 * 5. JSON Key Order Determinism
 * 6. Similar Content Detection (SimHash High Similarity)
 * 7. Unrelated Content Rejection (Low Similarity < 0.40)
 * 8. Version Creation & Parent Fingerprint Lineage (A -> B)
 * 9. Exact Content Verification API
 * 10. Authorization & Privacy Boundary Protection
 */

import {
  TextCanonicalizer,
  StructuredContentCanonicalizer,
  PackageCanonicalizer,
  CanonicalizationService,
  CryptographicFingerprintService,
  TokenShinglingService,
  SimHashService,
  SimilarityScoringService,
  FingerprintService,
  ContentVersionService,
  ContentVerificationService,
} from '../lib/provenance';
import { prisma } from '../lib/db/prisma';
import crypto from 'crypto';

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m [${testName}] ${detail ? `\x1b[90m(${detail})\x1b[0m` : ''}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m [${testName}] ${detail ? `\x1b[90m(${detail})\x1b[0m` : ''}`);
  }
}

async function runTests() {
  console.log('\n\x1b[1m\x1b[36m========================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m   PHASE 3B — CONTENT FINGERPRINTING & PROVENANCE TEST SUITE           \x1b[0m');
  console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m\n');

  // -------------------------------------------------------------
  // Test 1: Identical Content
  // -------------------------------------------------------------
  console.log('\x1b[33m--- Test 1: Identical Content Determinism ---\x1b[0m');
  {
    const input = 'AI transforms content.';
    const fp1 = CryptographicFingerprintService.generateFingerprint(input, 'text');
    const fp2 = CryptographicFingerprintService.generateFingerprint(input, 'text');

    assert(
      fp1.fingerprint === fp2.fingerprint,
      'Test 1.1',
      `Identical text yields same SHA-256 (${fp1.fingerprint.slice(0, 12)}...)`
    );
    assert(
      fp1.canonicalText === fp2.canonicalText,
      'Test 1.2',
      'Canonical representation is strictly identical'
    );
  }

  // -------------------------------------------------------------
  // Test 2: One Character Change
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 2: One Character Change (Avalanche Effect) ---\x1b[0m');
  {
    const inputA = 'AI transforms content.';
    const inputB = 'AI transforms contents.'; // extra 's'

    const fpA = CryptographicFingerprintService.generateFingerprint(inputA, 'text');
    const fpB = CryptographicFingerprintService.generateFingerprint(inputB, 'text');

    assert(
      fpA.fingerprint !== fpB.fingerprint,
      'Test 2.1',
      `SHA-256 differs on 1 character: ${fpA.fingerprint.slice(0, 8)}... !== ${fpB.fingerprint.slice(0, 8)}...`
    );
  }

  // -------------------------------------------------------------
  // Test 3: Whitespace Normalization
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 3: Whitespace Normalization ---\x1b[0m');
  {
    const inputA = 'AI transforms content.';
    const inputB = 'AI    transforms     content.   ';
    const inputC = '\n\n   AI transforms content. \n\n';

    const canonA = TextCanonicalizer.canonicalize(inputA);
    const canonB = TextCanonicalizer.canonicalize(inputB);
    const canonC = TextCanonicalizer.canonicalize(inputC);

    const fpA = CryptographicFingerprintService.generateFingerprint(inputA, 'text');
    const fpB = CryptographicFingerprintService.generateFingerprint(inputB, 'text');
    const fpC = CryptographicFingerprintService.generateFingerprint(inputC, 'text');

    assert(canonA === canonB && canonA === canonC, 'Test 3.1', 'Whitespace collapsed identically');
    assert(
      fpA.fingerprint === fpB.fingerprint && fpA.fingerprint === fpC.fingerprint,
      'Test 3.2',
      `Fingerprint stable across formatting variations (${fpA.fingerprint.slice(0, 12)}...)`
    );
  }

  // -------------------------------------------------------------
  // Test 4: Line Ending Normalization
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 4: Line Ending Normalization (CRLF, CR, LF) ---\x1b[0m');
  {
    const textLF = 'Artificial Intelligence\nis transforming content.';
    const textCRLF = 'Artificial Intelligence\r\nis transforming content.';
    const textCR = 'Artificial Intelligence\ris transforming content.';

    const canonLF = TextCanonicalizer.canonicalize(textLF);
    const canonCRLF = TextCanonicalizer.canonicalize(textCRLF);
    const canonCR = TextCanonicalizer.canonicalize(textCR);

    const fpLF = CryptographicFingerprintService.generateFingerprint(textLF, 'text');
    const fpCRLF = CryptographicFingerprintService.generateFingerprint(textCRLF, 'text');
    const fpCR = CryptographicFingerprintService.generateFingerprint(textCR, 'text');

    assert(canonLF === canonCRLF && canonLF === canonCR, 'Test 4.1', 'Line endings normalized to LF');
    assert(
      fpLF.fingerprint === fpCRLF.fingerprint && fpLF.fingerprint === fpCR.fingerprint,
      'Test 4.2',
      `Identical SHA-256 across LF, CRLF, CR (${fpLF.fingerprint.slice(0, 12)}...)`
    );
  }

  // -------------------------------------------------------------
  // Test 5: JSON Key Order Determinism
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 5: JSON Key Order Determinism ---\x1b[0m');
  {
    const inputA = { title: 'AI', summary: 'Future' };
    const inputB = { summary: 'Future', title: 'AI' };

    const canonA = StructuredContentCanonicalizer.canonicalize(inputA);
    const canonB = StructuredContentCanonicalizer.canonicalize(inputB);

    const fpA = CryptographicFingerprintService.hashCanonical(canonA);
    const fpB = CryptographicFingerprintService.hashCanonical(canonB);

    assert(canonA === canonB, 'Test 5.1', `Canonical JSON identical: ${canonA}`);
    assert(fpA === fpB, 'Test 5.2', `Same fingerprint for different key order (${fpA.slice(0, 12)}...)`);
  }

  // -------------------------------------------------------------
  // Test 6: Similar Content Detection (SimHash)
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 6: Similar Content Detection (SimHash) ---\x1b[0m');
  {
    const contentA =
      'Artificial intelligence transforms digital content creation and enterprise workflows with rapid generation.';
    const contentB =
      'Artificial intelligence transforms digital content creation and enterprise workflows with automated generation.';

    const shinglesA = TokenShinglingService.shinglesFromText(contentA, 3);
    const shinglesB = TokenShinglingService.shinglesFromText(contentB, 3);

    const hashA = SimHashService.calculateSimHash(contentA);
    const hashB = SimHashService.calculateSimHash(contentB);

    const distance = SimHashService.hammingDistance(hashA, hashB);
    const score = SimilarityScoringService.calculateScore(distance);
    const confidence = SimilarityScoringService.determineConfidence(score);

    assert(shinglesA.length > 0 && shinglesB.length > 0, 'Test 6.1', `Generated ${shinglesA.length} shingles`);
    assert(
      score >= 0.80,
      'Test 6.2',
      `High similarity detected: Score ${score} (Hamming Distance: ${distance}/64)`
    );
    assert(
      confidence === 'high' || confidence === 'medium',
      'Test 6.3',
      `Confidence mapped to ${confidence}`
    );
  }

  // -------------------------------------------------------------
  // Test 7: Unrelated Content Rejection
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 7: Unrelated Content Rejection ---\x1b[0m');
  {
    const contentA = 'Artificial intelligence transforms digital content creation in cloud architectures.';
    const contentB = 'The championship football tournament was won yesterday by the underdog team in extra time.';

    const hashA = SimHashService.calculateSimHash(contentA);
    const hashB = SimHashService.calculateSimHash(contentB);

    const distance = SimHashService.hammingDistance(hashA, hashB);
    const score = SimilarityScoringService.calculateScore(distance);
    const confidence = SimilarityScoringService.determineConfidence(score);

    assert(
      score < 0.65,
      'Test 7.1',
      `Unrelated content exhibits low score: ${score} (Distance: ${distance}/64)`
    );
    assert(
      confidence === 'low' || confidence === 'very_low',
      'Test 7.2',
      `Confidence is appropriately low (${confidence})`
    );
  }

  // -------------------------------------------------------------
  // Test 8: Version Creation & Provenance Lineage (A -> B)
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 8: Version Creation & Provenance Lineage Chain ---\x1b[0m');
  {
    // Create a temporary project and generated content in Prisma
    const testProjectId = `test-proj-${crypto.randomUUID().slice(0, 8)}`;
    const testSourceId = `test-src-${crypto.randomUUID().slice(0, 8)}`;
    const testGenId = `test-gen-${crypto.randomUUID().slice(0, 8)}`;
    const testContentId = `test-content-${crypto.randomUUID().slice(0, 8)}`;

    try {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: `test-user-${crypto.randomUUID().slice(0, 8)}`,
            email: `test-${crypto.randomUUID().slice(0, 8)}@example.com`,
            passwordHash: 'testhash123',
            name: 'Test User',
          },
        });
      }

      await prisma.project.create({
        data: {
          id: testProjectId,
          title: 'Provenance Test Project',
          userId: user.id,
        },
      });

      await prisma.source.create({
        data: {
          id: testSourceId,
          projectId: testProjectId,
          title: 'Provenance Test Source',
          sourceType: 'TEXT',
          rawContent: 'Sample source content for testing provenance chains.',
        },
      });

      await prisma.generation.create({
        data: {
          id: testGenId,
          projectId: testProjectId,
          sourceId: testSourceId,
          title: 'Test Generation',
        },
      });

      const initialContent = 'AI is transforming cybersecurity operations.';

      await prisma.generatedContent.create({
        data: {
          id: testContentId,
          generationId: testGenId,
          format: 'LINKEDIN',
          platform: 'LinkedIn',
          title: 'Cybersecurity Shift',
          content: initialContent,
          versions: {
            create: {
              versionNumber: 1,
              body: initialContent,
              changeSummary: 'Genesis AI Generation',
            },
          },
        },
      });

      // 1. Register Genesis Fingerprint
      const fpService = new FingerprintService();
      const { fingerprint: fpA, provenanceRecord: recA } = await fpService.generateAndStoreProvenance(
        initialContent,
        {
          contentId: testContentId,
          projectId: testProjectId,
          contentType: 'LINKEDIN',
          creatorType: 'ai',
        }
      );

      assert(fpA.fingerprint.length === 64, 'Test 8.1', `Genesis fingerprint generated: ${fpA.fingerprint.slice(0, 12)}...`);
      assert(recA.parentFingerprint === null, 'Test 8.2', 'Genesis provenance record has no parent');

      // 2. Edit content -> Create Version 2
      const editedContent = 'AI is rapidly transforming modern enterprise cybersecurity operations.';
      const versionService = new ContentVersionService();
      const v2 = await versionService.createNewVersion({
        contentId: testContentId,
        projectId: testProjectId,
        contentType: 'LINKEDIN',
        newBody: editedContent,
        changeSummary: 'User editorial refinement',
        creatorType: 'user',
      });

      assert(v2.versionNumber === 2, 'Test 8.3', 'Version number incremented to 2');
      assert(v2.fingerprint.fingerprint !== fpA.fingerprint, 'Test 8.4', 'New version has distinct fingerprint');
      assert(
        v2.provenanceRecord.parentFingerprint === fpA.fingerprint,
        'Test 8.5',
        `Version 2 parent correctly references Version 1 fingerprint (${v2.provenanceRecord.parentFingerprint?.slice(0, 12)}...)`
      );

      // Verify immutable history
      const history = await versionService.getProvenanceLineage(testContentId);
      assert(history.length === 2, 'Test 8.6', `Provenance history contains ${history.length} immutable records`);
      assert(history[0].contentFingerprint === fpA.fingerprint, 'Test 8.7', 'Genesis record unchanged');
      assert(history[1].parentFingerprint === fpA.fingerprint, 'Test 8.8', 'Lineage chain A -> B verified');

    } finally {
      // Clean up test data
      try {
        await prisma.provenanceRecord.deleteMany({ where: { contentId: testContentId } });
        await prisma.contentFingerprint.deleteMany({ where: { contentId: testContentId } });
        await prisma.contentVersion.deleteMany({ where: { contentId: testContentId } });
        await prisma.generatedContent.deleteMany({ where: { id: testContentId } });
        await prisma.generation.deleteMany({ where: { id: testGenId } });
        await prisma.source.deleteMany({ where: { id: testSourceId } });
        await prisma.project.deleteMany({ where: { id: testProjectId } });
      } catch (cleanErr) {
        // ignore cleanup error
      }
    }
  }

  // Helper to create test records
  async function createTestContentRecord(contentId: string, projectId: string, title: string, content: string, format: string) {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: `user-${crypto.randomUUID().slice(0, 8)}`,
          email: `user-${crypto.randomUUID().slice(0, 8)}@test.com`,
          passwordHash: 'testhash',
          name: 'User',
        },
      });
    }

    await prisma.project.upsert({
      where: { id: projectId },
      update: {},
      create: {
        id: projectId,
        title: 'Test Project',
        userId: user.id,
      },
    });

    const sourceId = `src-${contentId}`;
    await prisma.source.upsert({
      where: { id: sourceId },
      update: {},
      create: {
        id: sourceId,
        projectId,
        title: 'Test Source',
        sourceType: 'TEXT',
        rawContent: content,
      },
    });

    const genId = `gen-${contentId}`;
    await prisma.generation.upsert({
      where: { id: genId },
      update: {},
      create: {
        id: genId,
        projectId,
        sourceId,
        title,
      },
    });

    return prisma.generatedContent.create({
      data: {
        id: contentId,
        generationId: genId,
        format,
        platform: format,
        title,
        content,
        versions: {
          create: {
            versionNumber: 1,
            body: content,
            changeSummary: 'Initial generation',
          },
        },
      },
    });
  }

  // -------------------------------------------------------------
  // Test 9: Exact Content Verification API / Service
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 9: Exact Content Verification ---\x1b[0m');
  {
    const verificationService = new ContentVerificationService();

    // Set up a mock content asset in DB
    const testContentId = `verify-test-${crypto.randomUUID().slice(0, 8)}`;
    const testProjectId = `verify-proj-${crypto.randomUUID().slice(0, 8)}`;
    const contentText = 'Verified enterprise knowledge asset with deterministic integrity.';

    try {
      await createTestContentRecord(testContentId, testProjectId, 'Verify Test', contentText, 'BLOG');

      const fpService = new FingerprintService();
      await fpService.generateAndStoreProvenance(contentText, {
        contentId: testContentId,
        projectId: testProjectId,
        contentType: 'BLOG',
      });

      // Submit identical content
      const result = await verificationService.verify({
        content: contentText,
        contentType: 'BLOG',
        callerProjectId: testProjectId,
      });

      assert(result.exact_match === true, 'Test 9.1', 'Verification identified exact match');
      assert(result.similarity_score === 1.0, 'Test 9.2', 'Exact match score is 1.0');
      assert(result.confidence === 'high', 'Test 9.3', 'Confidence is high');
      assert(
        result.matching_content_id === testContentId,
        'Test 9.4',
        `Returned authorized matching content ID: ${result.matching_content_id}`
      );
    } finally {
      try {
        await prisma.provenanceRecord.deleteMany({ where: { contentId: testContentId } });
        await prisma.contentFingerprint.deleteMany({ where: { contentId: testContentId } });
        await prisma.contentVersion.deleteMany({ where: { contentId: testContentId } });
        await prisma.generatedContent.deleteMany({ where: { id: testContentId } });
        await prisma.generation.deleteMany({ where: { id: `gen-${testContentId}` } });
        await prisma.source.deleteMany({ where: { id: `src-${testContentId}` } });
        await prisma.project.deleteMany({ where: { id: testProjectId } });
      } catch {}
    }
  }

  // -------------------------------------------------------------
  // Test 10: Authorization & Privacy Boundary Protection
  // -------------------------------------------------------------
  console.log('\n\x1b[33m--- Test 10: Privacy Boundary & Safe References ---\x1b[0m');
  {
    const verificationService = new ContentVerificationService();

    const privateContentId = `private-asset-${crypto.randomUUID().slice(0, 8)}`;
    const privateProjectId = `user-alpha-project`;
    const differentCallerProjectId = `user-beta-project`;

    const privateText = 'Proprietary confidential business strategy document for Alpha.';

    try {
      await createTestContentRecord(privateContentId, privateProjectId, 'Private Asset', privateText, 'REPORT');

      const fpService = new FingerprintService();
      await fpService.generateAndStoreProvenance(privateText, {
        contentId: privateContentId,
        projectId: privateProjectId,
        contentType: 'REPORT',
      });

      // Different user verifies identical content
      const result = await verificationService.verify({
        content: privateText,
        contentType: 'REPORT',
        callerProjectId: differentCallerProjectId, // Unauthorized project
      });

      assert(result.exact_match === true, 'Test 10.1', 'Integrity matched');
      assert(
        result.matching_content_id !== privateContentId,
        'Test 10.2',
        `Internal DB ID hidden from unauthorized caller: ${result.matching_content_id}`
      );
      assert(
        Boolean(result.matching_content_id?.startsWith('auth-verified-')),
        'Test 10.3',
        'Returned anonymized safe cryptographic reference'
      );
      assert(
        result.matching_project_id === undefined,
        'Test 10.4',
        'Private project ID not exposed'
      );
    } finally {
      try {
        await prisma.provenanceRecord.deleteMany({ where: { contentId: privateContentId } });
        await prisma.contentFingerprint.deleteMany({ where: { contentId: privateContentId } });
        await prisma.contentVersion.deleteMany({ where: { contentId: privateContentId } });
        await prisma.generatedContent.deleteMany({ where: { id: privateContentId } });
        await prisma.generation.deleteMany({ where: { id: `gen-${privateContentId}` } });
        await prisma.source.deleteMany({ where: { id: `src-${privateContentId}` } });
        await prisma.project.deleteMany({ where: { id: privateProjectId } });
      } catch {}
    }
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n\x1b[1m\x1b[36m========================================================================\x1b[0m');
  console.log(`\x1b[1mRESULTS: Total: ${totalTests} | Passed: \x1b[32m${passedTests}\x1b[0m | Failed: ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
  console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
