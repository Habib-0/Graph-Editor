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
import runForceLayout from "../layouts/Forced";
import { useReactFlow } from "@xyflow/react";
import heriarchal from "../layouts/Heriarchal";
import circularLayout from "../layouts/Circuler";
import gridlayout from "../layouts/Grid";
import { dijkstraWithPath } from "../algoritm/dijkstra";
import SmoothEdge from "./smothedge";
import CircleNode from "./circlenodes";

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
  const [startNode, setStartNode] = useState<number | null>(null);
const [endNode, setEndNode] = useState<number | null>(null);

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
        type: "circle",
        style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
      }))
    );

      setEdges(
        updatedEdges.map((e: any) => ({
          id: `e${e.edge_id}`,
          source: `n${e.from_node}`,
          target: `n${e.to_node}`,
          label: e.weight?.toString() || "",
          type:"smooth",
          markerEnd: undefined,
          animated:false,
        }))
      );



  };

  const edgeTypes = {
  smooth: SmoothEdge,
};
const nodeTypes = {
  circle: CircleNode,
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
  const newEdge = {
    ...connection,
    id: `e${Date.now()}`,
    type: "smooth",
    label: "1",
  };

  setEdges((prev) => [...prev, newEdge]);

  api.addEdge(
    parseInt(connection.source!.replace("n", "")),
    parseInt(connection.target!.replace("n", ""))
  );
}, []);


  const handleSearch = (query: string) => {
    if (!query) {
      setRfNodes(
        nodes.map((n: Node) => ({
          id: `n${n.id}`,
          data: { label: n.name },
          position: { x: n.x, y: n.y },
          type: "circle",

          style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
        }))
      );
      return;
    }

    const filtered = nodes.filter((n) =>
      n.name.toLowerCase().includes(query.toLowerCase())
    );

    setRfNodes(
      filtered.map((n: Node) => ({
        id: `n${n.id}`,
        data: { label: n.name },
        position: { x: n.x, y: n.y },
        type: "circle",
        style: {
          backgroundColor: "#de1010ff",
          border: "3px solid orange",
          color: "black",
        },
      }))
    );
  };


const onShortestPath = () => {
  console.log("onShortestPath called");

  if (!startNode || !endNode) {
    console.warn("choose a node ");
    return;
  }

  const { path } = dijkstraWithPath(nodes, edges, startNode, endNode);
  console.log("Kortaste vägen:", path);

  if (!path || path.length === 0) {
    console.warn("No nodes found !");
    return;
  }


  setRfNodes(prev =>
    prev.map(n => {
      const id = parseInt(n.id.replace("n", ""));
      if (id === startNode)
        return {
          ...n,
          style: {
            ...n.style,
            backgroundColor: "#32cd32",
            border: "3px solid darkgreen",
          },
        };
      if (id === endNode)
        return {
          ...n,
          style: {
            ...n.style,
            backgroundColor: "#dc143c",
            border: "3px solid darkred",
          },
        };
      if (path.includes(id))
        return {
          ...n,
          style: {
            ...n.style,
            backgroundColor: "#ffeb3b",
            border: "3px solid orange",
          },
        };
      return {
        ...n,
        style: {
          ...n.style,
          backgroundColor: "white",
          border: "2px solid #333",
        },
      };
    })
  );


  setEdges(prev =>
    prev.map(e => {
      const from = parseInt(e.source.replace("n", ""));
      const to = parseInt(e.target.replace("n", ""));
      const inPath =
        path.includes(from) &&
        path.includes(to) &&
        Math.abs(path.indexOf(from) - path.indexOf(to)) === 1;

      return inPath
        ? {
            ...e,
            animated: true,
            style: { stroke: "orange", strokeWidth: 3 },
            markerEnd: {
              type: "arrowclosed",
              color: "orange",
              width: 15,
              height: 15,
            },
          }
        : {
            ...e,
            animated: false,
            style: { stroke: "#333", strokeWidth: 1 },
            markerEnd: {
              type: "arrowclosed",
              color: "#333",
              width: 10,
              height: 10,
            },
          };
    })
  );
};


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <NodeControls
        nodeName={nodeName}
        search={handleSearch}
        setNodeName={setNodeName}
        onShortestPath={onShortestPath}


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
              type: "circle",
              style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
            },
          ]);
          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.2 });
          }, 100);
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
              type: "circle",
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
              type: "smooth",

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
          type: "circle",
          style: {
            backgroundColor: "white",
            border: "2px solid #333",
            color: "black",
          },
        }))
      );


      setEdges((prev) =>
        prev.map((e) => ({
          ...e,
          type: "smooth",
          animated: true,
          markerEnd: { type: "arrowclosed", color: "#333", width: 20, height: 20 },
          style: { stroke: "#333", strokeWidth: 2 },
        }))
      );

      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
    }
  );
}}


onHierarchicalLayout={() => {
  heriarchal(nodes, edges, (newPositions) => {
    setRfNodes(
      newPositions.map((n: any) => ({
        id: `n${n.id}`,
        data: { label: n.name || "NO NAME" },
        position: { x: n.x, y: n.y },
        type: "circle",
        style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
      }))
    );


    setEdges((prev) =>
      prev.map((e) => ({
        ...e,
        animated: false,
        markerEnd: undefined,
        style: { stroke: "#333", strokeWidth: 2 },
      }))
    );

    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
  });
}}

        onCircularLayout={() => {
          circularLayout(nodes, edges, (newPositions) => {
            setRfNodes(
              newPositions.map((n: any) => ({
                id: `n${n.id}`,
                data: { label: n.name || "NO NAME" },
                position: { x: n.x, y: n.y },
                type: "circle",
                style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
              }))
            );
            setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
          });
        }}

        onGridLayout={() => {
          gridlayout(nodes, edges, (newPositions) => {
            setRfNodes(
              newPositions.map((n: any) => ({
                id: `n${n.id}`,
                data: { label: n.name || "NO NAME" },
                position: { x: n.x, y: n.y },
                type: "circle",
                style: { backgroundColor: "white", border: "2px solid #333", color: "black" },
              }))
            );
            setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
          });
        }}





      />

      {}
<svg style={{ position: "absolute", width: 0, height: 0 }}>
  <defs>
    <marker
      id="arrowhead"
      markerWidth="15"
      markerHeight="15"
      refX="10"
      refY="5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L10,5 L0,10 Z" fill="#333" />
    </marker>
  </defs>
</svg>



<ReactFlow
  nodes={rfNodes}
  edges={edges}

  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onEdgeClick={(_, edge: Edge) => setSelectedEdge(edge.id)}
  onNodeClick={(_, node) => {
  const id = parseInt(node.id.replace("n", ""));
  setSelectedNode(node.id);

  if (!startNode) {
    setStartNode(id);
    console.log("Start node:", id);
  } else if (!endNode && id !== startNode) {
    setEndNode(id);
    console.log("End node:", id);
  } else {
    setStartNode(id);
    setEndNode(null);
    console.log("Ny start node:", id);
  }
}}

  fitView
  edgeTypes={{ smooth: SmoothEdge }}
   nodeTypes={nodeTypes}
/>
    </div>
  );
}
