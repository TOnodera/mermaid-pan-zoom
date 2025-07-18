import * as vscode from "vscode";
import { ReactWebViewPanel } from "./webview/ReactWebViewPanel";

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

  panel.webview.html = getWebviewContent();
}

/**
 * Mermaidコードを含むWebviewのコンテンツを生成する
 * @param mermaidCode Mermaidコード
 * @returns
 */
function getWebviewContent(): string {
  const distPath = vscode.Uri.joinPath(
    this._extensionUri,
    "src",
    "webview",
    "dist"
  );
  const htmlPath = vscode.Uri.joinPath(distPath, "index.html");
  let html = fs.readFileSync(htmlPath.fsPath, "utf-8");
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "markdown" },
      new MermaidCodeLensProvider()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("mermaidPreview.open", () => {
      ReactWebViewPanel.render(
        context.extensionUri,
        "mermaidPreview",
        "Mermaid プレビュー",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "src/webview/dist"),
          ],
        }
      );
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
