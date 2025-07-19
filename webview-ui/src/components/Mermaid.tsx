import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ReactSVGPanZoom, type Value } from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';


async function generateMermaidSvg(id: string, mermaidText: string): Promise<string | null> {
    try {
        const { svg } = await mermaid.render(id, mermaidText);
        return svg;
    } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        return null;
    }
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
});

interface Props {
    id: string;
    mermaidText: string;
}
//https://mermaid.js.org/config/usage.html
export default function Mermaid({ id, mermaidText }: Props) {
    const panZoomRef = useRef<ReactSVGPanZoom>(null);
    const [value, setValue] = useState<Value | null>(null);
    const [svgString, setSvgString] = useState<string | null>(null);

    const onLoad = async (id: string, mermaidText: string) => {
        const svg = await generateMermaidSvg(id, mermaidText);
        if (!svg) {
            console.error('Failed to generate Mermaid SVG');
            return;
        }
        setSvgString(svg);
    }

    useEffect(() => {
        onLoad(id, mermaidText);
    }, [id, mermaidText]);

    return <>
        {svgString &&
            <ReactSvgPanZoomLoader svgXML={svgString} render={(content) => {
                console.log('SVG content loaded:', content);
                return <ReactSVGPanZoom
                    className='mermaid'
                    ref={panZoomRef}
                    width={700}
                    height={700}
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
                    <svg>
                        {content}
                    </svg>
                </ReactSVGPanZoom >
            }} />
        }
    </>;
}
