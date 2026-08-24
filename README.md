# OmniContent AI — Content Intelligence & Multi-Format Generation Platform

OmniContent AI is a full-stack, enterprise-style **Content Intelligence and Multi-Format Content Generation Platform**. It allows users to provide a single source of truth (such as research papers, policy advisories, news articles, PDFs, DOCX files, raw text, or prompts) and automatically transforms it into multiple platform-adapted content outputs simultaneously.

---

## 🌟 Core Concept

**ONE SOURCE → AI CONTENT INTELLIGENCE → MULTIPLE ADAPTED OUTPUTS**

```text
               ┌───────────────────────┐
               │     Source Input      │
               │ (PDF, DOCX, Text)     │
               └───────────┬───────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │ Content Intelligence  │
               │  (Facts & Context)    │
               └───────────┬───────────┘
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌───────────┐
│  LinkedIn   │    │  Twitter/X  │    │ Executive │
│  Post Draft │    │   Thread    │    │ Briefing  │
└─────────────┘    └─────────────┘    └───────────┘
      │                    │                    │
      └────────────────────┼────────────────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │ AI Factual Validation │
               │     Score (98%+)      │
               └───────────────────────┘
```

---

## ✨ Primary Capabilities

1. **1-Source Multi-Output Generation**: Generate LinkedIn posts, Twitter threads, Instagram visual captions, blog articles, executive briefing memos, video scripts, email newsletters, and custom formats simultaneously in one click.
2. **Modular AI Provider Architecture**: Native support for **Google Gemini API** (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`) with an intelligent fallback `MockAIProvider` for zero-config offline execution.
3. **AI Factual Validation Engine**: Automatically audits generated outputs against source key facts for factual consistency, format compliance, and tone alignment.
4. **Document Parser Subsystem**: Extracted text normalization support for `.pdf` (via `pdf-parse`), `.docx` (via `mammoth`), `.txt`, and raw prompts.
5. **AI Post Studio Editor**: Dual-pane editor with instant AI rewrite triggers (Shorten, Expand, Simplify, Executive Tone, Make Engaging), content version history timeline, and a hashtag/caption suite.
6. **Canvas Video Studio MVP**: 9:16 vertical video studio featuring timeline scene management, subtitle/caption sync, HTML5 canvas preview player, and MediaRecorder MP4/WebM export.
7. **Workspace & Project Hierarchy**: Organize sources, content intelligence analyses, generations, and video assets cleanly under project workspaces.
8. **Template Library**: Pre-configured system templates for LinkedIn, Executive Memos, Twitter Threads, and Video Scripts with custom user template creator.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
cd content-intelligence-platform
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
# SQLite for zero-config local dev (or PostgreSQL URL)
DATABASE_URL="file:./dev.db"

# Secret Key for Session Authentication
JWT_SECRET="content-intelligence-platform-jwt-secret-key-2026"

# Optional Google Gemini API Key (Leave empty to use built-in Intelligent Mock Engine)
GEMINI_API_KEY=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Sample Data
```bash
npx prisma@5.19.1 db push
npx tsx scripts/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack & Directory Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism & dark theme
- **Database**: Prisma ORM with SQLite (PostgreSQL compatible)
- **Authentication**: JWT HTTP-only cookies (`jose` + `bcryptjs`)
- **Parsers**: `pdf-parse`, `mammoth`
- **AI Abstraction**: `@google/generative-ai` + Fallback Mock Provider

```text
├── app/
│   ├── (public)/          # Landing Page
│   ├── (auth)/            # Login, Signup, Forgot Password
│   ├── dashboard/         # Operations Dashboard
│   ├── create/            # 1-Source Multi-Output Studio
│   ├── projects/          # Workspace Hierarchy
│   ├── editor/            # AI Post Studio & Validation
│   ├── video/             # Canvas Video Studio MVP
│   ├── templates/         # Template Library
│   ├── settings/          # AI Provider & Model Config
│   └── api/               # Server API Route Handlers
├── lib/
│   ├── ai/                # Provider Abstraction Layer & Pipeline
│   ├── auth/              # JWT Session & Password Security
│   ├── db/                # Prisma Client Singleton
│   ├── parsers/           # Document Parsers (PDF, DOCX, TXT)
│   └── storage/           # Upload Storage Service
├── prisma/
│   └── schema.prisma      # Domain Schema
└── scripts/
    └── seed.ts            # Initial DB Seed Script
```

---

## 🧪 Production Verification

To run a clean production build:
```bash
npm run build
npm run start
```
