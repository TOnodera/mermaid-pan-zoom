import * as vscode from 'vscode';
/**
 * markdownからMermaidブロックを探し、レンダリング用の情報を返す
 * @param {vscode.TextDocument} document
 * @returns {Array<{ range: vscode.Range; content: string }>}
 */
export function findMermaidBlocks(
  document: vscode.TextDocument
): { range: vscode.Range; content: string }[] {
  const blocks: { range: vscode.Range; content: string }[] = [];
  const lines = document.getText().split('\n');

  let inMermaid = false;
  let startLine = 0;
  let content = '';

  lines.forEach((line, i) => {
    if (!inMermaid && line.trim() === '```mermaid') {
      inMermaid = true;
      startLine = i;
      content = '';
    } else if (inMermaid && line.trim() === '```') {
      inMermaid = false;
      blocks.push({
        range: new vscode.Range(startLine, 0, i, 3),
        content,
      });
    } else if (inMermaid) {
      content += line + '\n';
    }
  });

  return blocks;
}
