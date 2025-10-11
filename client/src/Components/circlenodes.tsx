import React from "react";
import { Handle, Position } from "@xyflow/react";



export default function CircleNode({ data }: any) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "white",
        border: "3px solid #333",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 10,
        position: "absolute",
        top: 0,
        left: 0,
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.25)",
        overflow: "hidden",
        clipPath: "circle(50%)",
        userSelect: "none",
        pointerEvents: "auto",
      }}
    >
      {data.label}

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", borderRadius: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555", borderRadius: "50%" }}
      />
    </div>
  );
}
