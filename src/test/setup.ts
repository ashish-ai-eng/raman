import "@testing-library/jest-dom";

// Mock ResizeObserver for Recharts ResponsiveContainer in JSDOM testing
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
