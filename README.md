# ⚛️ PhiLab Studio

**PhiLab Studio** is an open, interactive 2D physics simulation engine and generative AI lab studio. Built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **Vitest**, PhiLab Studio enables educators to design dynamic physics widgets and scaffolded student worksheets while guaranteeing deterministic calculation accuracy without LLM arithmetic hallucinations.

---

## 🌟 Key Features

### 1. 🔬 Precision Interactive Laboratory Widgets
- **Vernier Caliper**: Main scale ($1\text{ mm}$ MSD), 10-division vernier scale ($\text{LC} = 0.01\text{ cm}$), zero error calibration ($+0.02\text{ cm}, -0.03\text{ cm}$), specimen selector, and high-magnification loupe.
- **Ohm's Law & DC Circuits**: Variable DC power supply, load resistor, internal resistance, animated electron drift flow, and live $V$-$I$ characteristics graph plotting.
- **Simple & Damped Pendulum**: RK4-integrated harmonic motion with real-time vector visualization.

### 2. ⚡ Generative AI Simulation Architect
- **AI Co-Pilot & Studio**: Teachers can describe any physical experiment in plain natural language.
- **AST Math Evaluator**: Mathematical expressions (e.g. `2 * PI * sqrt(L / g)`, `V / R`, comparison & ternary conditionals) are safely evaluated without `eval()`.
- **Declarative SVG Graphic Trees**: Generates raw 2D visual elements (`rect`, `circle`, `line`, `path`, `text`, `polygon`) bound to live physics variables.

### 3. 🎓 Student Lab Workspace & Universal Graphing
- **Auto-Graded Step Verifiers**: Immediate numeric verification with customizable tolerance thresholds.
- **Universal Grapher & Regression Engine**: Fits linear/power regressions ($y = mx + c$) to student experimental trial data to extract physical constants (e.g., $g$).
- **Gamified Sticker Rewards**: Earn collectable badges upon completing lab challenges.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ashish-ai-eng/raman.git
cd raman
npm install
```

### 2. Environment Setup (Optional for AI Studio)

To enable live generative AI widget creation via Google Gemini:

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Seed presets work completely offline without an API key).*

---

## 🛠️ Development & Running Locally

### Development Server
Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application:
- **Interactive Stage**: `http://localhost:3000/`
- **Teacher AI Studio**: `http://localhost:3000/teacher/agent-builder`
- **Teacher Dashboard**: `http://localhost:3000/teacher`
- **Student Lab Runner**: `http://localhost:3000/student/lab/pendulum-101`
- **Sticker Rewards Album**: `http://localhost:3000/student/rewards`

### Production Build
Build and run the production application:

```bash
npm run build
npm start
```

---

## 🧪 Testing & Code Quality

PhiLab Studio enforces strict TypeScript types and comprehensive unit/integration test coverage using **Vitest** and **React Testing Library**.

```bash
# Run unit & integration test suite
npm test

# Watch mode for testing
npm run test:watch

# TypeScript typechecking
npm run typecheck

# Code linting
npm run lint

# Format code with Prettier
npm run format
```

---

## 📁 Project Architecture

```
raman/
├── src/
│   ├── app/                         # Next.js App Router routes & API endpoints
│   │   ├── api/                     # Agent chat & lab publishing APIs
│   │   ├── student/                 # Student lab runner & reward sticker album
│   │   └── teacher/                 # Teacher dashboard & generative AI builder
│   ├── components/                  # UI components & SVG/Primitive renderers
│   │   ├── layout/                  # Navbar & global layout
│   │   ├── student/                 # Universal Grapher & scatter plots
│   │   ├── teacher/                 # Analytics & formula inspector
│   │   └── widgets/                 # Dynamic Widget Runner & SVG canvas renderers
│   ├── lib/
│   │   ├── agent/                   # AI system prompts & Zod schemas
│   │   ├── engine/                  # AST Math Evaluator & Dependency Graph solver
│   │   └── gamification/            # Step verifier & rewards engine
│   ├── presets/                     # Universal Physics Specs (Vernier, Ohm's Law, Pendulum)
│   └── types/                       # Universal Physics Spec (UPR) TypeScript contracts
├── package.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

---

## 📜 License

MIT License. Designed & Developed for Physics Educators and Students worldwide.
