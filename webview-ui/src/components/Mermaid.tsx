import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';


interface Props {
    mermaidText: string;
}
//https://mermaid.js.org/config/usage.html
export default function Mermaid({ mermaidText }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.render('mermaidDiagram', mermaidText).then(({ svg }) => {
                if (ref.current) {
                    ref.current.innerHTML = svg;
                }
            });
        }
    }, [mermaidText]);

    return <div ref={ref} className="mermaid" />;
};

