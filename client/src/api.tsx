import * as htmlToImage from "html-to-image";

export async function fetchNodes() {
  const res = await fetch("http://localhost:5000/nodes");
  return await res.json();
}

export async function fetchEdges() {
  const res = await fetch("http://localhost:5000/edges");
  return await res.json();
}

export async function addNode(name: string) {
  const res = await fetch("http://localhost:5000/addnode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, x: 0, y: 0 }),
  });
  return await res.json();
}

export async function deleteNode(id: number) {
  const res = await fetch("http://localhost:5000/deletenode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return await res.json();
}

export async function deleteEdge(id: number) {
  const res = await fetch("http://localhost:5000/deletedges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return await res.json();
}

export async function addEdge(from_node: number, to_node: number, weight: number, directed = true) {
  try {
    const response = await fetch("http://localhost:5000/addedges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from_node, to_node, weight, directed }), 
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding edge:", error);
    return { success: false };
  }
}




export async function saveCsvToDB(nodes: any[]) {
  await fetch("http://localhost:5000/importnodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodes }),
  });
}
export async function saveEdge( edges :any[]){
    await fetch("http://localhost:5000/importedges",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({edges}),
    });

}

export async function saveNodePosition(id: number, position: { x: number; y: number }) {
  await fetch("http://localhost:5000/uppdatenodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, x: position.x, y: position.y }),
  });
}


export async function exportall(){
  const res=await fetch("http://localhost:5000/exportall");
  if(!res)throw new Error("faild to  export");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "graph_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export async function undo() {
  const res = await fetch("http://localhost:5000/undo", {
    method: "POST",
  });
  return await res.json();
}

export async function redo() {
  const res = await fetch("http://localhost:5000/redo", {
    method: "POST",
  });
  return await res.json();
}

export async function updateEdgeWeight(edgeId: number, weight: number) {
  const res = await fetch(`http://localhost:5000/edges/${edgeId}/weight`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weight }),
  });
  return res.json();
}

export async function exportGraphML(nodes: any[], edges: any[]) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const graphOpen = `<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <graph id="G" edgedefault="undirected">`;

  const nodeXml = nodes
    .map(
      (n) => `<node id="n${n.id}">
      <data key="label">${n.name || ""}</data>
    </node>`
    )
    .join("\n");

  const edgeXml = edges
    .map(
      (e) => `<edge id="e${e.edge_id || e.id}" source="n${e.from_node || parseInt(e.source.replace("n", ""))}" target="n${e.to_node || parseInt(e.target.replace("n", ""))}">
      <data key="weight">${e.weight || e.label || 0}</data>
    </edge>`
    )
    .join("\n");

  const graphClose = `</graph></graphml>`;
  const graphML = `${xmlHeader}\n${graphOpen}\n${nodeXml}\n${edgeXml}\n${graphClose}`;


  const blob = new Blob([graphML], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "graph.graphml");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export async function exportGraphAsPNG() {
  const flowElement = document.querySelector(".react-flow");


  try {
    const dataUrl = await htmlToImage.toPng(flowElement as HTMLElement);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "graph.png";
    link.click();
  } catch (err) {
    console.error("PNG export failed:", err);
  }
}



export async function updateNodeName(nodeId: number, newName: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/nodes/${nodeId}/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating node name:", error);
    return { success: false };
  }
}
