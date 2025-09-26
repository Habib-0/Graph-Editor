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

interface ImportProps {
  onImport: (nodes: CSVNode[]) => void;
}

export default function ImportCSV({ onImport }: ImportProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        const parsedNodes: CSVNode[] = results.data.map((row: CSVRow) => ({
          id: Number(row.id),
          name: row.name,
          position: {
            x: row.x ? Number(row.x) : Math.random() * 500,
            y: row.y ? Number(row.y) : Math.random() * 500,
          },
        }));

        onImport(parsedNodes);
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
