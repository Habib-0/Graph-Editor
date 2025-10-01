import { useState, useEffect, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
} from "@xyflow/react";
import type { NodeChange, EdgeChange, Connection, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeControls from "./NodeCantrol";
import * as api from "../api";
import runForceLayout from "../layouts/Forced"
import { useReactFlow } from "@xyflow/react";
import heriarchal from "../layouts/Heriarchal"


interface Node {
  id: number;
  name: string;
  x: number;
  y: number;
}

export default function Nodes() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [rfNodes, setRfNodes] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");

    const reactFlowInstance = useReactFlow();


  const reloadGraph = async () => {
    const updatedNodes = await api.fetchNodes();
    const updatedEdges = await api.fetchEdges();

    setNodes(updatedNodes);
    setRfNodes(
      updatedNodes.map((n: Node) => ({
        id: `n${n.id}`,
        data: { label: n.name || "NO NAME" },
        position: { x: n.x, y: n.y },
        style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
      }))
    );
    setEdges(
      updatedEdges.map((e: any) => ({
        id: `e${e.edge_id}`,
        source: `n${e.from_node}`,
        target: `n${e.to_node}`,
        label: e.weight?.toString() || "",
      }))
    );
  };

  useEffect(() => {
    reloadGraph();
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setRfNodes((prev) => {
      const updated = applyNodeChanges(changes, prev);
      changes.forEach((c) => {
        if (c.type === "position" && c.position && c.id) {
          const nodeId = parseInt(c.id.replace("n", ""));
          api.saveNodePosition(nodeId, c.position);
        }
      });
      return updated;
    });
  }, []);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((prev) => applyEdgeChanges(changes, prev)),
    []
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((prev) => rfAddEdge(connection, prev));
    api.addEdge(
      parseInt(connection.source!.replace("n", "")),
      parseInt(connection.target!.replace("n", ""))
    );
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <NodeControls
        nodeName={nodeName}
        setNodeName={setNodeName}
        onAddNode={async () => {
          const saved = await api.addNode(nodeName);
          const newNode: Node = {
            id: saved.id,
            name: saved.name,
            x: saved.x,
            y: saved.y,
          };
          setNodes((prev) => [...prev, newNode]);
          setRfNodes((prev) => [
            ...prev,
            {
              id: `n${newNode.id}`,
              data: { label: newNode.name || "NO NAME" },
              position: { x: newNode.x, y: newNode.y },
              style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
            },
          ]);
        }}
        onDeleteNode={async () => {
          if (!selectedNode) return;
          const id = parseInt(selectedNode.replace("n", ""));
          await api.deleteNode(id);
          setRfNodes((prev) => prev.filter((n) => n.id !== `n${id}`));
          setEdges((prev) =>
            prev.filter((e) => e.source !== `n${id}` && e.target !== `n${id}`)
          );
          setSelectedNode(null);
        }}
        onDeleteEdge={async () => {
          if (!selectedEdge) return;
          const id = parseInt(selectedEdge.replace("e", ""));
          await api.deleteEdge(id);
          setEdges((prev) => prev.filter((e) => e.id !== selectedEdge));
          setSelectedEdge(null);
        }}
        onSaveCsv={async () => {
          await api.saveCsvToDB(nodes);
          const edgesToSave = edges.map((e) => ({
            from_node: parseInt(e.source.replace("n", "")),
            to_node: parseInt(e.target.replace("n", "")),
            weight: e.label ? parseInt(e.label) : 0,
            directed: false,
          }));
          await api.saveEdge(edgesToSave);
        }}
        onImportNodes={(csvNodes) => {
          setNodes(csvNodes);
          setRfNodes(
            csvNodes.map((n: Node) => ({
              id: `n${n.id}`,
              data: { label: n.name || "Node" },
              position: { x: n.x, y: n.y },
              style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
            }))
          );
        }}
        onImportEdges={(csvEdges) => {
          setEdges(
            csvEdges.map((e) => ({
              id: `e${e.edge_id}`,
              source: `n${e.from_node}`,
              target: `n${e.to_node}`,
              label: e.weight?.toString() || "",
            }))
          );
        }}

        onUndo={async () => {
          const result = await api.undo();
          console.log("Undo:", result);
          await reloadGraph();
        }}
        onRedo={async () => {
          const result = await api.redo();
          console.log("Redo:", result);
          await reloadGraph();
        }}





onForceLayout={() => {
  runForceLayout(
    nodes,
    edges.map((e) => ({
      source: parseInt(e.source.replace("n", "")),
      target: parseInt(e.target.replace("n", "")),
    })),
    (newPositions) => {
    setRfNodes(
      newPositions.map((n: any) => ({
        id: `n${n.id}`,
        data: { label: n.name || "NO NAME" },
        position: { x: n.x, y: n.y },
        style: {
          backgroundColor: "white",
          border: "2px solid #333",
          color: "black",
        },
      }))
      );


      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 50);
    }
  );
}}




onHierarchicalLayout={() => {
  heriarchal(
    nodes,
    edges,
    (newPositions) => {
      setRfNodes(
        newPositions.map((n: any) => ({
          id: `n${n.id}`,
          data: { label: n.name || "NO NAME" },
          position: { x: n.x, y: n.y },
          style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
        }))
      );
      setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    }, 50);
    }
  );
}}



      />

      <ReactFlow
        nodes={rfNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(_, edge: Edge) => setSelectedEdge(edge.id)}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        fitView
      />
    </div>
  );
}
