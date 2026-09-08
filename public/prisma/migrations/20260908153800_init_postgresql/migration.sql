-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT DEFAULT 'General',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "mimeType" TEXT,
    "rawContent" TEXT NOT NULL,
    "extractedContent" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'COMPLETED',
    "progressStep" TEXT,
    "errorMessage" TEXT,
    "metadata" TEXT,
    "contentHash" TEXT,
    "hashAlgorithm" TEXT DEFAULT 'SHA-256',
    "securityStatus" TEXT DEFAULT 'PASSED',
    "securityScanVersion" TEXT,
    "securityScannedAt" TIMESTAMP(3),
    "fileSize" INTEGER,
    "detectedMimeType" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityScan" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "status" TEXT NOT NULL,
    "contentHash" TEXT,
    "checksPerformed" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "scannerVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyFacts" TEXT NOT NULL,
    "targetAudience" TEXT,
    "keyEntities" TEXT,
    "topics" TEXT,
    "sentiment" TEXT DEFAULT 'Neutral',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentIntelligence" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT NOT NULL,
    "topics" TEXT NOT NULL,
    "keyFacts" TEXT NOT NULL,
    "claims" TEXT,
    "entities" TEXT,
    "dates" TEXT,
    "locations" TEXT,
    "organizations" TEXT,
    "statistics" TEXT,
    "quotations" TEXT,
    "importantStatements" TEXT,
    "timeline" TEXT,
    "targetAudience" TEXT,
    "sentiment" TEXT DEFAULT 'Neutral',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "contentIntelligenceId" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "language" TEXT DEFAULT 'en',
    "duration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "speaker" TEXT,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnalysis" (
    "id" TEXT NOT NULL,
    "contentIntelligenceId" TEXT NOT NULL,
    "duration" DOUBLE PRECISION,
    "thumbnailUrl" TEXT,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoAnalysisScene" (
    "id" TEXT NOT NULL,
    "videoAnalysisId" TEXT NOT NULL,
    "sceneNumber" INTEGER NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "visualDescription" TEXT NOT NULL,
    "onScreenText" TEXT,
    "cameraFraming" TEXT,
    "motion" TEXT,
    "audioDescription" TEXT,

    CONSTRAINT "VideoAnalysisScene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentationAnalysis" (
    "id" TEXT NOT NULL,
    "contentIntelligenceId" TEXT NOT NULL,
    "slideCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresentationAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentationAnalysisSlide" (
    "id" TEXT NOT NULL,
    "presentationAnalysisId" TEXT NOT NULL,
    "slideNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "bulletPoints" TEXT,
    "speakerNotes" TEXT,
    "layout" TEXT DEFAULT 'STANDARD',
    "visualPrompt" TEXT,

    CONSTRAINT "PresentationAnalysisSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceReference" (
    "id" TEXT NOT NULL,
    "contentIntelligenceId" TEXT NOT NULL,
    "factOrClaim" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "quote" TEXT,
    "speaker" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedContent" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "captions" TEXT,
    "hashtags" TEXT,
    "tone" TEXT,
    "audience" TEXT,
    "purpose" TEXT,
    "packageData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentFingerprint" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "simHash" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'SHA-256',
    "fingerprintVersion" TEXT NOT NULL DEFAULT '1',
    "contentType" TEXT NOT NULL,
    "canonicalBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentFingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvenanceRecord" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentFingerprint" TEXT NOT NULL,
    "parentFingerprint" TEXT,
    "simHash" TEXT,
    "creatorType" TEXT NOT NULL DEFAULT 'ai',
    "creatorId" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'SHA-256',
    "fingerprintVersion" TEXT NOT NULL DEFAULT '1',
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProvenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoOutputPackage" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT,
    "audience" TEXT,
    "objective" TEXT,
    "duration" TEXT,
    "tone" TEXT,
    "format" TEXT,
    "script" TEXT NOT NULL,
    "storyboard" TEXT NOT NULL,
    "narration" TEXT,
    "subtitles" TEXT,
    "visualRecs" TEXT,
    "musicRecs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoOutputPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentationOutputPackage" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "audience" TEXT,
    "objective" TEXT,
    "slideCount" INTEGER NOT NULL DEFAULT 6,
    "slides" TEXT NOT NULL,
    "structure" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresentationOutputPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfographicOutputPackage" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT,
    "takeaway" TEXT,
    "keyMessages" TEXT NOT NULL,
    "statistics" TEXT NOT NULL,
    "sections" TEXT NOT NULL,
    "layoutRecs" TEXT,
    "visualRecs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfographicOutputPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentVersion" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "changeSummary" TEXT,
    "parentContentId" TEXT,
    "parentFingerprint" TEXT,
    "fingerprint" TEXT,
    "simHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "defaultTone" TEXT DEFAULT 'Professional',
    "defaultAudience" TEXT DEFAULT 'General',
    "templatePrompt" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoProject" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 1920,
    "height" INTEGER NOT NULL DEFAULT 1080,
    "fps" INTEGER NOT NULL DEFAULT 30,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoScene" (
    "id" TEXT NOT NULL,
    "videoProjectId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "textOverlay" TEXT,
    "visualType" TEXT NOT NULL DEFAULT 'GRADIENT',
    "visualUrl" TEXT,
    "audioUrl" TEXT,
    "captionData" TEXT,
    "transition" TEXT DEFAULT 'FADE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoScene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationResult" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "factScore" INTEGER NOT NULL DEFAULT 95,
    "formatComplianceScore" INTEGER NOT NULL DEFAULT 98,
    "toneAlignmentScore" INTEGER NOT NULL DEFAULT 90,
    "issues" TEXT NOT NULL,
    "claimsChecked" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAnalysis_sourceId_key" ON "ContentAnalysis"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentIntelligence_sourceId_key" ON "ContentIntelligence"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_contentIntelligenceId_key" ON "Transcript"("contentIntelligenceId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoAnalysis_contentIntelligenceId_key" ON "VideoAnalysis"("contentIntelligenceId");

-- CreateIndex
CREATE UNIQUE INDEX "PresentationAnalysis_contentIntelligenceId_key" ON "PresentationAnalysis"("contentIntelligenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentFingerprint_contentId_key" ON "ContentFingerprint"("contentId");

-- CreateIndex
CREATE INDEX "ContentFingerprint_fingerprint_idx" ON "ContentFingerprint"("fingerprint");

-- CreateIndex
CREATE INDEX "ContentFingerprint_projectId_idx" ON "ContentFingerprint"("projectId");

-- CreateIndex
CREATE INDEX "ProvenanceRecord_contentFingerprint_idx" ON "ProvenanceRecord"("contentFingerprint");

-- CreateIndex
CREATE INDEX "ProvenanceRecord_parentFingerprint_idx" ON "ProvenanceRecord"("parentFingerprint");

-- CreateIndex
CREATE INDEX "ProvenanceRecord_contentId_idx" ON "ProvenanceRecord"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoOutputPackage_generationId_key" ON "VideoOutputPackage"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "PresentationOutputPackage_generationId_key" ON "PresentationOutputPackage"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "InfographicOutputPackage_generationId_key" ON "InfographicOutputPackage"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationResult_contentId_key" ON "ValidationResult"("contentId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityScan" ADD CONSTRAINT "SecurityScan_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentIntelligence" ADD CONSTRAINT "ContentIntelligence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_contentIntelligenceId_fkey" FOREIGN KEY ("contentIntelligenceId") REFERENCES "ContentIntelligence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnalysis" ADD CONSTRAINT "VideoAnalysis_contentIntelligenceId_fkey" FOREIGN KEY ("contentIntelligenceId") REFERENCES "ContentIntelligence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoAnalysisScene" ADD CONSTRAINT "VideoAnalysisScene_videoAnalysisId_fkey" FOREIGN KEY ("videoAnalysisId") REFERENCES "VideoAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentationAnalysis" ADD CONSTRAINT "PresentationAnalysis_contentIntelligenceId_fkey" FOREIGN KEY ("contentIntelligenceId") REFERENCES "ContentIntelligence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentationAnalysisSlide" ADD CONSTRAINT "PresentationAnalysisSlide_presentationAnalysisId_fkey" FOREIGN KEY ("presentationAnalysisId") REFERENCES "PresentationAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceReference" ADD CONSTRAINT "SourceReference_contentIntelligenceId_fkey" FOREIGN KEY ("contentIntelligenceId") REFERENCES "ContentIntelligence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedContent" ADD CONSTRAINT "GeneratedContent_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFingerprint" ADD CONSTRAINT "ContentFingerprint_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "GeneratedContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvenanceRecord" ADD CONSTRAINT "ProvenanceRecord_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "GeneratedContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoOutputPackage" ADD CONSTRAINT "VideoOutputPackage_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentationOutputPackage" ADD CONSTRAINT "PresentationOutputPackage_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfographicOutputPackage" ADD CONSTRAINT "InfographicOutputPackage_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "GeneratedContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoProject" ADD CONSTRAINT "VideoProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoScene" ADD CONSTRAINT "VideoScene_videoProjectId_fkey" FOREIGN KEY ("videoProjectId") REFERENCES "VideoProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationResult" ADD CONSTRAINT "ValidationResult_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "GeneratedContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
