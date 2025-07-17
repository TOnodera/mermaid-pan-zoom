import * as vscode from "vscode";

/**
 * markdownからMermaidブロックを探し、レンダリング用の情報を返す
 * @param {vscode.TextDocument} document
 * @returns {Array<{ range: vscode.Range; content: string }>}
 */
function findMermaidBlocks(
  document: vscode.TextDocument
): { range: vscode.Range; content: string }[] {
  const blocks: { range: vscode.Range; content: string }[] = [];
  const lines = document.getText().split("\n");

  let inMermaid = false;
  let startLine = 0;
  let content = "";

  lines.forEach((line, i) => {
    if (!inMermaid && line.trim() === "```mermaid") {
      inMermaid = true;
      startLine = i;
      content = "";
    } else if (inMermaid && line.trim() === "```") {
      inMermaid = false;
      blocks.push({
        range: new vscode.Range(startLine, 0, i, 3),
        content,
      });
    } else if (inMermaid) {
      content += line + "\n";
    }
  });

  return blocks;
}

/**
 * Mermaidコードブロックに対するCodeLensプロバイダー
 * @implements {vscode.CodeLensProvider}
 */
class MermaidCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];

    const blocks = findMermaidBlocks(document);
    for (const block of blocks) {
      const command: vscode.Command = {
        title: "Mermaid プレビューを開く",
        command: "mermaidPreview.open",
        arguments: [block.content],
      };
      lenses.push(new vscode.CodeLens(block.range, command));
    }

    return lenses;
  }
}

/**
 * Mermaidプレビューを開くコマンドの実装
 * @param {string} content Mermaidコード
 */
function showMermaidPreview(content: string) {
  const panel = vscode.window.createWebviewPanel(
    "mermaidPreview",
    "Mermaid Preview",
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );

  panel.webview.html = getWebviewContent(content);
}

/**
 * Mermaidコードを含むWebviewのコンテンツを生成する
 * @param mermaidCode Mermaidコード
 * @returns
 */
function getWebviewContent(mermaidCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        html, body {
          margin: 0; padding: 0;
          height: 100%; width: 100%;
          overflow: hidden;
        }
        #container {
          width: 100%;
          height: 100%;
          overflow: auto;
        }
        #graph {
          transform-origin: top left;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <div id="graph" class="mermaid">${mermaidCode}</div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });

        let scale = 1.0;
        const graph = document.getElementById('graph');
        const container = document.getElementById('container');

        container.addEventListener('wheel', (e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale += delta;
            scale = Math.max(0.2, Math.min(100.0, scale));
            graph.style.transform = \`scale(\${scale})\`;
          }
        }, { passive: false });
      </script>
    </body>
    </html>
  `;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "markdown" },
      new MermaidCodeLensProvider()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mermaidPreview.open",
      (mermaidCode: string) => {
        showMermaidPreview(mermaidCode);
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
