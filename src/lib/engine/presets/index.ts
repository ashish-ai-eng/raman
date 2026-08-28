import { UniversalPhysicsSpec } from "@/types/upr";
import { vernierCaliperPreset } from "./vernier";
import { simplePendulumPreset } from "./pendulum";
import { opticsBenchPreset } from "./optics";
import { ohmsLawPreset } from "./ohmsLaw";

export const PRESET_WIDGETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [simplePendulumPreset.id]: simplePendulumPreset,
  [opticsBenchPreset.id]: opticsBenchPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  simplePendulumPreset,
  opticsBenchPreset,
  ohmsLawPreset,
};
