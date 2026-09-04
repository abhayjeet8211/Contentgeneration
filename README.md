# OmniContent AI — Gen AI Content Intelligence & Multimodal Transformation Platform

OmniContent AI is an enterprise-grade **Gen AI Content Intelligence and Multimodal Content Transformation Platform**. It accepts information in any form—research papers, policy advisories, news articles, PDFs, Word documents, PowerPoint presentations, audio files, video recordings, YouTube URLs, podcast RSS feeds, or web articles—extracts deep structured knowledge into a single persistent Content Intelligence representation, and transforms it into multiple platform-adapted communication artifacts simultaneously.

---

## 🌟 Core Architecture Philosophy

**ONE SOURCE → ONE STRUCTURED CONTENT INTELLIGENCE → MULTIPLE CONSISTENT OUTPUTS**

```text
                                  MULTIMODAL INPUT SOURCES
 [ Text / Prompt ] [ Documents: PDF, DOCX, TXT ] [ Presentations: PPT, PPTX ] [ Audio / Video Upload ] [ URLs: YouTube, Podcasts RSS/Audio, Web Articles ]
                                             │
                                             ▼
                                 SECURE INGESTION GATEWAY
   • Filename & Traversal Defense (Null bytes, Windows device names, double extension checks)
   • Strict Category Size Limits (25MB docs, 10MB images, 100MB audio, 500MB video upfront rejection)
   • Magic Byte & MIME Validation (Detects disguised PE/ELF/Mach-O binaries across all formats)
   • Document & Archive Exploit Protection (Zip bomb 100:1 ratio, Zip Slip, PDF JS, Office VBA macros)
   • URL Scheme & SSRF Defense (HTTP/HTTPS only, loopback/private/metadata IP blocking, DNS resolution)
   • Manual Redirect Tracking (Up to 5 hops with SSRF re-validation on every redirect target)
   • Cryptographic SHA-256 Source Hashing & Privacy-Preserving Duplicate Detection
                                             │
                              ┌──────────────┴──────────────┐
                              ▼                             ▼
                         [REJECTED]                    [ACCEPTED]
                       Structured 400                       │
                                                            ▼
                                                NORMALIZATION & PARSING
   • YouTube Provider (Gemini Video & Timestamps)
   • Audio Pipeline (Gemini Audio, Speaker Diarization, Timestamps, RSS Feed Episode Extractor)
   • Video Pipeline (Gemini Multimodal Understanding, Scene Analysis, On-Screen Text)
   • PPT/PPTX Extractor (Slide-by-slide structure, speaker notes, bullet points)
   • Document & Web Extractor (Clean text, metadata, SSRF-safe URL parsing)
                                             │
                                             ▼
                            STRUCTURED CONTENT INTELLIGENCE
  • Executive Summary, Topics, Claims, Key Facts (with source citations)
  • Entities, Dates, Locations, Organizations, Key Statistics (with source traceability)
  • Full Timed Transcript & Speaker Segments
  • Video Scenes & Visual Elements
  • Extracted Presentation Slides
                                            │
                                            ▼
                        PERSISTENCE & SOURCE TRACEABILITY
  • Source (status tracking: UPLOADED -> VALIDATING -> PROCESSING -> ANALYZING -> COMPLETED)
  • Relational Schema: ContentIntelligence, Transcript, TranscriptSegment, VideoScene, Slide
  • Traceability Links: Timestamps (00:14:32), Page Numbers (p. 17), Slide Numbers (#3)
                                            │
                                            ▼
                 PARALLEL MULTI-OUTPUT GENERATORS (ISOLATED RETRIES)
    ┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
    │     VIDEO PACKAGE    │ PRESENTATION PACKAGE │ INFOGRAPHIC PACKAGE  │    SOCIAL & COMMS    │
    ├──────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
    │ • Video Concept      │ • Deck Metadata      │ • Headline & Message │ • LinkedIn Posts     │
    │ • Full Script        │ • Slide Content      │ • Key Insights       │ • Twitter/X Threads  │
    │ • Visual Storyboard  │ • Speaker Notes      │ • Traceable Stats    │ • Instagram Captions │
    │ • Scene Breakdown    │ • Layout Recs        │ • Section Hierarchy  │ • Blog Articles      │
    │ • Timed Subtitles    │ • Visual Prompts     │ • Visual & Icon Recs │ • Executive Briefing │
    │ • Audio/Music Recs   │ • PPTX / PDF Export  │ • SVG/PNG/PDF Export │ • Email Newsletters  │
    └──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
                                            │
                                            ▼
                           ADVANCED WORKSPACES & EXPORT
  • Video Studio (Storyboard visualizer, script editor, SRT/VTT export, scene previews)
  • Presentation Studio (Slide canvas, speaker notes editor, add/reorder slides, PPTX export)
  • Infographic Studio (Visual hierarchy canvas, chart/stat preview, SVG/PNG/PDF export)
  • Unified Generation Workspace (Interactive source traceability popover for every fact)
```

