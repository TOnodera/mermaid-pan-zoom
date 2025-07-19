import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ReactSVGPanZoom, type Value } from 'react-svg-pan-zoom';


async function generateMermaidSvg(id: string, mermaidText: string): Promise<string | null> {
    try {
        const { svg } = await mermaid.render(id, mermaidText);
        return svg;
    } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        return null;
    }
}

interface Props {
    id: string;
    mermaidText: string;
}
//https://mermaid.js.org/config/usage.html
export default function Mermaid({ id, mermaidText }: Props) {
    const panZoomRef = useRef<ReactSVGPanZoom>(null);
    const svgRef = useRef<HTMLDivElement | null>(null);
    const [value, setValue] = useState<Value | null>(null);

    const onLoad = async (id: string, mermaidText: string) => {
        const svg = await generateMermaidSvg(id, mermaidText);
        if (!svg) {
            console.error('Failed to generate Mermaid SVG');
            return;
        }
        if (svgRef.current) {
            svgRef.current.innerHTML = svg;
        }
    }

    useEffect(() => {
        onLoad(id, mermaidText);
    }, [id, mermaidText]);

    return <ReactSVGPanZoom
        style={{ width: '100%', height: '100%' }}
        ref={panZoomRef}
        width={0}
        height={0}
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
        <div
            ref={svgRef}
        />
    </ReactSVGPanZoom>
}
