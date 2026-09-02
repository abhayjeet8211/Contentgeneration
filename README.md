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
                                UNIFIED INGESTION & PARSING
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
| **Security & Auth** | **`jose`**, **`bcryptjs`**, Custom SSRF URL validator | JWT cookie session security, password hashing, and SSRF private IP blocking |
| **Validation** | **`zod`** | Strict runtime schema validation on AI JSON responses and API payloads |
| **State & Query** | **`@tanstack/react-query 5`**, **`zustand 4`** | Client-side async state synchronization and UI state management |

---

## ✨ Key Capabilities & Workspaces

### 1. Multimodal Source Ingestion
- **3-Tab Creation Studio** (`/create`): Choose between Raw Text / Prompt, File Upload, or Media URL.
- **Supported Upload Formats**: PDF, DOCX, PPT, PPTX, TXT, Images (`JPG`, `PNG`), Audio (`MP3`, `WAV`, `M4A`, `AAC`, `OGG`), Video (`MP4`, `MOV`, `WEBM`).
- **URL Ingestion & Classification**:
  - **YouTube Videos**: Gemini video understanding extracts timestamped transcript segments, visual context, on-screen text, and scene descriptions.
  - **Podcast RSS Feeds**: Automatic feed inspection, channel metadata, show artwork, and interactive episode selector with direct audio stream extraction.
  - **Direct Media URLs**: Instant recognition of online `.mp3`, `.wav`, `.mp4`, and `.pdf` files.
  - **Web Articles**: Clean scraper extracting main readable paragraphs and headings while removing navigation, headers, footers, and ads.
  - **SSRF Security Protection**: Blocks all private/internal hostnames, loopbacks (`127.0.0.1`, `localhost`), RFC1918 subnets, and cloud metadata endpoints (`169.254.169.254`).

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
- **Version History & Hashtags**: Snapshot restoration and targeted platform hashtag suite.

### 4. Interactive Source Traceability
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

### 4. Run Automated Test Suite
```bash
npx tsx scripts/test_phase2.ts
```
*Executes all 30 automated tests validating URL detection, SSRF blocking, RSS parsing, PPTX parsing, Content Intelligence extraction, Video/Presentation/Infographic packages, and PPTX compilation.*

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
│   │   ├── export/                # PPTX binary generator & SRT/VTT subtitle export
│   │   │   ├── pptx/route.ts      # Native PowerPoint presentation compilation
│   │   │   └── subtitles/route.ts # SRT and WebVTT closed captions compilation
│   │   ├── generation/            # Multi-output creation and per-format retry
│   │   ├── projects/              # Project and workspace management
│   │   ├── sources/               # Source status, intelligence, upload, and URL detect
│   │   │   ├── [id]/intelligence/ # Structured Content Intelligence retrieval
│   │   │   ├── [id]/status/       # Real-time processing progress polling
│   │   │   ├── upload/route.ts    # Multimodal file upload handler
│   │   │   └── url/detect/        # URL detector & RSS preview handler
│   │   ├── templates/             # Template management
│   │   └── video/                 # Video projects and scene routes
│   ├── create/                    # 3-Tab Ingestion & Output Studio
│   ├── dashboard/                 # Content Operations Dashboard
│   ├── editor/[contentId]/        # AI Post Studio & Factual Audit
│   ├── infographic/[id]/          # Infographic Studio (Traceable stats, section builder)
│   ├── presentation/[id]/         # Presentation Studio (Live slide canvas, notes, PPTX export)
│   ├── projects/                  # Workspace Hierarchy
│   │   └── [projectId]/           # Workspace Hub & Source Traceability Inspector
│   ├── settings/                  # User profile and AI model configuration
│   ├── templates/                 # Template library
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
│   ├── parsers/                   # Document & Media Parsers
│   │   ├── document.ts            # Unified document parser router
│   │   ├── pptx.ts                # PPT/PPTX slide deck XML extractor
│   │   ├── rss.ts                 # Podcast RSS feed XML parser & episode extractor
│   │   ├── url-detector.ts        # SSRF-safe URL detector and source classifier
│   │   └── web-article.ts         # Clean web page text scraper with SSRF protection
│   └── storage/                   # File system storage service for uploads
├── public/
│   ├── prisma/
│   │   └── schema.prisma          # Relational Prisma Domain Schema
│   └── uploads/                   # Stored user uploads
├── scripts/
│   ├── seed.ts                    # Database seed script
│   └── test_phase2.ts             # Comprehensive automated test suite
├── package.json                   # NPM dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

---

## 🗄️ Database Models Reference

- **`User` / `Session`**: User accounts and encrypted JWT sessions.
- **`Project`**: Workspaces organizing sources, content intelligence, and generations.
- **`Source`**: Ingested sources with status (`UPLOADED`, `VALIDATING`, `PROCESSING`, `ANALYZING`, `COMPLETED`, `FAILED`) and progress steps.
- **`ContentIntelligence`**: Persistent structured knowledge representation (summary, topics, facts, claims, entities, dates, locations, organizations, statistics, quotations, timeline).
- **`Transcript` & `TranscriptSegment`**: Reconstructed speech with speaker diarization and seconds timing.
- **`VideoAnalysis` & `VideoAnalysisScene`**: Visual descriptions, on-screen text, camera framing, and audio cues.
- **`PresentationAnalysis` & `PresentationAnalysisSlide`**: Slide titles, bullets, speaker notes, and layouts.
- **`SourceReference`**: Fact-to-source traceability records.
- **`Generation` & `GeneratedContent`**: Generated outputs across formats with validation scores.
- **`VideoOutputPackage`**: Video concept, teleprompter script, storyboard scenes, narration, subtitles, and visual/audio recommendations.
- **`PresentationOutputPackage`**: Slide deck metadata, slides, speaker notes, and presentation structure.
- **`InfographicOutputPackage`**: Main messaging, statistics, section hierarchy, and layout/visual guidance.
- **`ValidationResult` & `ContentVersion`**: Factual consistency audit scores and edit snapshot history.

---

## 🧪 Production Build Verification

To compile and verify the Next.js production build:
```bash
npm run build
```
*All 26 routes (including API endpoints, studios, and dashboards) compile with zero errors.*

To start the production server:
```bash
npm run start
```

---

## 📄 License
MIT License. Built with Next.js, Google Gemini, and Prisma.
