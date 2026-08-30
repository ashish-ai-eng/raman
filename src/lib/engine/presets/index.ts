import { UniversalPhysicsSpec } from "@/types/upr";
import {
  vernierCaliperPreset,
  pendulumPreset as simplePendulumPreset,
  ohmsLawPreset,
} from "@/presets";

export const PRESET_WIDGETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [simplePendulumPreset.id]: simplePendulumPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  simplePendulumPreset,
  ohmsLawPreset,
};
