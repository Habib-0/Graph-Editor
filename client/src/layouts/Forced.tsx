import * as d3 from "d3";

export default function runForceLayout(
  nodes: any[],
  edges: any[],
  onTick: (updatedNodes: any[]) => void
) {
  // 1️⃣ Se till att varje nod har startposition
  const simulationNodes = nodes.map((n, i) => ({
    ...n,
    x: n.x ?? Math.random() * window.innerWidth,
    y: n.y ?? Math.random() * window.innerHeight,
  }));

  // 2️⃣ Gör om edges till d3-format
  const simulationEdges = edges.map((e) => ({ ...e }));

  const width = window.innerWidth;
  const height = window.innerHeight;

  // 3️⃣ Skapa D3-simulering
  const simulation = d3
    .forceSimulation(simulationNodes as d3.SimulationNodeDatum[])
    .force(
      "link",
      d3
        .forceLink(simulationEdges)
        .id((d: any) => d.id)
        .distance(120) // lite längre så man ser pilar tydligare
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(50)); // 🔥 förhindrar överlapp

  simulation.alphaDecay(0.05);

  // 4️⃣ Kör varje tick (när D3 uppdaterar)
  simulation.on("tick", () => {
    onTick(
      simulationNodes.map((n: any) => ({
        id: n.id,
        name: n.name,
        x: n.x,
        y: n.y,
      }))
    );
  });

  // 5️⃣ När simuleringen är klar → centrera grafen
  simulation.on("end", () => {
    const minX = Math.min(...simulationNodes.map((n: any) => n.x));
    const maxX = Math.max(...simulationNodes.map((n: any) => n.x));
    const minY = Math.min(...simulationNodes.map((n: any) => n.y));
    const maxY = Math.max(...simulationNodes.map((n: any) => n.y));

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    const offsetX = width / 2 - (minX + graphWidth / 2);
    const offsetY = height / 2 - (minY + graphHeight / 2);

    onTick(
      simulationNodes.map((n: any) => ({
        id: n.id,
        name: n.name,
        x: n.x + offsetX,
        y: n.y + offsetY,
      }))
    );
  });
}