---

## 🛠️ Complete Tech Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Core Web App** | **Next.js 14** (App Router), **React 18**, **TypeScript 5.9** | Server-side rendering, client components, API route handlers, and unified layouts |
| **Styling & UI** | **Tailwind CSS 3.4**, **Framer Motion 11**, **Lucide React** | Responsive modern glassmorphism UI, slate/indigo dark palettes, and interactive transitions |
| **Database & ORM** | **Prisma ORM 5.22**, **SQLite** (`dev.db`) / **PostgreSQL** compatible | Relational domain models for sources, intelligence graphs, transcripts, and output packages |
| **AI Providers** | **Google Gemini Multimodal API** (`@google/generative-ai`), **Mock AI Provider** | Video understanding, speech transcription, speaker diarization, fact extraction, and structured output generation |
| **Document Parsers** | **`pdf-parse`**, **`mammoth`** | PDF text extraction and Microsoft Word (`.docx`) raw text extraction |
| **Presentations** | **`jszip`**, **`fast-xml-parser`**, **`pptxgenjs`** | `.pptx` slide-by-slide XML parsing, notes extraction, and native `.pptx` binary compilation |
| **Audio & Feeds** | **`fast-xml-parser`**, Native Fetch Streams | Podcast RSS XML feed parser, enclosure audio extractor, and direct stream detection |
| **Security & Gateway** | **`SecurityValidationService`**, **`jose`**, **`bcryptjs`**, Node `dns/promises`, `crypto` | Ingestion security gateway (magic bytes, traversal, archive bombs, SSRF & redirect defense), SHA-256 source hashing, duplicate detection, and JWT auth |
| **Provenance & Identity**| **`FingerprintService`**, **`SimHashService`**, **`CanonicalizationService`** | Deterministic canonicalization (NFC, whitespace, line endings, sorted JSON), SHA-256 fingerprints, 64-bit SimHash, and parent-child provenance lineages |
| **Validation** | **`zod`** | Strict runtime schema validation on AI JSON responses and API payloads |
| **State & Query** | **`@tanstack/react-query 5`**, **`zustand 4`** | Client-side async state synchronization and UI state management |

---

## ✨ Key Capabilities & Workspaces

### 1. Multimodal Source Ingestion & Security Perimeter
- **3-Tab Creation Studio** (`/create`): Choose between Raw Text / Prompt, File Upload, or Media URL.
- **Cybersecurity Gateway**: All incoming files and URLs pass structural and signature validation before processing.
- **Supported Upload Formats**: PDF, DOCX, PPT, PPTX, TXT, Images (`JPG`, `PNG`, `WEBP`), Audio (`MP3`, `WAV`, `M4A`, `AAC`, `OGG`), Video (`MP4`, `MOV`, `WEBM`).
- **File Validation & Exploit Defense**: Category-specific size caps (25MB docs, 10MB images, 100MB audio, 500MB video), magic byte binary detection (`MZ`, `ELF`, Mach-O), ZIP bomb prevention (100:1 ratio, 10,000 entries), PDF embedded script detection, and Office VBA macro blocking.
- **URL Security & SSRF Defense**: Strictly permits `http`/`https`, resolves DNS to block loopback, RFC1918, and cloud metadata (`169.254.169.254`), and follows redirects safely with re-validation on every hop.
- **Cryptographic SHA-256 Hashing & Duplicate Detection**: Computes deterministic source hashes and warns of existing sources within the project while maintaining cross-user privacy.
- **URL Ingestion & Classification**:
  - **YouTube Videos**: Gemini video understanding extracts timestamped transcript segments, visual context, on-screen text, and scene descriptions.
  - **Podcast RSS Feeds**: Automatic feed inspection, channel metadata, show artwork, and interactive episode selector with direct audio stream extraction.
  - **Direct Media URLs**: Instant recognition of online `.mp3`, `.wav`, `.mp4`, and `.pdf` files.
  - **Web Articles**: Clean scraper extracting main readable paragraphs and headings while removing navigation, headers, footers, and ads.

### 2. Deep Structured Content Intelligence
The system parses and analyzes the source **once** into a persistent structured representation:
- **Core Knowledge**: Executive Summary, Topics, Key Facts (with source citations), Claims, Entities, Dates, Locations, Organizations, Statistics (with metric & value), Quotations, and Timeline.
- **Transcripts**: Full reconstructed text with speaker diarization and second-by-second timestamps.
- **Video Scenes**: Visual descriptions, on-screen text, camera framing, motion recommendations, and audio cues.
- **Presentation Slides**: Extracted slide numbers, titles, bullet lists, and speaker notes.

