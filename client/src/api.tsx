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

export async function addEdge(from: number, to: number) {
  const res = await fetch("http://localhost:5000/addedges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from_node: from,
      to_node: to,
      weight: 0,
      directed: false,
    }),
  });
  return await res.json();
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
