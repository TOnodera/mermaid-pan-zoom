import type { Mermaid } from 'mermaid';

/**
 * stringからSVG文字列を生成する関数
 * @param { id: string, mermaidText: string, mermaid: Mermaid } params
 * @returns {Promise<string | null>} SVG文字列
 */
export async function generateMermaidSvg({
  id,
  mermaidText,
  mermaid,
}: {
  id: string;
  mermaidText: string;
  mermaid: Mermaid;
}): Promise<string | null> {
  try {
    const { svg } = await mermaid.render(id, mermaidText);
    return svg;
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    return null;
  }
}

/**
 * VSCode APIを取得する関数
 */
export const vscode = acquireVsCodeApi();
