import { useEffect, useState } from 'react';
import { vscode } from '../utils';

export function useMermaidText(): string {
  const [mermaidText, setMermaidText] = useState<string>('');
  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (message.type === 'send-mermaid') {
      setMermaidText(message.payload);
    }
  };

  useEffect(() => {
    // 初期メッセージを送信してマーメイドのテキストを取得
    vscode.postMessage({ type: 'get-mermaid' });
    // メッセージリスナーを登録
    window.addEventListener('message', handleMessage);
    // クリーンアップ
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return mermaidText;
}