### 3. Advanced Output Packages & Dedicated Studios

#### 🎬 Video Content Package Studio (`/video/[videoId]`)
- **Video Concept**: Title, hook, target audience, objective, duration, tone, and format.
- **Production Script**: Hook, introduction, main sections with visual cues, conclusion, CTA, and one-click teleprompter copy.
- **Visual Storyboard**: Scene-by-scene timing, camera framing, motion, transition, narration, visual description, on-screen text, and audio cues.
- **Timed Subtitles**: Interactive closed captions with downloadable `.srt` and `.vtt` files.
- **Visual & Audio Recommendations**: Prompts for 3D animations, stock footage, and curated background music style/mood transitions.

#### 📊 Presentation Slide Studio (`/presentation/[id]`)
- **Slide Deck Navigator**: Add slides, delete slides, reorder slides, and select thumbnail previews.
- **Live Slide Canvas**: Interactive previews supporting multiple layouts (`TITLE_HERO`, `THREE_COLUMN_CARDS`, `STAT_GRID_METRICS`, `TIMELINE_FLOW`, `TWO_COLUMN`).
- **Properties & Bullet Editor**: Edit titles, main takeaways, dynamic bullet lists, and visual recommendations.
- **Speaker Notes**: Full context, talking points, and AI-powered note enhancement.
- **Native PPTX Export**: Generates and downloads standard `.pptx` presentation files.

#### 📈 Infographic Package Studio (`/infographic/[id]`)
- **Visual Hierarchy**: Hero headline, subheadline, and core takeaway banner.
- **Traceable Statistics Cards**: Prominent metric counters with interactive source verification badges.
- **Section Builder**: Structured blocks for headlines, key stats, main insights, supporting data, comparisons, and timelines.
- **Layout Switcher**: Toggle between Vertical (Mobile/Pinterest) and Grid Cards layouts.
- **Export Options**: Copy JSON structure, print to PDF, or export SVG/PNG view.

#### ✍️ AI Post Studio & Editor (`/editor/[contentId]`)
- **Multi-Format Adaptation**: LinkedIn posts, Twitter/X threads, Instagram captions, blog articles, executive memos, and custom formats.
- **AI Action Bar**: Instant triggers for Shorten, Expand, Simplify, Executive Tone, and Make Engaging.
- **Factual Validation Score**: AI-audited compliance, fact accuracy percentage (98%+), and claim checklist.
- **Provenance Tab**: Inspect asset SHA-256 cryptographic identity, copy fingerprint, view algorithm/version tags, 64-bit SimHash, and audit the full version lineage chain ($A \to B \to C$).
- **Version History & Hashtags**: Snapshot restoration and targeted platform hashtag suite.

### 4. Content Provenance & Verification Studio (`/verify`)
- **Public / Authorized Verification**: Paste arbitrary generated content, text, or structured JSON packages to verify authenticity.
- **Dual-Stage Analysis**:
  1. Exact cryptographic match against platform provenance registry (`similarity_score: 1.0`).
  2. Locality-sensitive SimHash Hamming distance comparison detecting modified or related assets.
- **Configurable Confidence Indicators**: High ($\ge 0.85$), Medium ($\ge 0.65$), Low ($\ge 0.40$), and No Significant Match ($< 0.40$).
- **Privacy Boundary**: External queries return anonymized safe references (`auth-verified-<hash>`) without revealing internal database records.

### 5. Interactive Source Traceability
Every generated fact, claim, or statistic is linked back to the source:
- **YouTube / Video / Audio**: Timestamp citations (e.g. `00:14:32 in YouTube Video`).
- **Presentations**: Slide number citations (e.g. `Slide 4 in PPTX`).
- **Documents**: Page and section citations (e.g. `Page 17 in PDF`).
- **Interactive Inspector**: Clicking any metric on the project dashboard opens a verification popover.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js v18+** (tested on Node v20/v24)
- **npm** or **yarn**

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd content-intelligence-platform
npm install
```

### 2. Configure Environment Variables
Create or edit `.env`:
```env
# SQLite Database URL (or PostgreSQL URL)
DATABASE_URL="file:./dev.db"

# Secret Key for JWT Session Authentication
JWT_SECRET="content-intelligence-platform-jwt-secret-key-2026"

# Google Gemini API Key (Required for live Gemini Multimodal AI; leave blank to use built-in Mock Provider)
GEMINI_API_KEY="your-gemini-api-key-here"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# Phase 3A Security Configuration
# File Category Limits (MB)
MAX_FILE_SIZE_MB=100
MAX_DOCUMENT_SIZE_MB=25
MAX_IMAGE_SIZE_MB=10
MAX_AUDIO_SIZE_MB=100
MAX_VIDEO_SIZE_MB=500

