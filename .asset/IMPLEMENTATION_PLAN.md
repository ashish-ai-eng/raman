# PhysLab Studio — Implementation Plan

This document outlines the architectural design principles, Google Engineering Practices, and step-by-step Drop Plan used to build **PhysLab Studio**.

---

## 📐 1. Architecture & Design Principles

1. **Trunk-Based Development & Small Drops (PRs):** Every pull request performed one logical task (under ~250–400 lines of diff) to ensure easy code review and zero review bottlenecks.
2. **Deterministic Physics Core:** Physics math, dependency graph resolution, instrument error calibration, and linear regression logic are pure TypeScript functions with **100% unit test coverage**. The LLM is never trusted to calculate physics values.
3. **Hermetic Unit Testing:** Every component, physics utility, API handler, and agent parser has isolated unit tests (using Vitest / React Testing Library).
4. **Strict Schema & Type Safety:** All AI outputs are constrained using Zod schemas (`UniversalPhysicsSpecSchema`, `LabSpecSchema`) and validated before rendering.
5. **Separation of Concerns:** UI rendering (`components/`), physics math (`lib/engine/`), AI orchestration (`lib/agent/`), and state/types (`types/`) are strictly decoupled.

---

## 🗓️ 2. Iterative Drop Execution Plan

```
┌────────────────────────────────────────────────────────────────────────┐
│ DROP 1: Foundation & Universal Physics Runtime (UPR) Core              │
├────────────────────────────────────────────────────────────────────────┤
│ DROP 2: Declarative Renderer & Dynamic Canvas Engine                   │
├────────────────────────────────────────────────────────────────────────┤
│ DROP 3: Multi-Turn AI Studio (Widget Creator & Lab Generator)          │
├────────────────────────────────────────────────────────────────────────┤
│ DROP 4: Teacher Verification Sandbox & Release Control                 │
├────────────────────────────────────────────────────────────────────────┤
│ DROP 5: Student Lab Runner, Universal Graphing & Gamification          │
├────────────────────────────────────────────────────────────────────────┤
│ DROP 6: Teacher Analytics, E2E Testing & Demo Polish                   │
└────────────────────────────────────────────────────────────────────────┘
```

### 📦 Drop 1: Foundation & Universal Physics Runtime (UPR) Core
* **CL 1.1:** Project Setup, Next.js 14 App Router, TypeScript strict mode, Tailwind CSS, ESLint, Prettier, Vitest test runner.
* **CL 1.2:** Core Domain Type Definitions (`types/upr.ts`, `types/labSpec.ts`).
* **CL 1.3:** Safe AST Math Evaluator (`evaluator.ts`) evaluating mathematical string expressions without `eval()`.
* **CL 1.4:** Directed Dependency Graph Solver & Instrument Error Simulator (`dependencyGraph.ts`) with zero-error calibration, least-count quantization, and synthetic noise simulation.
* **CL 1.5:** Universal Linear Regression & Physical Constant Extraction Engine (`regression.ts`) solving $Y = mX + c$, $R^2$, and extracting physical constants ($g$, $f$, $R$, $k$).

### 📦 Drop 2: Declarative Renderer & Dynamic Canvas Engine
* **CL 2.1:** Canvas 2D/SVG Visual Primitives (`PrimitiveRenderer.tsx`) rendering scales, pointers, bobs, lenses, digital readouts, circuit wires, and Vernier Calipers.
* **CL 2.2:** Universal Dynamic Widget Runner (`DynamicWidgetRunner.tsx`) providing interactive sliders, output readouts, calibration controls, and hot-reloading visual stages.
* **CL 2.3:** Seed Universal Widget Presets (`vernier.ts`, `pendulum.ts`, `optics.ts`, `ohmsLaw.ts`).

### 📦 Drop 3: Multi-Turn AI Studio
* **CL 3.1:** Zod Validation Schemas (`schemas.ts`) and System Prompts (`prompts.ts`).
* **CL 3.2:** Multi-Turn Chat API Endpoint (`app/api/agent/chat/route.ts`).
* **CL 3.3:** Teacher Chat Interface (`LabChatInterface.tsx`) and Live Sandbox Preview (`app/teacher/agent-builder/page.tsx`).

### 📦 Drop 4: Teacher Verification Sandbox & Release Control
* **CL 4.1:** Teacher Dashboard (`app/teacher/page.tsx`).
* **CL 4.2:** Verification Sandbox Page (`app/teacher/sandbox/[labId]/page.tsx`) with rubric inspector and tolerance checks.
* **CL 4.3:** Lab Approval & Publish API Route (`app/api/labs/publish/route.ts`).

### 📦 Drop 5: Student Lab Runner, Universal Graphing & Gamification
* **CL 5.1:** Student Lab Runner Page (`app/student/lab/[labId]/page.tsx`) with 1-click observation logger table.
* **CL 5.2:** Universal Data Grapher (`UniversalGrapher.tsx`) with Recharts scatter plot and linear regression overlay line.
* **CL 5.3:** Deterministic Step Verifier (`stepVerifier.ts`) and Sticker Album Gallery (`app/student/rewards/page.tsx`).

### 📦 Drop 6: Teacher Analytics, E2E Testing & Demo Polish
* **CL 6.1:** Teacher Engagement Analytics (`AnalyticsOverview.tsx`).
* **CL 6.2:** End-to-End Integration Suite (`src/test/e2e/fullFlow.test.tsx`).
* **CL 6.3:** Navigation Header (`Navbar.tsx`), demo layout polish, and QA gate validation.
