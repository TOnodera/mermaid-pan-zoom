import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ReactSVGPanZoom, type Tool, TOOL_PAN, type Value } from 'react-svg-pan-zoom';
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
    suppressErrorRendering: true
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
    const [currentTool, setCurrentTool] = useState<Tool>(TOOL_PAN);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const initialize = async (id: string, mermaidText: string) => {
        const svg = await generateMermaidSvg(id, mermaidText);
        if (!svg) {
            console.error('Failed to generate Mermaid SVG');
            return;
        }
        // mermaidが発番するUUIDが数字で始まる場合レンダリングに失敗するので先頭に文字列を付与する
        const matched = svg.match(/<svg[^>]*?id="(.+?)"/);
        if (!matched) {
            console.error('Failed to find SVG ID');
            return;
        }
        const uuid = matched[1];
        const replacedSvg = svg.replace(new RegExp(uuid, 'g'), `mermaid-${uuid}`);
        setSvgString(replacedSvg);
    }

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    useEffect(() => {
        initialize(id, mermaidText);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [id, mermaidText]);

    return <>
        {svgString &&
            <ReactSvgPanZoomLoader svgXML={svgString} render={(content) => (
                <ReactSVGPanZoom
                    className='mermaid'
                    ref={panZoomRef}
                    width={windowSize.width}
                    height={windowSize.height}
                    value={value}
                    onChangeValue={setValue}
                    tool={currentTool}
                    modifierKeys={['Alt', 'Shift', 'Control']}
                    onChangeTool={tool => setCurrentTool(tool)}
                    onClick={() => { }}
                    onDoubleClick={() => { }}
                    onMouseDown={() => { }}
                    onMouseUp={() => { }}
                >
                    <svg>
                        {content}
                    </svg>
                </ReactSVGPanZoom >
            )
            } />
        }
    </>;
}
