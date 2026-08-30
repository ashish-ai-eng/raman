import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Smoke Test & Build Cache Regression", () => {
  it("verifies test suite is functional", () => {
    expect(1 + 1).toBe(2);
  });

  it("verifies .next server build output integrity if present", () => {
    const nextServerDir = path.join(process.cwd(), ".next", "server");
    if (fs.existsSync(nextServerDir)) {
      const manifestPath = path.join(process.cwd(), ".next", "build-manifest.json");
      expect(fs.existsSync(manifestPath)).toBe(true);
    }
  });
});
