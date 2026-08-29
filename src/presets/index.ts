import { UniversalPhysicsSpec } from "@/types/upr";
import { vernierCaliperPreset } from "./vernierCaliper";
import { screwGaugePreset } from "./screwGauge";
import { newtonsLawsPreset } from "./newtonsLaws";
import { pendulumPreset } from "./pendulum";
import { rayOpticsPreset } from "./rayOptics";
import { ohmsLawPreset } from "./ohmsLaw";

export const CORE_EXPERIMENTAL_PRESETS: Record<string, UniversalPhysicsSpec> = {
  [vernierCaliperPreset.id]: vernierCaliperPreset,
  [screwGaugePreset.id]: screwGaugePreset,
  [newtonsLawsPreset.id]: newtonsLawsPreset,
  [pendulumPreset.id]: pendulumPreset,
  [rayOpticsPreset.id]: rayOpticsPreset,
  [ohmsLawPreset.id]: ohmsLawPreset,
};

export {
  vernierCaliperPreset,
  screwGaugePreset,
  newtonsLawsPreset,
  pendulumPreset,
  rayOpticsPreset,
  ohmsLawPreset,
};