# Archive Bomb Protection Limits
MAX_ARCHIVE_ENTRIES=10000
MAX_UNCOMPRESSED_SIZE_MB=500
MAX_COMPRESSION_RATIO=100

# URL Security & SSRF Limits
MAX_URL_REDIRECTS=5
URL_CONNECTION_TIMEOUT_MS=5000
URL_REQUEST_TIMEOUT_MS=30000
MAX_URL_RESPONSE_SIZE_MB=100

# Security Policy
SECURITY_SCANNER_VERSION="1.0.0"
SECURITY_REJECT_HIGH_SEVERITY=true
SECURITY_REJECT_MEDIUM_SEVERITY=false

# Phase 3B Content Fingerprinting & Provenance Configuration
FINGERPRINT_ALGORITHM="SHA-256"
FINGERPRINT_VERSION="1"

SIMILARITY_ALGORITHM="SIMHASH"
SIMILARITY_VERSION="1"
SIMILARITY_SHINGLE_SIZE=3

SIMILARITY_HIGH_THRESHOLD=0.85
SIMILARITY_MEDIUM_THRESHOLD=0.65
SIMILARITY_LOW_THRESHOLD=0.40
```

### 3. Initialize the Database
```bash
# Push schema migrations to database
npx prisma db push --schema public/prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema public/prisma/schema.prisma

# (Optional) Seed demo user and sample templates
node --import tsx/esm scripts/seed.ts
```

### 4. Run Automated Test Suites
```bash
# Run all automated test suites (Phase 3A Security + Phase 3B Provenance)
npm run test:all
```
*Executes all 79 automated tests across security ingestion validation (filename attacks, MIME mismatch, archive bombs, SSRF) and content provenance (SHA-256 canonical hashing, SimHash similarity, version lineages, and verification).*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Directory Architecture

```text
├── app/
│   ├── (auth)/                    # Authentication pages (Login, Signup, Forgot Password)
│   ├── (public)/                  # Marketing landing page
│   ├── api/                       # Backend Next.js Route Handlers
│   │   ├── auth/                  # Login, Signup, Logout, Session check
│   │   ├── content/               # Content retrieval, patching, and AI rewriting
│   │   │   ├── [id]/provenance/   # Asset provenance identity & immutable lineage chain
│   │   │   └── [id]/versions/     # Version history with cryptographic fingerprints
│   │   ├── export/                # PPTX binary generator & SRT/VTT subtitle export
│   │   │   ├── pptx/route.ts      # Native PowerPoint presentation compilation
│   │   │   └── subtitles/route.ts # SRT and WebVTT closed captions compilation
│   │   ├── generation/            # Multi-output creation and per-format retry
│   │   ├── projects/              # Project and workspace management
│   │   ├── provenance/            # Content verification endpoints
│   │   │   └── verify/route.ts    # POST /api/provenance/verify (exact & similarity matching)
│   │   ├── sources/               # Source status, intelligence, upload, and URL detect
│   │   │   ├── [id]/intelligence/ # Structured Content Intelligence retrieval
│   │   │   ├── [id]/status/       # Real-time processing progress polling
│   │   │   ├── upload/route.ts    # Multimodal file upload handler
│   │   │   └── url/detect/        # URL detector & RSS preview handler
│   │   ├── templates/             # Template management
│   │   └── video/                 # Video projects and scene routes
│   ├── create/                    # 3-Tab Ingestion & Output Studio
│   ├── dashboard/                 # Content Operations Dashboard
│   ├── editor/[contentId]/        # AI Post Studio, Factual Audit & Provenance Inspector
│   ├── infographic/[id]/          # Infographic Studio (Traceable stats, section builder)
│   ├── presentation/[id]/         # Presentation Studio (Live slide canvas, notes, PPTX export)
│   ├── projects/                  # Workspace Hierarchy
│   │   └── [projectId]/           # Workspace Hub & Source Traceability Inspector
│   ├── settings/                  # User profile and AI model configuration
│   ├── templates/                 # Template library
│   ├── verify/                    # Content Verification Studio (Exact & Heuristic Matching)
│   ├── video/[videoId]/           # Video Content Package Studio (Storyboard, Script, SRT)
│   ├── globals.css                # Custom CSS design tokens and utilities
│   └── layout.tsx                 # Root application layout
├── components/
│   └── layout/                    # Reusable Navbar, Footer, and UI elements
├── lib/
│   ├── ai/                        # Modular AI Architecture
│   │   ├── index.ts               # Provider selector (Gemini vs Mock fallback)
│   │   ├── pipeline.ts            # Parallel multi-output generation & persistence pipeline
│   │   ├── provider.ts            # AIProvider & ContentIntelligence interface definitions
│   │   └── providers/
│   │       ├── gemini.ts          # Google Gemini Multimodal Provider
│   │       └── mock.ts            # Offline-safe Intelligent Mock Provider
│   ├── auth/                      # Session cookie management and password hashing
│   ├── db/                        # Prisma client singleton
│   ├── parsers/                   # Document, PPTX, RSS, Web, and URL detector
│   ├── provenance/                # Phase 3B: Content Fingerprinting & Provenance Identification
│   │   ├── canonicalization/      # Text, Structured JSON & Package Canonicalizers (Video, Presentation, Infographic)
│   │   ├── config/                # ProvenanceConfig (environment settings & thresholds)
│   │   ├── fingerprint/           # CanonicalizationService, CryptographicFingerprintService, SimilarityFingerprintService, FingerprintService
│   │   ├── models/                # ContentFingerprint, ProvenanceRecord, VerificationResult, SimilarityResult
│   │   ├── similarity/            # TokenShinglingService, SimHashService (64-bit), SimilarityScoringService
│   │   ├── storage/               # ProvenanceStore interface & DatabaseProvenanceStore (Prisma)
│   │   ├── verification/          # ContentVerificationService (dual-stage exact & similarity check)
│   │   ├── versioning/            # ContentVersionService (parent-child version lineage chain)
│   │   └── index.ts               # Barrel export
│   ├── security/                  # Phase 3A: Centralized Secure Content Ingestion Gateway
│   │   ├── config/                # SecurityConfig (environment variables & defaults)
│   │   ├── models/                # SecurityFinding & SecurityScanResult models
│   │   ├── file/                  # Filename, FileSize, FileType, Signature, Archive & Document validators
│   │   ├── url/                   # UrlScheme, Host, IpRange, SSRF, & Redirect validators
│   │   ├── hashing/               # ContentHashService (SHA-256 buffer & text hashing)
│   │   ├── duplicate/             # DuplicateDetector (privacy-preserving duplicate detection)
│   │   ├── SecurityValidationService.ts # Central Security Gateway
│   │   └── index.ts               # Barrel export
│   └── storage/                   # Hardened file system storage service for uploads
├── public/
│   ├── prisma/
│   │   └── schema.prisma          # Relational Prisma Domain Schema with Provenance & Fingerprints
│   └── uploads/                   # Stored user uploads
├── scripts/
│   ├── seed.ts                    # Database seed script
│   ├── test_phase2.ts             # Phase 2 test suite
│   ├── test-security.ts           # Phase 3A Security test suite (Groups A through J)
│   └── test-provenance.ts         # Phase 3B Provenance test suite (Scenarios 1 through 10)
├── package.json                   # NPM dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

