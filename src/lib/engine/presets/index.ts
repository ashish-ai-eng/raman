import { UniversalPhysicsSpec } from "@/types/upr";
import {
  vernierCaliperPreset,
  screwGaugePreset,
  newtonsLawsPreset,
  pendulumPreset as simplePendulumPreset,
  rayOpticsPreset as opticsBenchPreset,
  ohmsLawPreset,
} from "@/presets";

export const PRESET_WIDGETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [screwGaugePreset.id]: screwGaugePreset,
  [newtonsLawsPreset.id]: newtonsLawsPreset,
  [simplePendulumPreset.id]: simplePendulumPreset,
  [opticsBenchPreset.id]: opticsBenchPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  screwGaugePreset,
  newtonsLawsPreset,
  simplePendulumPreset,
  opticsBenchPreset,
  ohmsLawPreset,
};
