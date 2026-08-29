import React from "react";
import { VisualPrimitive } from "@/types/upr";

interface PrimitiveRendererProps {
  primitive: VisualPrimitive;
  evalContext: Record<string, number>;
}

export const PrimitiveRenderer: React.FC<PrimitiveRendererProps> = ({
  primitive,
  evalContext,
}) => {
  const getNum = (expr: string, fallback = 0): number => {
    if (!expr) return fallback;
    const parsed = parseFloat(expr);
    if (!isNaN(parsed)) return parsed;
    return evalContext[expr] ?? fallback;
  };

  const x = getNum(primitive.xExpression, 0);
  const y = getNum(primitive.yExpression, 0);
  const rotation = primitive.rotationExpression ? getNum(primitive.rotationExpression, 0) : 0;
  const size = primitive.sizeExpression ? getNum(primitive.sizeExpression, 1) : 1;

  switch (primitive.type) {
    case "ruler":
    case "scale": {
      const length = (primitive.properties?.length as number) || 300;
      const ticks = Math.floor(length / 10);
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
          {/* Scale Body */}
          <rect
            x="0"
            y="0"
            width={length}
            height="30"
            fill="#f1f5f9"
            stroke="#475569"
            strokeWidth="1.5"
            rx="4"
          />
          {/* Ticks */}
          {Array.from({ length: ticks + 1 }).map((_, i) => {
            const tx = i * 10;
            const isMajor = i % 5 === 0;
            return (
              <g key={i}>
                <line
                  x1={tx}
                  y1="0"
                  x2={tx}
                  y2={isMajor ? 14 : 8}
                  stroke="#334155"
                  strokeWidth={isMajor ? 1.5 : 1}
                />
                {isMajor && (
                  <text
                    x={tx}
                    y="24"
                    fontSize="9"
                    fill="#334155"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {i / 10}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      );
    }

    case "pointer": {
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
          {/* Vernier Jaw / Pointer */}
          <polygon points="0,0 -8,-20 8,-20" fill="#0284c7" />
          <line x1="0" y1="0" x2="0" y2="35" stroke="#0284c7" strokeWidth="2.5" />
          {primitive.properties?.label && (
            <text
              x="0"
              y="-25"
              fontSize="10"
              fill="#0369a1"
              fontWeight="bold"
              textAnchor="middle"
            >
              {String(primitive.properties.label)}
            </text>
          )}
        </g>
      );
    }

    case "bob": {
      const rawRadiusProp = primitive.properties?.radius;
      const radius = typeof rawRadiusProp === "number" ? rawRadiusProp : getNum(rawRadiusProp as string, 16);
      const anchorX = (primitive.properties?.anchorX as number) || 150;
      const anchorY = (primitive.properties?.anchorY as number) || 15;
      return (
        <g transform={`scale(${size})`} data-testid="pendulum-setup">
          {/* Fixed Support Stand & Rigid Ceiling Clamp */}
          <g data-testid="fixed-support-stand">
            {/* Top Mounting Plate / Rigid Support Bar */}
            <rect x={anchorX - 35} y={anchorY - 10} width="70" height="8" fill="#334155" rx="2" stroke="#1e293b" strokeWidth="1" />
            {/* Diagonal Hatch Lines for Rigid Mounting */}
            <line x1={anchorX - 25} y1={anchorY - 10} x2={anchorX - 20} y2={anchorY - 15} stroke="#64748b" strokeWidth="1.5" />
            <line x1={anchorX - 10} y1={anchorY - 10} x2={anchorX - 5} y2={anchorY - 15} stroke="#64748b" strokeWidth="1.5" />
            <line x1={anchorX + 5} y1={anchorY - 10} x2={anchorX + 10} y2={anchorY - 15} stroke="#64748b" strokeWidth="1.5" />
            <line x1={anchorX + 20} y1={anchorY - 10} x2={anchorX + 25} y2={anchorY - 15} stroke="#64748b" strokeWidth="1.5" />
            {/* Pivot Clamp Knob */}
            <circle cx={anchorX} cy={anchorY} r="4.5" fill="#0284c7" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Solid Pendulum String */}
          <line
            data-testid="pendulum-string"
            x1={anchorX}
            y1={anchorY}
            x2={x}
            y2={y}
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* Pendulum Bob */}
          <g data-testid="pendulum-bob">
            <circle
              cx={x}
              cy={y}
              r={radius}
              fill="url(#bobGradient)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <circle cx={x - radius / 3} cy={y - radius / 3} r={radius / 4} fill="#ffffff" opacity="0.6" />
          </g>
        </g>
      );
    }

    case "lens": {
      return (
        <g transform={`translate(${x}, ${y})`}>
          {/* Optical Axis */}
          <line x1="-180" y1="0" x2="180" y2="0" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
          {/* Convex Lens Body */}
          <path
            d="M 0 -50 Q 15 0 0 50 Q -15 0 0 -50 Z"
            fill="#38bdf8"
            fillOpacity="0.35"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <text x="0" y="-60" fontSize="11" fill="#0284c7" fontWeight="bold" textAnchor="middle">
            Convex Lens
          </text>
        </g>
      );
    }

    case "digital_display": {
      const label = primitive.properties?.label ? String(primitive.properties.label) : "Readout";
      const value = primitive.properties?.value !== undefined ? String(primitive.properties.value) : "0.00";
      return (
        <g transform={`translate(${x}, ${y})`}>
          <rect x="0" y="0" width="120" height="50" fill="#0f172a" rx="6" stroke="#334155" strokeWidth="2" />
          <text x="10" y="18" fontSize="10" fill="#94a3b8" fontWeight="500">
            {label}
          </text>
          <text x="110" y="38" fontSize="18" fill="#38bdf8" fontFamily="monospace" fontWeight="bold" textAnchor="end">
            {value}
          </text>
        </g>
      );
    }

    case "circuit_wire": {
      return (
        <g transform={`translate(${x}, ${y})`}>
          {/* Outer Circuit Rect */}
          <rect x="20" y="20" width="260" height="120" fill="none" stroke="#475569" strokeWidth="3" rx="8" />
          {/* Resistor */}
          <rect x="110" y="10" width="80" height="20" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" rx="4" />
          <text x="150" y="24" fontSize="10" fill="#0284c7" fontWeight="bold" textAnchor="middle">
            Resistor (R)
          </text>
          {/* Battery */}
          <line x1="140" y1="130" x2="140" y2="150" stroke="#ef4444" strokeWidth="4" />
          <line x1="160" y1="135" x2="160" y2="145" stroke="#3b82f6" strokeWidth="4" />
        </g>
      );
    }

    case "vernier_caliper": {
      const scaleFactor = (primitive.properties?.scaleFactor as number) || 25; // px per cm
      const jawGap = Math.max(0, getNum(primitive.properties?.gapExpression as string, 2.34) * scaleFactor);
      
      const selectedObjNum = evalContext.object_type_select;
      const objectType = selectedObjNum === 2 ? "cylinder" : selectedObjNum === 3 ? "block" : (primitive.properties?.objectType as string) || "sphere";
      const objectLabel = selectedObjNum === 2 ? "Solid Cylinder" : selectedObjNum === 3 ? "Rectangular Block" : (primitive.properties?.objectLabel as string) || "Steel Sphere";

      const originX = 50;
      const originY = 40;
      const beamLength = 320;
      const jawX = originX + jawGap;

      return (
        <g transform={`translate(${x}, ${y})`} data-testid="vernier-caliper-instrument">
          {/* Main Beam / Main Scale */}
          <rect
            x={originX}
            y={originY}
            width={beamLength}
            height="26"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Main Scale Graduations (0 to 10 cm) */}
          {Array.from({ length: 11 }).map((_, cm) => {
            const cx = originX + cm * scaleFactor;
            return (
              <g key={cm}>
                <line x1={cx} y1={originY} x2={cx} y2={originY + 12} stroke="#334155" strokeWidth="1.2" />
                <text x={cx} y={originY + 20} fontSize="8" fill="#334155" textAnchor="middle" fontWeight="bold">
                  {cm}
                </text>
                {/* 0.5 cm sub-ticks */}
                {cm < 10 && (
                  <line
                    x1={cx + scaleFactor * 0.5}
                    y1={originY}
                    x2={cx + scaleFactor * 0.5}
                    y2={originY + 7}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Fixed Left Jaw (Outside & Inside Measuring Jaws) */}
          <path
            d={`M ${originX} ${originY} 
               L ${originX - 18} ${originY + 90} 
               L ${originX} ${originY + 90} 
               L ${originX} ${originY + 26} Z`}
            fill="#cbd5e1"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Upper Fixed Inside Jaw */}
          <path
            d={`M ${originX} ${originY} 
               L ${originX - 12} ${originY - 30} 
               L ${originX} ${originY - 30} Z`}
            fill="#cbd5e1"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Measured Clamped Object */}
          {jawGap > 0 && (
            <g data-testid="clamped-object">
              {objectType === "sphere" ? (
                <circle
                  cx={originX + jawGap / 2}
                  cy={originY + 58}
                  r={Math.min(38, jawGap / 2)}
                  fill="#f59e0b"
                  fillOpacity="0.85"
                  stroke="#d97706"
                  strokeWidth="2"
                />
              ) : objectType === "cylinder" ? (
                <rect
                  x={originX}
                  y={originY + 28}
                  width={jawGap}
                  height="60"
                  fill="#10b981"
                  fillOpacity="0.8"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="6"
                />
              ) : (
                <rect
                  x={originX}
                  y={originY + 28}
                  width={jawGap}
                  height="60"
                  fill="#8b5cf6"
                  fillOpacity="0.8"
                  stroke="#7c3aed"
                  strokeWidth="2"
                  rx="2"
                />
              )}
              <text
                x={originX + jawGap / 2}
                y={originY + 62}
                fontSize="10"
                fill="#0f172a"
                fontWeight="bold"
                textAnchor="middle"
              >
                {objectLabel}
              </text>
            </g>
          )}

          {/* Sliding Vernier Frame & Moving Right Jaw */}
          <g transform={`translate(${jawX}, 0)`} data-testid="vernier-sliding-jaw">
            {/* Lower Moving Outside Jaw */}
            <path
              d={`M 0 ${originY} 
                 L 18 ${originY + 90} 
                 L 0 ${originY + 90} 
                 L 0 ${originY + 26} Z`}
              fill="#0284c7"
              fillOpacity="0.85"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            {/* Upper Moving Inside Jaw */}
            <path
              d={`M 0 ${originY} 
                 L 12 ${originY - 30} 
                 L 0 ${originY - 30} Z`}
              fill="#0284c7"
              fillOpacity="0.85"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            {/* Vernier Scale Window Frame */}
            <rect
              x="0"
              y={originY - 4}
              width={scaleFactor * 1.2}
              height="34"
              fill="#0284c7"
              fillOpacity="0.25"
              stroke="#0284c7"
              strokeWidth="2"
              rx="3"
            />
            {/* Vernier Scale Division Lines (0 to 10 VSD) */}
            {Array.from({ length: 11 }).map((_, vsd) => {
              const vx = (vsd * scaleFactor * 0.9) / 10;
              return (
                <line
                  key={vsd}
                  x1={vx}
                  y1={originY + 12}
                  x2={vx}
                  y2={originY + 24}
                  stroke="#0369a1"
                  strokeWidth="1.2"
                />
              );
            })}
            <text x={scaleFactor * 0.6} y={originY - 8} fontSize="9" fill="#0284c7" fontWeight="bold" textAnchor="middle">
              Vernier Scale
            </text>
          </g>
        </g>
      );
    }

    default:
      return null;
  }
};
