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
      const rawLensType = evalContext.lens_type ?? evalContext.lensType ?? primitive.properties?.lensTypeExpression ?? 1;
      const lensTypeNum = typeof rawLensType === "number" ? rawLensType : getNum(String(rawLensType), 1);
      const isConvex = lensTypeNum === 1;

      const fMag = Math.abs(evalContext.focal_length_cm ?? evalContext.focalLength ?? 15);
      const uMag = Math.abs(evalContext.object_distance_u_cm ?? evalContext.objectDistanceU ?? 25);
      const ho = Math.abs(evalContext.object_height_ho_cm ?? evalContext.objectHeight ?? 8);

      const signedF = isConvex ? fMag : -fMag;
      const signedU = -uMag;

      const denom = signedU + signedF;
      const atFocus = Math.abs(denom) < 0.0001;
      const signedV = atFocus ? 999999 : (signedU * signedF) / denom;
      const mag = atFocus ? 9999 : signedV / signedU;
      const hi = mag * ho;

      const scale = 7.5; // px per cm
      const originX = 250;
      const originY = 130;

      const objX = originX + signedU * scale; // negative u -> left
      const objY = originY - ho * scale;

      const imgX = atFocus ? 9999 : originX + signedV * scale;
      const imgY = atFocus ? originY : originY - hi * scale;

      const f1X = originX - fMag * scale;
      const f2X = originX + fMag * scale;
      const f1DoubleX = originX - 2 * fMag * scale;
      const f2DoubleX = originX + 2 * fMag * scale;

      return (
        <g transform={`translate(${x}, ${y})`} data-testid="ray-optics-bench">
          {/* Bench Rail Baseline */}
          <rect x="10" y="240" width="480" height="8" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />

          {/* Rail Scale Ticks & Coordinate Labels */}
          {Array.from({ length: 9 }).map((_, i) => {
            const cm = -40 + i * 10;
            const tx = originX + cm * scale;
            if (tx < 15 || tx > 485) return null;
            return (
              <g key={i}>
                <line x1={tx} y1="130" x2={tx} y2="138" stroke="#64748b" strokeWidth="1" />
                <text x={tx} y="253" fontSize="8" fill="#64748b" fontFamily="monospace" textAnchor="middle">
                  {cm}cm
                </text>
              </g>
            );
          })}

          {/* Focal Markers Pins (2F1, F1, O, F2, 2F2) */}
          <g data-testid="focal-markers">
            {/* O (Optical Center) */}
            <circle cx={originX} cy={originY} r="4" fill="#38bdf8" />
            <text x={originX} y={originY + 16} fontSize="10" fill="#38bdf8" fontWeight="bold" textAnchor="middle">
              O (0)
            </text>

            {/* F1 (-f) */}
            {f1X >= 20 && (
              <g>
                <circle cx={f1X} cy={originY} r="3.5" fill="#38bdf8" />
                <text x={f1X} y={originY + 15} fontSize="9" fill="#38bdf8" fontWeight="bold" textAnchor="middle">
                  F1
                </text>
              </g>
            )}

            {/* F2 (+f) */}
            {f2X <= 480 && (
              <g>
                <circle cx={f2X} cy={originY} r="3.5" fill="#38bdf8" />
                <text x={f2X} y={originY + 15} fontSize="9" fill="#38bdf8" fontWeight="bold" textAnchor="middle">
                  F2
                </text>
              </g>
            )}

            {/* 2F1 (-2f) */}
            {f1DoubleX >= 20 && (
              <g>
                <circle cx={f1DoubleX} cy={originY} r="3" fill="#64748b" />
                <text x={f1DoubleX} y={originY + 15} fontSize="8" fill="#94a3b8" textAnchor="middle">
                  2F1
                </text>
              </g>
            )}

            {/* 2F2 (+2f) */}
            {f2DoubleX <= 480 && (
              <g>
                <circle cx={f2DoubleX} cy={originY} r="3" fill="#64748b" />
                <text x={f2DoubleX} y={originY + 15} fontSize="8" fill="#94a3b8" textAnchor="middle">
                  2F2
                </text>
              </g>
            )}
          </g>

          {/* Lens Visual Representation */}
          {isConvex ? (
            /* Convex Double Curved Translucent Geometry */
            <path
              d={`M ${originX} 35 Q ${originX + 16} 130 ${originX} 225 Q ${originX - 16} 130 ${originX} 35 Z`}
              fill="rgba(56, 189, 248, 0.25)"
              stroke="#38bdf8"
              strokeWidth="2"
            />
          ) : (
            /* Concave Hourglass Inner-Curved Geometry */
            <path
              d={`M ${originX - 12} 35 L ${originX + 12} 35 Q ${originX + 2} 130 ${originX + 12} 225 L ${originX - 12} 225 Q ${originX - 2} 130 ${originX - 12} 35 Z`}
              fill="rgba(56, 189, 248, 0.25)"
              stroke="#38bdf8"
              strokeWidth="2"
            />
          )}

          {/* Luminous Object Arrow (Green) */}
          <g data-testid="luminous-object">
            <line x1={objX} y1={originY} x2={objX} y2={objY} stroke="#10b981" strokeWidth="3" />
            <polygon
              points={`${objX},${objY - 6} ${objX - 5},${objY + 2} ${objX + 5},${objY + 2}`}
              fill="#10b981"
            />
            <text x={objX} y={objY - 10} fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">
              Object (ho={ho}cm)
            </text>
          </g>

          {/* Formed Image Arrow (Solid Purple if Real, Dashed Cyan if Virtual) */}
          {!atFocus && imgX >= -100 && imgX <= 800 && (
            <g data-testid="formed-image">
              <line
                x1={imgX}
                y1={originY}
                x2={imgX}
                y2={imgY}
                stroke={signedV > 0 ? "#c084fc" : "#06b6d4"}
                strokeWidth="3"
                strokeDasharray={signedV > 0 ? undefined : "4,4"}
              />
              <polygon
                points={
                  signedV > 0
                    ? `${imgX},${imgY + 6} ${imgX - 5},${imgY - 2} ${imgX + 5},${imgY - 2}`
                    : `${imgX},${imgY - 6} ${imgX - 5},${imgY + 2} ${imgX + 5},${imgY + 2}`
                }
                fill={signedV > 0 ? "#c084fc" : "#06b6d4"}
              />
              <text
                x={imgX}
                y={signedV > 0 ? imgY + 16 : imgY - 10}
                fontSize="9"
                fill={signedV > 0 ? "#c084fc" : "#06b6d4"}
                fontWeight="bold"
                textAnchor="middle"
              >
                {signedV > 0 ? `Real Image (v=${signedV.toFixed(1)}cm)` : `Virtual Image (v=${signedV.toFixed(1)}cm)`}
              </text>
            </g>
          )}

          {/* 3 Geometric Principal Rays */}
          {!atFocus && (
            <g data-testid="principal-rays">
              {/* Ray 1 (Gold #eab308): Parallel to axis -> Refocused through F2 (convex) or diverging from F1 (concave) */}
              <line x1={objX} y1={objY} x2={originX} y2={objY} stroke="#eab308" strokeWidth="1.8" />
              {isConvex ? (
                <line x1={originX} y1={objY} x2={originX + 250} y2={objY + (originY - objY) * (250 / fMag)} stroke="#eab308" strokeWidth="1.8" />
              ) : (
                <g>
                  <line x1={originX} y1={objY} x2={originX + 250} y2={objY - (originY - objY) * (250 / fMag)} stroke="#eab308" strokeWidth="1.8" />
                  <line x1={originX} y1={objY} x2={f1X} y2={originY} stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                </g>
              )}

              {/* Ray 2 (Rose #f43f5e): Straight through Optical Center O */}
              <line x1={objX} y1={objY} x2={originX + 220} y2={originY + (originY - objY) * (220 / (originX - objX))} stroke="#f43f5e" strokeWidth="1.8" />

              {/* Ray 3 (Cyan #06b6d4): Through F1 to lens -> emerges parallel */}
              {isConvex && (
                <g>
                  <line x1={objX} y1={objY} x2={originX} y2={originY + (objY - originY) * (fMag / (uMag - fMag))} stroke="#06b6d4" strokeWidth="1.8" />
                  <line x1={originX} y1={originY + (objY - originY) * (fMag / (uMag - fMag))} x2={originX + 220} y2={originY + (objY - originY) * (fMag / (uMag - fMag))} stroke="#06b6d4" strokeWidth="1.8" />
                </g>
              )}

              {/* Virtual Backward Extensions (Dashed Cyan) when image is virtual (v < 0) */}
              {signedV < 0 && (
                <line x1={imgX} y1={imgY} x2={originX} y2={objY} stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3,3" />
              )}
            </g>
          )}
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
      
      const selectedObjNum = evalContext.specimen_selection ?? evalContext.object_type_select ?? 1;
      let objectType: "sphere" | "cylinder" | "block" | "coin" | "pipe" = "sphere";
      let objectLabel = "Steel Sphere";

      if (selectedObjNum === 2) {
        objectType = "cylinder";
        objectLabel = "Brass Cylinder";
      } else if (selectedObjNum === 3) {
        objectType = "block";
        objectLabel = "Aluminum Block";
      } else if (selectedObjNum === 4) {
        objectType = "coin";
        objectLabel = "Bronze Coin";
      } else if (selectedObjNum === 5) {
        objectType = "pipe";
        objectLabel = "Copper Pipe";
      }

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

          {/* Main Scale Graduations (0 to 10 cm with 1 mm ticks and cm labels) */}
          {Array.from({ length: 101 }).map((_, mm) => {
            const cx = originX + (mm / 10) * scaleFactor;
            const isCm = mm % 10 === 0;
            const isHalfCm = mm % 5 === 0 && !isCm;
            const tickHeight = isCm ? 12 : isHalfCm ? 8 : 5;
            const strokeWidth = isCm ? "1.2" : "0.8";

            return (
              <g key={mm}>
                <line
                  x1={cx}
                  y1={originY}
                  x2={cx}
                  y2={originY + tickHeight}
                  stroke="#334155"
                  strokeWidth={strokeWidth}
                />
                {isCm && (
                  <text
                    x={cx}
                    y={originY + 20}
                    fontSize="8"
                    fill="#334155"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {mm / 10} cm
                  </text>
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
              ) : objectType === "block" ? (
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
              ) : objectType === "coin" ? (
                <ellipse
                  cx={originX + jawGap / 2}
                  cy={originY + 58}
                  rx={jawGap / 2}
                  ry={Math.min(30, jawGap / 2)}
                  fill="#eab308"
                  fillOpacity="0.9"
                  stroke="#ca8a04"
                  strokeWidth="2"
                />
              ) : (
                /* pipe / hollow cylinder */
                <g>
                  <rect
                    x={originX}
                    y={originY + 28}
                    width={jawGap}
                    height="60"
                    fill="#3b82f6"
                    fillOpacity="0.75"
                    stroke="#2563eb"
                    strokeWidth="2"
                    rx="4"
                  />
                  {jawGap > 10 && (
                    <rect
                      x={originX + 5}
                      y={originY + 34}
                      width={jawGap - 10}
                      height="48"
                      fill="#0f172a"
                      fillOpacity="0.9"
                      rx="2"
                    />
                  )}
                </g>
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
