# PhysLab Studio — Walkthrough & Testing Guide

This document provides a step-by-step walkthrough of **PhysLab Studio** and instructions for testing each feature locally.

---

## 🚀 How to Run PhysLab Studio Locally

1. Open a terminal in `/Users/ashishvt/buildthon`.
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open your browser at **`http://localhost:3000`**.

---

## 🎯 Testing Scenarios & Examples

### 1. Interactive Instrument Stage (`http://localhost:3000`)
* **Vernier Caliper Test:** Select **Vernier Caliper Instrument** from the top dropdown menu.
  * Move the **Object Dimension** slider (e.g. `2.34 cm`). Watch the Vernier jaw and clamped golden sphere expand or contract in real time.
  * Adjust the **Zero Error Calibration Offset** slider (e.g. `+0.03 cm`).
  * Verify outputs:
    * **Main Scale Reading (MSR):** `2.3 cm`
    * **Vernier Coincidence (VSD):** `4 div`
    * **Observed Reading:** `2.37 cm` (MSR + VSD × LC + Zero Error)
    * **Corrected Reading:** `2.34 cm`

### 2. Teacher AI Studio (`http://localhost:3000/teacher/agent-builder`)
* Click the suggestion prompt chip: **"+ Build a Hooke's Law Mass-Spring experiment"**.
* Observe the AI Assistant generating the response and hot-reloading the **Hooke's Law Mass-Spring System** in the right-hand preview pane.
* Adjust the **Hanging Mass m** slider to see the spring stretch dynamically on the scale.

### 3. Teacher Dashboard & Verification Sandbox (`http://localhost:3000/teacher`)
* View real-time class engagement KPIs and common student misconception flags in the **Analytics Overview** card.
* Click **Inspect Sandbox & Verify →** on *Simple Pendulum*.
* Inspect the step instructions, ground-truth answer formula (`2.01s`), and tolerance percentage ($\pm 5\%$).
* Click **Approve & Release to Students** to publish the lab and receive a student access code (e.g., `PHYS-8492`).

### 4. Student Lab Runner & Universal Grapher (`http://localhost:3000/student/lab/pendulum-101`)
* **Log Trials:**
  * Set string length $L = 0.4\text{ m}$, click **+ Log Current Trial**.
  * Set string length $L = 0.8\text{ m}$, click **+ Log Current Trial**.
  * Set string length $L = 1.2\text{ m}$, click **+ Log Current Trial**.
* **View Scatter Plot & Regression Line:**
  * View the **Universal Data Grapher** plotting $L$ vs $T^2$, rendering the red linear regression trendline, and extracting **Acceleration due to gravity $g = 9.81\text{ m/s}^2$**.
* **Verify Answer & Unlock Sticker:**
  * Under *Guided Step Checkpoint*, type `2.01` and click **Verify Answer**.
  * Experience the **"Galileo's Heir" Sticker Badge Unlock Modal**!
  * Click **View Sticker Album & Badges** (`/student/rewards`) to inspect your earned badge gallery.

---

## 🧪 Running Automated QA Suite

Run the full automated test pipeline:
```bash
npm run lint         # ESLint check (0 warnings)
npm run typecheck    # TypeScript strict check (0 errors)
npm run test         # Vitest suite (50/50 tests passing)
```