---

# 🛡️ Secure Content Ingestion Architecture (Phase 3A)

A centralized cybersecurity security layer sits at the ingestion boundary of the platform. Every uploaded file and submitted URL passes comprehensive security validation, cryptographic SHA-256 hashing, and duplicate detection **BEFORE** normalization, parsing, OCR, transcription, video analysis, context extraction, AI processing, or Content Intelligence generation.

```text
                         USER
                           │
                           ▼
                  ┌────────────────┐
                  │ INPUT SOURCES  │
                  ├────────────────┤
                  │ Files          │
                  │ URLs           │
                  │ YouTube        │
                  │ Podcasts       │
                  └───────┬────────┘
                          │
                          ▼
        ╔════════════════════════════════╗
        ║ SECURE INGESTION GATEWAY       ║
        ╠════════════════════════════════╣
        ║ Filename Validation            ║
        ║ Extension Validation           ║
        ║ MIME Validation                ║
        ║ Magic Byte Detection           ║
        ║ File Size Limits               ║
        ║ Archive Bomb Protection        ║
        ║ Document Inspection            ║
        ║ URL Scheme Validation          ║
        ║ SSRF Protection                ║
        ║ Redirect Validation            ║
        ║ SHA-256 Hashing                ║
        ╚═══════════════╤════════════════╝
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
          REJECTED             ACCEPTED
              │                   │
              ▼                   ▼
        Safe Error          NORMALIZATION
      (No internal leaks)         │
                                  ▼
                               PARSING
                                  │
                                  ▼
                        CONTENT INTELLIGENCE
                                  │
                                  ▼
                           AI GENERATION
```

---

## 🔒 Security Gateways & Validators

### 1. File Security Validation (`FileSecurityValidator`)
- **Filename Validation (`FilenameValidator`)**:
  - Blocks directory and path traversal sequences (`../../etc/passwd`, `..\..\Windows\System32`, `..`).
  - Detects raw and URL-encoded null byte injections (`%00`, `\0`).
  - Blocks Windows reserved device names (`CON`, `PRN`, `AUX`, `NUL`, `COM1..9`, `LPT1..9`).
  - Enforces a configurable 255-character maximum filename length.
  - Detects executable double extensions (`report.pdf.exe`, `image.jpg.js`).
  - Never writes user-supplied filenames directly to disk; sanitizes base names and generates isolated internal storage identifiers (`safeBase_timestamp_randomHex.ext`).
