import { Heap } from "heap-js";

interface Edge {
  from_node?: number;
  to_node?: number;
  source?: string;
  target?: string;
  weight?: number;
  label?: string;
  directed?: boolean;
}

interface Node {
  id: number;
  name: string;
}
export function dijkstraWithPath(
  nodes: Node[],
  edges: Edge[],
  startId: number,
  endId: number,
  isDirected: boolean
): { distances: Record<number, number>; path: number[] } {
  const graph: Record<number, Record<number, number>> = {};

  for (const node of nodes) {
    graph[node.id] = {};
  }

  for (const edge of edges) {
    const from = edge.from_node ?? parseInt(edge.source?.replace("n", "") || "0");
    const to = edge.to_node ?? parseInt(edge.target?.replace("n", "") || "0");
    const weight = edge.weight ?? (edge.label ? Number(edge.label) : 1);
    const directed = isDirected ? (edge.directed ?? true) : false;

    if (!graph[from]) graph[from] = {};
    if (!graph[to]) graph[to] = {};

    graph[from][to] = weight;
    if (!directed) {
      graph[to][from] = weight;
    }
  }

  const distances: Record<number, number> = {};
  const previous: Record<number, number | null> = {};
  const visited = new Set<number>();

  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }

  distances[startId] = 0;
  const pq = new Heap<{ node: number; priority: number }>((a, b) => a.priority - b.priority);
  pq.push({ node: startId, priority: 0 });

  while (pq.size() > 0) {
    const current = pq.pop();
    if (!current) continue;
    const u = current.node;
    if (visited.has(u)) continue;
    visited.add(u);

    for (const v in graph[u]) {
      const newDist = distances[u] + graph[u][v];
      if (newDist < distances[Number(v)]) {
        distances[Number(v)] = newDist;
        previous[Number(v)] = u;
        pq.push({ node: Number(v), priority: newDist });
      }
    }
  }

  const path: number[] = [];
  let curr: number | null = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { distances, path };
}
