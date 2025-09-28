import { useRef } from "react";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

interface CSVRow {
  id: string;
  name: string;
  x?: string;
  y?: string;
}

interface CSVNode {
  id: number;
  name: string;
  position: { x: number; y: number };
}

interface CSVEdgeRow {
  edge_id: string;
  from_node: string;
  to_node: string;
  weight?: string;
  directed?: string;
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
        const firstRow = results.data[0];

        
        if (firstRow.id && firstRow.name) {
          const parsedNodes: CSVNode[] = results.data.map((row: CSVRow) => ({
            id: Number(row.id),
            name: row.name,
            position: {
              x: row.x ? Number(row.x) : Math.random() * 500,
              y: row.y ? Number(row.y) : Math.random() * 500,
            },
          }));
          onImportNodes?.(parsedNodes);
        }


        else if (firstRow.edge_id) {
          const parsedEdges: CSVEdge[] = results.data.map((row: CSVEdgeRow) => ({
            edge_id: Number(row.edge_id),
            from_node: Number(row.from_node),
            to_node: Number(row.to_node),
            weight: row.weight ? Number(row.weight) : undefined,
            directed: row.directed?.toLowerCase() === "true",
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