- **File Type & Extension Allowlist (`FileTypeValidator`)**:
  - Explicit allowlist: Documents (`.pdf`, `.docx`, `.ppt`, `.pptx`, `.txt`), Images (`.jpg`, `.jpeg`, `.png`, `.webp`), Audio (`.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`), Video (`.mp4`, `.mov`, `.webm`).
  - Denylist of executables/scripts (`.exe`, `.dll`, `.bat`, `.cmd`, `.ps1`, `.sh`, `.vbs`, `.js`, `.jar`, `.msi`, `.scr`, `.com`, `.pif`, `.reg`, etc.).
  - Declared vs detected MIME validation to reject dangerous disguised types.
- **File Signature / Magic Byte Inspection (`FileSignatureValidator`)**:
  - Inspects initial byte signatures across all incoming uploads.
  - Automatically flags and rejects binary execution headers (`MZ`, `ELF`, Mach-O `FEEDFACE`, Shell `# !`) regardless of declared extension.
  - Verifies format magic bytes: PDF (`%PDF-`), PNG (`89 50 4E 47`), JPEG (`FF D8 FF`), WebP (`RIFF....WEBP`), ZIP/OpenXML (`PK\x03\x04`), MP3 (`ID3` / frame sync), WAV (`RIFF....WAVE`), OGG (`OggS`), MP4/MOV (`ftyp`), WebM (`1A 45 DF A3`).
- **Category-Specific File Size Limits (`FileSizeValidator`)**:
  - Category limits configured via environment variables: Document (25 MB), Image (10 MB), Audio (100 MB), Video (500 MB), General (100 MB).
  - Validates size upfront before expensive parsing or extraction, returning clear user messages stating maximum allowed limits.
- **Archive Decompression Bomb Protection (`ArchiveValidator`)**:
  - Safe ZIP central directory inspection for DOCX and PPTX without extracting contents to disk or RAM.
  - Enforces `MAX_ARCHIVE_ENTRIES` (10,000), `MAX_UNCOMPRESSED_SIZE_MB` (500 MB), and `MAX_COMPRESSION_RATIO` (100:1).
  - Checks for nested zip slip path traversal entries (`../../evil.sh`).
- **Document Safety Inspection (`DocumentSecurityValidator`)**:
  - **PDF**: Inspects syntax for embedded JavaScript (`/JavaScript`, `/JS`), process launch actions (`/Launch`), embedded files (`/EmbeddedFiles`), and suspicious external URIs without executing any scripts.
  - **DOCX / PPTX**: Inspects OpenXML archives for VBA macros (`vbaProject.bin`, `vbaData.xml`), embedded executables, and suspicious external relationships.

---

### 2. URL Security & SSRF Protection (`UrlSecurityValidator`)
- **Scheme Validation (`UrlSchemeValidator`)**:
  - Strictly permits only `http:` and `https:` schemes.
  - Blocks unsafe protocols: `file://`, `ftp://`, `gopher://`, `data://`, `javascript://`, `blob://`, `chrome://`, `about://`.
- **SSRF & Private IP Range Protection (`SsrfProtection`, `HostValidator`, `IpRangeValidator`)**:
  - Blocks loopback addresses: `localhost`, `127.0.0.0/8`, `::1`.
  - Blocks RFC1918 private IPv4 subnets: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
  - Blocks link-local addresses and cloud metadata endpoints: `169.254.0.0/16`, `169.254.169.254` (AWS, GCP, Azure metadata).
  - Blocks private IPv6 ranges: `::1`, `fc00::/7` (unique local), `fe80::/10` (link local), IPv4-mapped IPv6 (`::ffff:0:0/96`).
  - Performs real DNS resolution via `node:dns/promises` and validates all resolved IP addresses, mitigating DNS rebinding attacks.
- **Safe Manual Redirect Following (`RedirectValidator`)**:
  - Disables blind redirect following (`redirect: 'manual'`).
  - Validates every redirect target through full scheme and SSRF DNS checks before proceeding.
  - Enforces `MAX_URL_REDIRECTS` (5) and timeouts (`URL_REQUEST_TIMEOUT_MS` = 30,000 ms, `URL_CONNECTION_TIMEOUT_MS` = 5,000 ms).
  - Enforces `MAX_URL_RESPONSE_SIZE_MB` (100 MB) on response headers and streamed response body chunks.

---

