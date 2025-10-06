export default function gridLayout(
  nodes: any[],
  edges: any[],
  onLayout: (updatedNodes: any[]) => void
) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;


  const columns = Math.ceil(Math.sqrt(nodes.length));


  const spacingX = 200;
  const spacingY = 100;


  const offsetX = screenWidth / 2 - (columns * spacingX) / 2;
  const offsetY = screenHeight / 2 - (Math.ceil(nodes.length / columns) * spacingY) / 2;

  
  const newPositions = nodes.map((n, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const x = offsetX + col * spacingX;
    const y = offsetY + row * spacingY;

    return {
      id: n.id,
      name: n.name,
      x,
      y,
    };
  });

  onLayout(newPositions);
}
