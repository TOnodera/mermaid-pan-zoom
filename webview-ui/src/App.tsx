import { useEffect, useState } from "react";
import Mermaid from "./components/Mermaid";
import { flippedTriangle } from "mermaid/dist/rendering-util/rendering-elements/shapes/flippedTriangle.js";

declare const acquireVsCodeApi: () => {
  postMessage: (msg: { type: string }) => void;
};

const vscode = acquireVsCodeApi();


function App() {

  const [mermaid, setMermaid] = useState<string>("");

  useEffect(() => {
    vscode.postMessage({ type: "get-mermaid" });
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "send-mermaid") {
        setMermaid(message.payload);
      }
    });
  }, [mermaid]);

  const uuid = crypto.randomUUID();

  return <div style={{ margin: "0 auto", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
    <Mermaid id={uuid} mermaidText={mermaid} />
  </div>;

}

export default App
