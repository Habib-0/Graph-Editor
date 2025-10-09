import React from "react";
import ImportCSV from "../imp/exp/import";
import { exportall } from "../api";

interface NodeControlsProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onDeleteEdge: () => void;
  onSaveCsv: () => void;
  onShortestPath: () => void;
  onForceLayout: () => void;
  onHierarchicalLayout: () => void;
  onCircularLayout: () => void;
  onGridLayout: () => void;

  nodeName: string;
  setNodeName: (name: string) => void;
  search: (query: string) => void;
  onImportNodes: (nodes: any[]) => void;
  onImportEdges?: (edges: any[]) => void;

  onUndo: () => void;
  onRedo: () => void;
}

export default function NodeControls({
  onAddNode,
  onDeleteNode,
  onDeleteEdge,
  onSaveCsv,
  nodeName,
  setNodeName,
  onShortestPath,
  onHierarchicalLayout,
  onGridLayout,
  onImportNodes,
  onImportEdges,
  onForceLayout,
  onCircularLayout,
  search,
  onUndo,
  onRedo,
}: NodeControlsProps) {
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "force") onForceLayout();
    if (value === "hierarchical") onHierarchicalLayout();
    if (value === "circuler") onCircularLayout();
    if (value === "gridlayout") onGridLayout();
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "export") exportall();
    if (value === "save") onSaveCsv();
  };

  return (
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
      <button onClick={onAddNode}>Add Node</button>
      <button onClick={onDeleteNode}>Delete Node</button>
      <button onClick={onDeleteEdge}>Delete Edge</button>

      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>

      <select defaultValue="" onChange={handleLayoutChange}>
        <option value="force">Force-directed</option>
        <option value="hierarchical">Hierarchical</option>
        <option value="circuler">Circular</option>
        <option value="gridlayout">Grid</option>
      </select>

      <button onClick={onShortestPath}>Shortest Path</button>

      <select defaultValue="" onChange={handleDataChange}>
        <option value="export">Export Nodes + Edges</option>
        <option value="save">Save CSV to Database</option>
      </select>

      <input
        type="text"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        placeholder="Write name of the node"
      />

      <input
        type="text"
        placeholder="Search for the node"
        onChange={(e) => search(e.target.value)}
      />

      <ImportCSV onImportNodes={onImportNodes} onImportEdges={onImportEdges} />
    </div>
  );
}
