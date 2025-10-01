import * as d3 from "d3";

export default function heriarchal(
  nodes: any[],
  edges: any[],
  onlayout: (updateNodes: any[]) => void,
  syskonSpacing: number = 2,
  grenSpacing: number = 3,
  levelSpacing: number = 150
) {
  const roots = buildForest(nodes, edges);
  let allPositions: any[] = [];

  roots.forEach((rootData, i) => {
    const root = d3.hierarchy(rootData);

    const treelayout = d3
      .tree<any>()
      .nodeSize([80, levelSpacing]) 
      .separation((a, b) => (a.parent === b.parent ? syskonSpacing : grenSpacing));

    treelayout(root);

    const offsetX = (i * window.innerWidth) / roots.length;
    const offsetY = 0;

    allPositions = allPositions.concat(
      root.descendants().map((d: any) => ({
        id: d.data.id,
        name: d.data.name,
        x: d.x + offsetX,
        y: d.y + offsetY,
      }))
    );
  });

  // Centrera i mitten av skärmen
  const minX = Math.min(...allPositions.map((n) => n.x));
  const maxX = Math.max(...allPositions.map((n) => n.x));
  const minY = Math.min(...allPositions.map((n) => n.y));
  const maxY = Math.max(...allPositions.map((n) => n.y));

  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;

  const offsetX = window.innerWidth / 2 - (minX + layoutWidth / 2);
  const offsetY = window.innerHeight / 2 - (minY + layoutHeight / 2);

  const centeredPositions = allPositions.map((n) => ({
    ...n,
    x: n.x + offsetX,
    y: n.y + offsetY,
  }));

  onlayout(centeredPositions);
}

function buildForest(nodes: any[], edges: any[]) {
  const nodeMap: Record<number, any> = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = { ...n, children: [] };
  });

  edges.forEach((e) => {
    const parent = nodeMap[parseInt(e.source.replace("n", ""))];
    const child = nodeMap[parseInt(e.target.replace("n", ""))];
    if (parent && child) {
      parent.children.push(child);
    }
  });

  const targets = edges.map((e) => parseInt(e.target.replace("n", "")));
  const roots = nodes.filter((n) => !targets.includes(n.id));

  return roots.map((r) => nodeMap[r.id]);
}
