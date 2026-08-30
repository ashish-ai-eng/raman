import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/labs/publish/route";

describe("CL 4.3: Lab Approval & Publish State Transition API", () => {
  it("publishes the requested lab without falling back to pendulum lab", async () => {
    const req = new Request("http://localhost/api/labs/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labId: "vernier-201" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.lab.id).toBe("vernier-201");
    expect(data.lab.title).toContain("Vernier Caliper");
    expect(data.lab.status).toBe("published");
    expect(data.accessCode).toMatch(/^PHYS-\d{4}$/);
  });

  it("returns 404 for non-existent labId instead of defaulting to pendulum lab", async () => {
    const req = new Request("http://localhost/api/labs/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labId: "non-existent-lab" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Lab with ID 'non-existent-lab' not found.");
  });
});
