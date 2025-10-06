import React from "react";
import ImportCSV from "../imp/exp/import";
import { exportall } from "../api";

interface NodeControlsProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onDeleteEdge: () => void;
  onSaveCsv: () => void;

  onForceLayout: () => void;
  onHierarchicalLayout: () => void;
  onCircularLayout: () => void;

  nodeName: string;
  setNodeName: (name: string) => void;
  search:(query:string)=>void;
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
  onHierarchicalLayout,
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
    if(value==="circuler")onCircularLayout();
  };


  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "import") {

      document.getElementById("importBtn")?.click();
    }
    if (value === "export") exportall();
    if (value === "save") onSaveCsv();


  };



  // const nodesChange=(e :React.ChangeEvent<HTMLSelectElement>)=>{
  //   const value=e.target.value;
  //     if(value==="AddNode")onAddNode();
  //     if(value==="DeleteNode")onDeleteNode();
  //     if(value==="DeleteEdge")onDeleteEdge();

  //   };

  return (
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>

      <button onClick={onAddNode}>AddNode</button>
      <button onClick={onDeleteNode}>DeleteNode</button>
      <button onClick={onDeleteEdge}>DeleteEdge</button>




      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>


      <select defaultValue="" onChange={handleLayoutChange}>
        <option value="force">Force-directed</option>
        <option value="hierarchical">Hierarchical</option>
        <option value="circuler">Circuler</option>
      </select>



      <select defaultValue="" onChange={handleDataChange}>
        <option value="import">Import CSV</option>
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
      type ="text"
      placeholder="Search for the node"
      onChange={(e)=>search(e.target.value)}

      />


      <div style={{ display: "none" }}>
        <ImportCSV
          onImportNodes={onImportNodes}
          onImportEdges={onImportEdges}
        />
        <button id="importBtn">Import Hidden Trigger</button>
      </div>
    </div>
  );
}