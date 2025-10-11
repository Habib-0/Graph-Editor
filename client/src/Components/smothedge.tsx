import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
} from "@xyflow/react";

export default function SmoothEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,      
  animated,
}: any) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Right,
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Left,
  });

  return (
    <>
      {}
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: "#333",
          strokeWidth: 2,
          strokeDasharray: animated ? "6 4" : "none",
          animation: animated ? "dashmove 3s linear infinite" : "none",
        }}
        markerEnd={markerEnd}
      />

      {}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "white",
              padding: "2px 6px",
              borderRadius: "6px",
              fontSize: "12px",
              border: "1px solid #ccc",
              color: "#111",
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}

      {}
      <style>
        {`
          @keyframes dashmove {
            to {
              stroke-dashoffset: -20;
            }
          }
        `}
      </style>
    </>
  );
}
