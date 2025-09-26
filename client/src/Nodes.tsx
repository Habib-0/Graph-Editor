
  import { useState, useCallback, useEffect } from "react";
  import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, ConnectionLineType, Position } from "@xyflow/react";
  import type { NodeChange, EdgeChange, Connection,Edge } from "@xyflow/react";
  // import ResizableNode from './ResizableNode';
  // import ResizableNodeSelected from './ResizableNodeSelected';
  import "@xyflow/react/dist/style.css";
  import { label } from "three/tsl";
// import {forcelayout}from './positiond3'
import ImportCSV from "./import.";



  interface Node {
    id: number;
    name: string;
    position:{x:number,y:number}
  }

  export default function Nodes() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<any[]>([]);
    const [rfNodes, setRfNodes] = useState<any[]>([]);
    const [selectdEdge,setselectedEdge]=useState<string|null>(null);
    const [nodeName,setNodeName]=useState("");
    const [selectedNode, setSelectedNode] = useState<string | null>(null);






  useEffect(() => {
    fetch("http://localhost:5000/nodes")
      .then(res => res.json())
      .then((data: any[]) => {
        setNodes(data);

        const flowNodes = data.map(n => ({
          id: `n${n.id}`,
          data: { label: n.name },
          position: { x: n.x, y: n.y },
          style: {
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #333"
          }
        }));

        setRfNodes(flowNodes);
      })
      .catch(err => console.error("Error fetching nodes:", err));
  }, []);


useEffect(() => {
  if (rfNodes.length === 0) return;
  fetch("http://localhost:5000/edges")
    .then(res => res.json())
    .then((data: any[]) => {
      const flowEdges = data.map(edge => ({
        id: `e${edge.edge_id}`,
        source: `n${edge.from_node}`,
        target: `n${edge.to_node}`,
        label: edge.weight?.toString() || "",
        animated: false,
      }));
      setEdges(flowEdges);
    })
    .catch(err => console.log(err));
}, [rfNodes]);





  const onNodeClick = useCallback((_event: any, node: any) => {
    setSelectedNode(node.id);
  }, []);

const deleteNode = () => {
  if (!selectedNode) return;

  const nodeIde = parseInt(selectedNode.replace("n", ""));
  console.log("Deleting node ID:", nodeIde);

  fetch("http://localhost:5000/deletenode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: nodeIde })
  })
    .then(res => res.json())
    .then(data => {
      console.log("deleted node", data);


      setRfNodes(prev => prev.filter(n => n.id !== `n${nodeIde}`));
      setNodes(prev => prev.filter(n => n.id !== nodeIde));


      setEdges(prev => prev.filter(e => e.source !== `n${nodeIde}` && e.target !== `n${nodeIde}`));


      setSelectedNode(null);
    })
    .catch(err => console.error("Error deleting node:", err));
};



  const createEdge=(sourceId:string, sourceTarget:string)=>{
  const newEdge={
    id:`edge${edges.length+1}`,
    source:sourceId,
    target:sourceTarget,

    label:`Edge${edges.length+1}`,

    };
    setEdges(prev=>[...prev,newEdge]);
  }

  const deleteEdge= () => {

    if(!selectdEdge) return;
     const edgeID=parseInt(selectdEdge.replace("e"," " ));
     console.log(edgeID);
    fetch("http://localhost:5000/deletedges",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:edgeID})
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Deleted Edge",data);
      setEdges(prev=>prev.filter((e)=>e.id !==selectdEdge));
      setselectedEdge(null);
    })

  };






    const addNode = async() => {
      try{
          const response= await  fetch("http://localhost:5000/addnode", {
           method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
           name:nodeName,
           x:0,
           y:0
      }),
    })


      const saVedNodes = await response.json();
        console.log(saVedNodes);

        const newNode:Node={
          id:saVedNodes.id,
          name:saVedNodes.name,
          position:{x:saVedNodes.x,y:saVedNodes.y},
        }
        setNodes(prev => [...prev, newNode]);



          const newRfNode = {
        id: `n${newNode.id}`,

        data: { label: newNode.name },
        position: newNode.position,
        style: {


          backgroundColor: 'white',
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #333'
        }
      };
      setRfNodes(prev => [...prev, newRfNode]);
    }catch(err){
      console.error("Error adding node:", err);
    }
  }

const saveCsvToDB = async () => {
  try {
    console.log("saving nodes ",nodes);
    await fetch("http://localhost:5000/importnodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes }),
    });

    alert("Nodes saved to database!");
  } catch (err) {
    console.error("Error saving nodes to DB:", err);
  }
};







const saveNodePosition = async (id: number, position: { x: number; y: number }) => {
  try {
    await fetch("http://localhost:5000/uppdatenodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, x: position.x, y: position.y }),
    });
  } catch (err) {
    console.error("Error saving node position:", err);
  }
};

const onNodesChange = useCallback((changes: NodeChange[]) => {
  setRfNodes(prev => {
    const updatedNodes = applyNodeChanges(changes, prev);


    changes.forEach(change => {
      if (change.type === "position" && change.position && change.id) {
        const nodeId = parseInt(change.id.replace("n", ""));
        saveNodePosition(nodeId, change.position);
      }
    });

    return updatedNodes;
  });
}, []);


    const onEdgesChange = useCallback(
      (changes: EdgeChange[]) => setEdges(prev => applyEdgeChanges(changes, prev)),
      []
    );





  const onConnect = useCallback((connection: Connection) => {

    setEdges(prev => addEdge(connection, prev));


    fetch("http://localhost:5000/addedges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_node: parseInt(connection.source!.replace("n", "")),
        to_node: parseInt(connection.target!.replace("n", "")),
        weight: 0,
        directed: false
      })
    })
      .then(res => res.json())
      .then(savedEdge => {
        console.log("Inserted edge:", savedEdge);
      })
      .catch(err => console.error("Error adding edge:", err));
  }, []);



  const onEdgeClick=useCallback((_event:any,edge:Edge)=>{
    setselectedEdge(edge.id);
  },[]);






    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <button
          onClick={addNode}
          className="btn btn-primary"

        >
          Add Node
        </button>




        <button
        type="button"
        onClick={deleteNode}

        className="btn btn-secondary"
        >Delete
        </button>


        <button

        type="button"
        onClick={deleteEdge}
        className="btn btn-secondary"
        >
          DeleteEdges

        </button>

            <label>


        <button
          className="btn btn-success"
          onClick={saveCsvToDB}
        >
        Save CSV to Database
      </button>



        <input
          type="text"
          value={nodeName}
          onChange={e => setNodeName(e.target.value)}
          placeholder="Write name of the node"
        />







      </label>
          <ImportCSV
      onImport={(csvNodes) => {

        setNodes(csvNodes);

        const flowNodes = csvNodes.map(n => ({
          id: `n${n.id}`,
          data: { label: n.name },
          position: n.position,
          style: {
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #333",
          },
        }));

        setRfNodes(flowNodes);
      }}
    />









        <ReactFlow
          nodes={rfNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}

          fitView

        />

      </div>
    );
  }
