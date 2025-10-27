import { useRef } from "react";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

interface CSVNode {
  id: number;
  name: string;
  position: { x: number; y: number };
}

interface CSVEdge {
  edge_id: number;
  from_node: number;
  to_node: number;
  weight?: number;
  directed: boolean;
}

interface ImportProps {
  onImportNodes?: (nodes: CSVNode[]) => void;
  onImportEdges?: (edges: CSVEdge[]) => void;
}


function circleLayout(nodes: CSVNode[]) {
  const n = nodes.length;
  const radius = 300;
  const centerX = 800;
  const centerY = 500;

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / n;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}


function autoGridLayout(nodes: CSVNode[], cols = 40, spacing = 150) {
  return nodes.map((node, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return {
      ...node,
      position: {
        x: col * spacing + 100,
        y: row * spacing + 100,
      },
    };
  });
}


function randomSpread(nodes: CSVNode[]) {
  return nodes.map((node) => ({
    ...node,
    position: {
      x: Math.random() * 4000 - 2000,
      y: Math.random() * 4000 - 2000,
    },
  }));
}

export default function ImportCSV({ onImportNodes, onImportEdges }: ImportProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<any>) => {
        if (results.data.length === 0) return;

        const firstRow = results.data[0];


        if (
          (firstRow.id && firstRow.name) ||
          (firstRow.name && (firstRow.x !== undefined || firstRow.y !== undefined))
        ) {
          const parsedNodes: CSVNode[] = results.data.map((row: any, i: number) => ({
            id: row.id ? Number(row.id) : i + 1,
            name: row.name || `Node ${i + 1}`,
            position: {
              x: Number(row.x),
              y: Number(row.y),
            },
          }));


          const missingPositions = parsedNodes.some(
            (n) => isNaN(n.position.x) || isNaN(n.position.y)
          );

          let finalNodes = parsedNodes;

          if (missingPositions) {
            if (parsedNodes.length <= 20) {
              finalNodes = circleLayout(parsedNodes);
            } else if (parsedNodes.length <= 200) {
              finalNodes = autoGridLayout(parsedNodes);
            } else {
              finalNodes = randomSpread(parsedNodes);
            }
          }

          onImportNodes?.(finalNodes);
        }


        else if (firstRow.edge_id || (firstRow.from_node && firstRow.to_node)) {
          const parsedEdges: CSVEdge[] = results.data.map((row: any, i: number) => ({
            edge_id: row.edge_id ? Number(row.edge_id) : i + 1,
            from_node: Number(row.from_node),
            to_node: Number(row.to_node),
            weight: row.weight ? Number(row.weight) : 1,
            directed: row.directed?.toString().toLowerCase() === "true",
          }));

          onImportEdges?.(parsedEdges);
        }
      },
    });
  };

  return (
    <div>
      <button onClick={handleClick} className="btn btn-primary">
        Import CSV
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