### 3. Cryptographic Hashing & Duplicate Detection (`ContentHashService`, `DuplicateDetector`)
- **SHA-256 Source Hashing**:
  - Computes deterministic SHA-256 hashes on raw file buffers, fetched URL bytes, and normalized UTF-8 text.
  - Stored alongside `Source` records and `SecurityScan` audit logs for integrity verification and provenance tracking.
- **Privacy-Preserving Duplicate Detection**:
  - **Same user + same project**: Displays duplicate notification allowing content reuse.
  - **Same user + different project**: Displays notice allowing cross-project reference.
  - **Different users**: Strict zero-leakage privacy boundary. Never discloses whether another user previously uploaded identical content.

---

## ⚠️ Security Limitations & Boundaries

1. **Application-Level Boundary**: This security gateway provides high-assurance application-level validation and structural inspection. It is not an enterprise Antivirus/EDR engine or sandbox hypervisor.
2. **Zero File Execution**: The platform never executes uploaded binaries, shell scripts, or embedded PDF/Office macros. Content is strictly inspected and parsed as structured text and media metadata.
3. **Defense-in-Depth Extension**: Organizations requiring perimeter binary detonation can integrate external cloud antivirus scanners (e.g. ClamAV, VirusTotal, AWS GuardDuty) into `SecurityValidationService.validateUploadedFile` prior to parsing.

---

## 🗄️ Database Models Reference

- **`User` / `Session`**: User accounts and encrypted JWT sessions.
- **`Project`**: Workspaces organizing sources, content intelligence, and generations.
- **`Source`**: Ingested sources with status (`UPLOADED`, `VALIDATING`, `PROCESSING`, `ANALYZING`, `COMPLETED`, `FAILED`), security status, and SHA-256 source hashes.
- **`SecurityScan`**: Immutable audit logs of file/URL security scans and findings.
- **`ContentIntelligence`**: Persistent structured knowledge representation (summary, topics, facts, claims, entities, dates, locations, organizations, statistics, quotations, timeline).
- **`Transcript` & `TranscriptSegment`**: Reconstructed speech with speaker diarization and seconds timing.
- **`VideoAnalysis` & `VideoAnalysisScene`**: Visual descriptions, on-screen text, camera framing, and audio cues.
- **`PresentationAnalysis` & `PresentationAnalysisSlide`**: Slide titles, bullets, speaker notes, and layouts.
- **`SourceReference`**: Fact-to-source traceability records.
- **`Generation` & `GeneratedContent`**: Generated outputs across formats with validation scores, cryptographic fingerprints, and provenance lineages.
- **`ContentFingerprint`**: Persistent cryptographic SHA-256 fingerprint and 64-bit SimHash similarity profile for generated content.
- **`ProvenanceRecord`**: Immutable provenance audit trail tracking asset origin, creator type, and parent-child version lineages ($A \to B \to C$).
- **`VideoOutputPackage`**: Video concept, teleprompter script, storyboard scenes, narration, subtitles, and visual/audio recommendations.
- **`PresentationOutputPackage`**: Slide deck metadata, slides, speaker notes, and presentation structure.
- **`InfographicOutputPackage`**: Main messaging, statistics, section hierarchy, and layout/visual guidance.
- **`ValidationResult` & `ContentVersion`**: Factual consistency audit scores and version history with parent/child fingerprint links.

---

# 🛡️ Phase 3B — Content Fingerprinting and Provenance Identification

The platform implements an immutable content provenance architecture. Every finalized generated output receives a deterministic canonical representation, a cryptographic SHA-256 identity fingerprint, a 64-bit SimHash similarity profile, and a persistent provenance record tracking parent-child version lineages.

```text
                  AI GENERATION
                        │
                        ▼
                FINAL CONTENT
                        │
                        ▼
              CANONICALIZATION
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
       SHA-256 HASH              SIMHASH
            │                       │
            ▼                       ▼
    EXACT FINGERPRINT      SIMILARITY PROFILE
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
                PROVENANCE RECORD
                        │
                        ▼
                  DATABASE STORE
                        │
                        ▼
            FUTURE BLOCKCHAIN ANCHOR
```

### 1. Distinction: Phase 3A vs. Phase 3B Hashing
- **Phase 3A Hashing**: `SHA-256(raw_source_bytes)` identifies **input sources** at the ingestion boundary for integrity, security scanning, and duplicate upload prevention.
- **Phase 3B Fingerprinting**: `SHA-256(canonical_content)` identifies **final generated assets** for provenance identity, edit version lineages ($A \to B \to C$), similarity comparison, and future blockchain anchoring.

### 2. Canonicalization Subsystem (`lib/provenance/canonicalization`)
- **Text Canonicalization** (`TextCanonicalizer`):
  - Deterministic Unicode normalization via `NFC`.
  - Normalization of line breaks (`CRLF`, `CR`, `LF` -> `\n`).
  - Collapse of horizontal whitespace (`[ \t]+` -> `' '`) with per-line trimming.
  - Normalization of paragraph gaps (collapsing 3+ consecutive line breaks to `\n\n`) preserving semantic paragraph structure without formatting drift.
  - Outer whitespace trimming while strictly preserving semantic words, casing, and punctuation.
