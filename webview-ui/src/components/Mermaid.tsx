import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Props {
  id: string;
  mermaidText: string;
}
//https://mermaid.js.org/config/usage.html
export default function Mermaid({ id, mermaidText }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(id, mermaidText).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [id, mermaidText]);

  return <div ref={ref} className="mermaid" />;
}
