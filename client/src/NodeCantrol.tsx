import React from "react";
import ImportCSV from "./imp/exp/import";
import { exportall } from "./api";



interface NodeControlsProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onDeleteEdge: () => void;
  onSaveCsv: () => void;

  nodeName: string;
  setNodeName: (name: string) => void;
  onImportNodes: (nodes: any[]) => void;
  onImportEdges?: (edges: any[]) => void;
}

export default function NodeControls({
  onAddNode,
  onDeleteNode,
  onDeleteEdge,
  onSaveCsv,

  nodeName,
  setNodeName,
  onImportNodes,
  onImportEdges,
}: NodeControlsProps) {
  return (
    
    <div>
      <button onClick={onAddNode}>Add Node</button>
      <button onClick={onDeleteNode}>Delete Node</button>
      <button onClick={onDeleteEdge}>Delete Edge</button>
      <button onClick={onSaveCsv}>Save CSV to Database</button>
       <button onClick={exportall}>Export Nodes + Edges</button>

      <input
        type="text"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        placeholder="Write name of the node"
      />

      <ImportCSV onImportNodes={onImportNodes} onImportEdges={onImportEdges} />
    </div>
  );
}
