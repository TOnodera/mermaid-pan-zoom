import { useId } from 'react';
import Mermaid from './components/Mermaid';
import { useMermaidText } from './hooks/useMermaidText';

function App() {

  // マーメイドのテキストを取得するカスタムフックを使用
  const mermaidText = useMermaidText();
  // ユニークなIDを生成してMermaidコンポーネントに渡す
  const id = useId();

  return (
    <div className="flex items-center justify-center h-screen">
      <Mermaid id={id} mermaidText={mermaidText} />
    </div>
  );
}

export default App;
