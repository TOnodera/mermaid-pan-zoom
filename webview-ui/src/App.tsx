import { useEffect, useState } from 'react';
import Mermaid from './components/Mermaid';

declare const acquireVsCodeApi: () => {
  postMessage: (msg: { type: string }) => void;
};

const vscode = acquireVsCodeApi();

function App() {
  const [mermaid, setMermaid] = useState<string>('');

  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (message.type === 'send-mermaid') {
      setMermaid(message.payload);
    }
  }

  useEffect(() => {
    // 初期メッセージを送信してマーメイドのテキストを取得
    vscode.postMessage({ type: 'get-mermaid' });
    // メッセージリスナーを登録
    window.addEventListener('message', handleMessage);
    // クリーンアップ
    return () => window.removeEventListener('message', handleMessage);
  }, [mermaid]);

  // mermaid.render()用のユニークなIDを生成
  const uuid = crypto.randomUUID();

  return (
    <div className="flex items-center justify-center h-screen">
      <Mermaid id={uuid} mermaidText={mermaid} />
    </div>
  );
}

export default App;