- **Structured Content Canonicalization** (`StructuredContentCanonicalizer`):
  - Deep recursive alphabetical key sorting.
  - Stable JSON serialization independent of key definition order.
- **Package Canonicalization** (`PackageCanonicalizer`):
  - Specialized canonical representations for Video Packages, Slide Presentations, and Infographics.
  - Strips volatile UI metadata, temporary IDs, and processing timestamps while preserving semantic content, scene sequences, slide order, and section hierarchy.

### 3. Fingerprinting & Similarity Subsystem (`lib/provenance/fingerprint`, `similarity`)
- **Cryptographic Fingerprint** (`CryptographicFingerprintService`):
  - 64-character lowercase SHA-256 hex digest computed over canonical UTF-8 bytes.
- **Locality-Sensitive Similarity** (`SimHashService`, `TokenShinglingService`):
  - Token shingling generates word n-grams (configurable `SIMILARITY_SHINGLE_SIZE=3`).
  - Computes 64-bit SimHash via 64-dimensional accumulator vectors.
  - Computes Hamming distance between SimHashes ($0 \le d \le 64$).
  - Normalized similarity score: $\text{score} = 1 - (d / 64)$.
  - Configurable confidence tiers:
    - $\ge 0.85$: High Confidence
    - $\ge 0.65$: Medium Confidence
    - $\ge 0.40$: Low Confidence
    - $< 0.40$: No Significant Match

### 4. Content Versioning & Provenance Lineage (`ContentVersionService`)
- When generated content is edited (manually or via AI rewrite):
  - Version $N$ fingerprint is linked as `parentFingerprint` of Version $N+1$.
  - Generates new cryptographic SHA-256 and SimHash for Version $N+1$.
  - Provenance history records are append-only and immutable ($A \to B \to C$).

### 5. ProvenanceStore Abstraction & Future Blockchain Anchor (`lib/provenance/storage`)
- The `ProvenanceStore` interface abstracts storage operations:
  - `DatabaseProvenanceStore` implements Prisma / SQLite storage.
  - Future `BlockchainProvenanceStore` can be slotted in without altering fingerprinting or canonicalization logic.
  - No smart contracts, crypto wallets, or tokens are implemented in this phase.

### 6. Verification Service & Studio UI
- **API**: `POST /api/provenance/verify`:
  - Canonicalizes submitted text or structured content.
  - Checks for exact cryptographic match in provenance registry.
  - If no exact match, executes SimHash Hamming scan across stored assets to identify potential related content.
  - Privacy boundary: Unauthorized cross-project queries receive anonymized safe reference IDs (`auth-verified-<hash>`).
- **API**: `GET /api/content/[id]/provenance`:
  - Returns current fingerprint and full immutable provenance history chain.
- **API**: `GET /api/content/[id]/versions`:
  - Returns version history with parent/child fingerprint links.
- **UI**:
  - Content Editor Provenance Tab (`/editor/[contentId]`): displays SHA-256 hash, algorithm, version, SimHash, copy button, and provenance chain.
  - Verification Studio (`/verify`): interactive tool to paste arbitrary text/JSON and verify exact provenance or heuristic similarity.

### 7. Technical Limitations
1. **Cryptographic Avalanche**: SHA-256 provides exact canonicalized identity. Changing a single character produces an entirely different hash.
2. **Heuristic Similarity**: SimHash and token shingling provide probabilistic lexical similarity. The score is heuristic and does NOT constitute legal proof of copying or plagiarism.
3. **Paraphrase Boundaries**: Substantive rewrites using completely different vocabulary may evade token-based n-gram similarity.
4. **Scope Boundaries**: Blockchain transaction anchoring and invisible watermarking are reserved for future phases (Phase 3C is Invisible Watermarking).

---

## 🧪 Testing & Verification

Run the complete test suite (Phase 3A Security + Phase 3B Provenance):
```bash
npm run test:all
```

Or run test suites individually:
```bash
# Phase 3A Security Ingestion Suite (49 tests)
npm test

# Phase 3B Provenance & Fingerprinting Suite (30 tests)
npm run test:provenance
```

To verify static TypeScript types:
```bash
npx tsc --noEmit
```

---

## 🏗️ Production Build Verification

To compile and verify the Next.js production build:
```bash
npm run build
```
*All 28 routes (including provenance verification APIs, Verification Studio, studios, and dashboards) compile with zero errors.*

To start the production server:
```bash
npm run start
```

---

## 📄 License
MIT License. Built with Next.js, Google Gemini, and Prisma.

