import React, { useState, useEffect } from "react";
import ImportCSV from "../imp/exp/import";
import { exportall, exportGraphML, exportGraphAsPNG } from "../api";
import "./NodeCantrol.css";

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
  onEditEdgeWeight: (newWeight: number) => void;
  onEditNodeName: (newName: string) => void;

  shortestPathText?: string;
  nodeName: string;
  setNodeName: (name: string) => void;
  search: (query: string) => void;
  onImportNodes: (nodes: any[]) => void;
  onImportEdges?: (edges: any[]) => void;
  onUndo: () => void;
  onRedo: () => void;
  nodes: any[];
  edges: any[];
  onDegreeAnalysis: () => void;
  onPageRankAnalysis: () => void;
  analyticsResult?: { title: string; data: any[] } | null;
}

export default function NodeControls({
  onAddNode,
  onDeleteNode,
  onDeleteEdge,
  onSaveCsv,
  nodeName,
  setNodeName,
  onEditEdgeWeight,
  onEditNodeName,
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
  nodes,
  edges,
  onDegreeAnalysis,
  onPageRankAnalysis,
  shortestPathText,
  analyticsResult,
}: NodeControlsProps) {
  const [newWeight, setNewWeight] = useState("");
  const [weightChangeMode, setWeightChangeMode] = useState(false);

  const [newNodeName, setNewNodeName] = useState("");
  const [nodeRenameMode, setNodeRenameMode] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="toolbar">
      {shortestPathText && (
        <div className="shortest-path-box">
          <h4>Shortest Path</h4>
          <p>{shortestPathText}</p>
        </div>
      )}

      
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("edit")}>
          Edit {openMenu === "edit" ? "▲" : "▼"}
        </button>

        {openMenu === "edit" && (
          <div className="menu-content">
            <button onClick={onAddNode}>＋ Add Node</button>
            <button onClick={onDeleteNode}>🗑️ Delete Node</button>
            <button onClick={onDeleteEdge}>✂️ Delete Edge</button>

            {}
            <button onClick={() => setWeightChangeMode(!weightChangeMode)}>
              {weightChangeMode ? "Cancel Weight Change" : "Change Edge Weight"}
            </button>

            {weightChangeMode && (
              <div className="weight-change-box">
                <input
                  type="number"
                  placeholder="Enter new weight"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
                <button
                  onClick={() => {
                    const weight = parseFloat(newWeight);
                    if (!isNaN(weight) && weight >= 0) {
                      onEditEdgeWeight(weight);
                      setNewWeight("");
                      setWeightChangeMode(false);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}


            <button onClick={() => setNodeRenameMode(!nodeRenameMode)}>
              {nodeRenameMode ? "Cancel Rename" : "Change Node Name"}
            </button>

            {nodeRenameMode && (
              <div className="node-rename-box">
                <input
                  type="text"
                  placeholder="Enter new name..."
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (newNodeName.trim()) {
                      onEditNodeName(newNodeName.trim());
                      setNewNodeName("");
                      setNodeRenameMode(false);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {}
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("history")}>
          ↩ History {openMenu === "history" ? "▲" : "▼"}
        </button>
        {openMenu === "history" && (
          <div className="menu-content">
            <button onClick={onUndo}>Undo</button>
            <button onClick={onRedo}>Redo</button>
          </div>
        )}
      </div>

      {}
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("layout")}>
          Layout {openMenu === "layout" ? "▲" : "▼"}
        </button>
        {openMenu === "layout" && (
          <div className="menu-content scrollable">
            <button onClick={onForceLayout}>Force-directed</button>
            <button onClick={onHierarchicalLayout}>Hierarchical</button>
            <button onClick={onCircularLayout}>Circular</button>
            <button onClick={onGridLayout}>Grid</button>
          </div>
        )}
      </div>

      {}
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("data")}>
          Data {openMenu === "data" ? "▲" : "▼"}
        </button>
        {openMenu === "data" && (
          <div className="menu-content scrollable">
            <button onClick={onSaveCsv}>💾 Save CSV → DB</button>
            <button onClick={exportall}>⬇ Export CSV</button>
            <button onClick={() => exportGraphML(nodes, edges)}>🧩 Export GraphML</button>
            <button onClick={exportGraphAsPNG}>🖼 Export PNG</button>
            <ImportCSV onImportNodes={onImportNodes} onImportEdges={onImportEdges} />
          </div>
        )}
      </div>

      {}
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("tools")}>
          Tools {openMenu === "tools" ? "▲" : "▼"}
        </button>
        {openMenu === "tools" && (
          <div className="menu-content">
            <button onClick={onShortestPath}>🛣️ Shortest Path</button>
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
        )}
      </div>

      {}
      <div className="menu">
        <button className="menu-title" onClick={() => toggleMenu("analytics")}>
          Analytics {openMenu === "analytics" ? "▲" : "▼"}
        </button>

        {openMenu === "analytics" && (
          <div className="menu-content scrollable">
            <button onClick={onDegreeAnalysis}>🔹 Degree Centrality</button>
            <button onClick={onPageRankAnalysis}>📊 PageRank</button>

            {analyticsResult && (
              <div className="analysis-box">
                <h4>{analyticsResult.title}</h4>
                <ul>
                  {analyticsResult.data.map((row, i) => (
                    <li key={i}>
                      {Object.entries(row)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" | ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
