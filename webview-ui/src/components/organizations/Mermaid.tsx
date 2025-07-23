import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ReactSVGPanZoom,
  type Tool,
  TOOL_PAN,
  type Value,
} from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';
import { useWindowSize } from '../../hooks/useWindowSize';
import { generateMermaidSvg } from '../../utils';
import Toolbar from '../molucules/Toolbar';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  suppressErrorRendering: true,
  themeVariables: {
    background: '#fff',
  },
});

interface Props {
  id: string;
  mermaidText: string;
}
/**
 * Mermaidコンポーネント
 * //https://mermaid.js.org/config/usage.html
 */
export default function Mermaid({ id, mermaidText }: Props) {
  const panZoomRef = useRef<ReactSVGPanZoom>(null);
  const [value, setValue] = useState<Value>({
    version: 2,
    mode: 'idle',
    focus: false,
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
    viewerWidth: 0,
    viewerHeight: 0,
    SVGWidth: 0,
    SVGHeight: 0,
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    miniatureOpen: true,
  });
  const [svgString, setSvgString] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>(TOOL_PAN);
  const windowSize = useWindowSize();

  const initialize = async (id: string, mermaidText: string) => {
    const svg = await generateMermaidSvg({ id, mermaidText, mermaid });
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
  };

  useEffect(() => {
    initialize(id, mermaidText);
  }, [id, mermaidText]);

  return (
    <>
      {svgString && (
        <ReactSvgPanZoomLoader
          svgXML={svgString}
          render={(content) => (
            <ReactSVGPanZoom
              className="mermaid"
              ref={panZoomRef}
              width={windowSize.width}
              height={windowSize.height}
              value={value}
              onChangeValue={setValue}
              tool={currentTool}
              background="#fff"
              modifierKeys={['Alt', 'Shift', 'Control']}
              onChangeTool={setCurrentTool}
              customMiniature={() => <></>}
              customToolbar={() => (
                <Toolbar
                  tool={currentTool}
                  onChangeTool={(tool) => setCurrentTool(tool)}
                  value={value}
                  onChangeValue={setValue}
                />
              )}
            >
              <svg>{content}</svg>
            </ReactSVGPanZoom>
          )}
        />
      )}
    </>
  );
}
