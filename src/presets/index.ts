import { UniversalPhysicsSpec } from "@/types/upr";
import { vernierCaliperPreset } from "./vernierCaliper";
import { pendulumPreset } from "./pendulum";
import { ohmsLawPreset } from "./ohmsLaw";

export const CORE_EXPERIMENTAL_PRESETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [pendulumPreset.id]: pendulumPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  pendulumPreset,
  ohmsLawPreset,
};
