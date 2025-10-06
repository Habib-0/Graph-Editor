export default function circularLayout(
  nodes: any[],
  edges: any[],
  onLayout: (updateNodes: any[]) => void
) {
  if (nodes.length === 0) return; 

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = Math.min(window.innerWidth, window.innerHeight) / 3;
  const angleStep = (2 * Math.PI) / nodes.length;

  const newPositions = nodes.map((n, i) => {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return {
      id: n.id,
      name: n.name,
      x,
      y,
    };
  });

  onLayout(newPositions);
}
