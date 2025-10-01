import * as d3 from "d3";

export default function runForceLayout(
  nodes: any[],
  edges: any[],
  onTick: (updatedNodes: any[]) => void
) {
  const simulationNodes = nodes.map((n) => ({ ...n }));
  const simulationEdges = edges.map((e) => ({ ...e }));

  const width = window.innerWidth;
  const height = window.innerHeight;

  const simulation = d3
    .forceSimulation(simulationNodes as d3.SimulationNodeDatum[])
    .force("link", d3.forceLink(simulationEdges).id((d: any) => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.alphaDecay(0.05);



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
