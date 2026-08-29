import { UniversalPhysicsSpec } from "@/types/upr";
import { vernierCaliperPreset } from "./vernier";
import { opticsBenchPreset } from "./optics";
import { ohmsLawPreset } from "./ohmsLaw";
import { simplePendulumPreset } from "./pendulum";

export const PRESET_WIDGETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [opticsBenchPreset.id]: opticsBenchPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  opticsBenchPreset,
  ohmsLawPreset,
  simplePendulumPreset,
};
