import { useEffect, useState } from 'react';
import Mermaid from './components/Mermaid';

declare const acquireVsCodeApi: () => {
  postMessage: (msg: { type: string }) => void;
};

const vscode = acquireVsCodeApi();

function App() {
  const [mermaid, setMermaid] = useState<string>('');

  useEffect(() => {
    vscode.postMessage({ type: 'get-mermaid' });
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'send-mermaid') {
        setMermaid(message.payload);
      }
    });
  }, [mermaid]);

  const uuid = crypto.randomUUID();

  return (
    <div className="flex items-center justify-center h-screen">
      <Mermaid id={uuid} mermaidText={mermaid} />
    </div>
  );
}

export default App;
