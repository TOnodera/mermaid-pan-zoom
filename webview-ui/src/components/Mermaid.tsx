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
    const [value, setValue] = useState<Value | null>(null);

    const onLoad = async (id: string, mermaidText: string) => {
        const svg = await generateMermaidSvg(id, mermaidText);
        if (!svg) {
            console.error('Failed to generate Mermaid SVG');
            return;
        }
    }

    useEffect(() => {
        onLoad(id, mermaidText);
    }, [id, mermaidText]);

    return <ReactSVGPanZoom
        ref={panZoomRef}
        width={500}
        height={500}
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
        <svg width={617} height={316}>
            <g fillOpacity=".5" strokeWidth="4">
                <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142" />
                <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff" />
                <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0" />
                <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f" />
            </g>
        </svg>
    </ReactSVGPanZoom>
}
