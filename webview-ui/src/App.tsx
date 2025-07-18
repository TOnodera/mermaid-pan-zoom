import { useEffect, useState } from "react";

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
      console.log(event);
      if (message.type === "send-mermaid") {
        setMermaid(message.payload);
      }
    });
  }, []);


  return (
    <>
      {mermaid}
    </>
  )
}

export default App
