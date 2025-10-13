import React from "react";
import ImportCSV from "../imp/exp/import";
import { exportall } from "../api";
import "./NodeCantrol.css"

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

onEditEdgeWeight:()=>void;
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
  onEditEdgeWeight,
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

    if (value === "hierarchical") onHierarchicalLayout();
    if (value === "circuler") onCircularLayout();
    if (value === "force") onForceLayout();
    if (value === "gridlayout") onGridLayout();
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "export") exportall();
    if (value === "save") onSaveCsv();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <span className="toolbar-title">🔧 Edit</span>
        <button onClick={onAddNode}>＋ Node</button>
        <button onClick={onDeleteNode}>🗑️ Node</button>
        <button onClick={onDeleteEdge}>🗑️ Edge</button>
        <button onClick={onEditEdgeWeight}>⚖️ Change Weight</button>
      </div>

      <div className="toolbar-section">
        <span className="toolbar-title">↩️ History</span>
        <button onClick={onUndo}>Undo</button>
        <button onClick={onRedo}>Redo</button>
      </div>

      <div className="toolbar-section">
        <span className="toolbar-title">🧭 Layout</span>
        <select defaultValue="" onChange={(e) => {
          const v = e.target.value;
          if (v === "hierarchical") onHierarchicalLayout();
          if (v === "circuler") onCircularLayout();
          if (v === "force") onForceLayout();
          if (v === "gridlayout") onGridLayout();
          e.currentTarget.selectedIndex = 0;
        }}>
          <option value="" disabled>...</option>
          <option value="force">Force-directed</option>
          <option value="hierarchical">Hierarchical</option>
          <option value="circuler">Circular</option>
          <option value="gridlayout">Grid</option>
        </select>
      </div>

      <div className="toolbar-section">
        <span className="toolbar-title">📊 Data</span>
        <select defaultValue="" onChange={(e) => {
          const v = e.target.value;
          if (v === "export") exportall();
          if (v === "save") onSaveCsv();
          e.currentTarget.selectedIndex = 0;
        }}>
          <option value="" disabled>Choose Action...</option>
          <option value="save">💾 Save CSV → DB</option>
          <option value="export">⬇️ Export CSV</option>
        </select>
        <ImportCSV onImportNodes={onImportNodes} onImportEdges={onImportEdges} />
      </div>

      <div className="toolbar-section">
        <span className="toolbar-title">🔍 Tools</span>
        <button onClick={onShortestPath}>🧮 Shortest Path</button>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Node name..."
        />
        <input
          type="text"
          placeholder="Search nodes..."
          onChange={(e) => search(e.target.value)}
        />
      </div>

     
    </div>
  );
}
