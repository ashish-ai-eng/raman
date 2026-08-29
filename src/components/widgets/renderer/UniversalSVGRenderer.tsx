import React from "react";
import { DynamicSVGNode } from "@/types/upr";
import { evaluateMath } from "@/lib/engine/evaluator";

interface UniversalSVGRendererProps {
  nodes: DynamicSVGNode[];
  evalContext: Record<string, number>;
}

export const UniversalSVGRenderer: React.FC<UniversalSVGRendererProps> = ({
  nodes,
  evalContext,
}) => {
  const evalAttr = (expr?: string, fallback = 0): number => {
    if (!expr) return fallback;
    const trimmed = expr.trim();
    if (!trimmed) return fallback;

    // Check if expr is a pure static number string (e.g. "100" or "12.5")
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return parseFloat(trimmed);
    }

    // Evaluate complex math expression with variable bindings via AST parser
    try {
      const res = evaluateMath(trimmed, evalContext);
      return isNaN(res) ? fallback : res;
    } catch {
      return fallback;
    }
  };

  const renderNode = (node: DynamicSVGNode): React.ReactNode => {
    const { id, tag, attrs, children } = node;

    switch (tag) {
      case "rect":
        return (
          <rect
            key={id}
            id={id}
            x={evalAttr(attrs.x, 0)}
            y={evalAttr(attrs.y, 0)}
            width={evalAttr(attrs.width, 100)}
            height={evalAttr(attrs.height, 50)}
            rx={evalAttr(attrs.rx, 0)}
            fill={attrs.fill || "#0284c7"}
            stroke={attrs.stroke || "none"}
            strokeWidth={evalAttr(attrs.strokeWidth, 0)}
            transform={attrs.transform}
          />
        );

      case "circle":
        return (
          <circle
            key={id}
            id={id}
            cx={evalAttr(attrs.cx, 0)}
            cy={evalAttr(attrs.cy, 0)}
            r={evalAttr(attrs.r, 10)}
            fill={attrs.fill || "#38bdf8"}
            stroke={attrs.stroke || "none"}
            strokeWidth={evalAttr(attrs.strokeWidth, 0)}
            transform={attrs.transform}
          />
        );

      case "line":
        return (
          <line
            key={id}
            id={id}
            x1={evalAttr(attrs.x1, 0)}
            y1={evalAttr(attrs.y1, 0)}
            x2={evalAttr(attrs.x2, 100)}
            y2={evalAttr(attrs.y2, 100)}
            stroke={attrs.stroke || "#334155"}
            strokeWidth={evalAttr(attrs.strokeWidth, 1.5)}
            transform={attrs.transform}
          />
        );

      case "polygon":
        return (
          <polygon
            key={id}
            id={id}
            points={attrs.points || "0,0 10,10 0,10"}
            fill={attrs.fill || "#0284c7"}
            stroke={attrs.stroke || "none"}
            strokeWidth={evalAttr(attrs.strokeWidth, 0)}
            transform={attrs.transform}
          />
        );

      case "path":
        return (
          <path
            key={id}
            id={id}
            d={attrs.d || "M 0 0 L 100 100"}
            fill={attrs.fill || "none"}
            stroke={attrs.stroke || "#0284c7"}
            strokeWidth={evalAttr(attrs.strokeWidth, 2)}
            transform={attrs.transform}
          />
        );

      case "text":
        return (
          <text
            key={id}
            id={id}
            x={evalAttr(attrs.x, 0)}
            y={evalAttr(attrs.y, 0)}
            fontSize={attrs.fontSize || "12"}
            fill={attrs.fill || "#0f172a"}
            fontWeight={attrs.fontWeight || "bold"}
            textAnchor={(attrs.textAnchor as any) || "start"}
            transform={attrs.transform}
          >
            {attrs.content || ""}
          </text>
        );

      case "g":
        return (
          <g key={id} id={id} transform={attrs.transform}>
            {children?.map((child) => renderNode(child))}
          </g>
        );

      default:
        return null;
    }
  };

  return <>{nodes.map((node) => renderNode(node))}</>;
};
