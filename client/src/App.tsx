import Nodes from "./Components/Nodes";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <ReactFlowProvider>
      <Nodes />
    </ReactFlowProvider>
  );
}

export default App;
