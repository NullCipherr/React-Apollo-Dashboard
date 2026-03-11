<div align="center">
  <h1>🚀 Apollo 11 Interactive Simulator</h1>
  <p><i>A professional Mission Control Dashboard for real-time lunar mission simulation</i></p>

  <p>
    <img src="https://img.shields.io/badge/React-19.2-cyan?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 🛰️ Overview

The **Apollo 11 Interactive Simulator** is a high-fidelity web application that allows users to monitor and control a simulated lunar mission from a modern Mission Control interface. Combining accurate physics equations (orbital mechanics, thrust-to-weight ratios, and fuel mass flow) with a premium "cyberpunk" aesthetic, it provides an educational and visually stunning experience of the historic journey to the Moon.

## ✨ Key Features

- **Real-Time Physics Engine**: 
  - Dynamic calculations for gravity, acceleration, and velocity based on Earth's mass.
  - Multi-stage Saturn V rocket simulation (S-IC, S-II, and S-IVB) with realistic dry/fuel mass and thrust values.
- **Mission Control Dashboard**:
  - **Orbital Status**: Track altitude and orbital velocity in real-time.
  - **Propulsion Systems**: Monitor engine thrust, fuel consumption (kg/s), and active stage data.
  - **Environment Monitoring**: Vital signs of the lunar module including internal temperature, pressure, and radiation levels.
  - **Power Management**: Control main and reserve energy grids.
- **Interactive Controls**:
  - **Time Compression**: Accelerate or decelerate the simulation speed (up to 128x).
  - **Phase Management**: Manually advance through mission phases (Launch, Orbit, Transit, Landing).
  - **Emergency System**: Manual emergency abort and critical system alerts.
- **Modern UI/UX**:
  - Fully responsive design optimized for high-performance dashboards.
  - Premium typography and Lucide-inspired micro-interactions.

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (PostCSS configuration)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Deployment**: [GitHub Actions](https://github.com/features/actions) for automated GitHub Pages hosting.

## 📂 Project Structure

Following the best practices for scalable React applications:

```text
src/
├── assets/      # Media files and static assets
├── components/  # Modular UI components (Dashboard, Controls, Gauges)
├── constants/   # Mission data, physics constants, and rocket specs
├── styles/      # Global CSS and Tailwind configurations
├── types/       # TypeScript interfaces and mission enums
├── App.tsx      # Main application and simulation logic
└── main.tsx     # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NullCipherr/React-Apollo-Dashboard.git
   cd React-Apollo-Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`.

## 🚢 Deployment

This project is configured for **Continuous Deployment** via GitHub Actions. Every push to the `main` branch automatically builds the production bundle and deploys it to GitHub Pages.

Check the `vite.config.ts` for the relative base path configuration (`base: './'`).

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/NullCipherr">NullCipherr</a></p>
</div>
