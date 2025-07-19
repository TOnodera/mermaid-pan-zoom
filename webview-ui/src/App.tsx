import { useEffect, useState, useRef } from 'react';
import Mermaid from './components/Mermaid';
import { ReactSVGPanZoom, type Value } from 'react-svg-pan-zoom';

declare const acquireVsCodeApi: () => {
  postMessage: (msg: { type: string }) => void;
};

const vscode = acquireVsCodeApi();

function App() {
  const [mermaid, setMermaid] = useState<string>('');
  const viewerWidth = 400;
  const viewerHeight = 400;
  const svgWidth = 1440;
  const svgHeight = 1440;
  const panZoomRef = useRef<ReactSVGPanZoom | null>(null);
  const [value, setValue] = useState<Value | null>(null);

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
      <ReactSVGPanZoom
        ref={panZoomRef}
        width={viewerWidth}
        height={viewerHeight}
        value={value}
        onChangeValue={setValue}
        tool="none"
        modifierKeys={['Alt', 'Shift', 'Control']}
        onChangeTool={() => { }}
        onClick={() => { }}
        onDoubleClick={() => { }}
        onMouseDown={() => { }}
        onMouseUp={() => { }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
        >
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
}

export default App;
