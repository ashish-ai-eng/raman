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
      const radius = (primitive.properties?.radius as number) || 16;
      const anchorX = 150;
      const anchorY = 20;
      return (
        <g transform={`scale(${size})`}>
          {/* String */}
          <line
            x1={anchorX}
            y1={anchorY}
            x2={x}
            y2={y}
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Pendulum Bob */}
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

    default:
      return null;
  }
};
