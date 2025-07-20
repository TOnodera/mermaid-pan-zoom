import * as vscode from 'vscode';
import { ReactWebViewPanel } from './webview/ReactWebViewPanel';
import { findMermaidBlocks } from './utilities/findMermaidBlocks';
import path from 'path';

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
        title: `Mermaid プレビューを開く`,
        command: 'mermaidPanZoom.open',
        // 関数呼び出しの引数になる
        arguments: [block.content, document.fileName],
      };
      lenses.push(new vscode.CodeLens(block.range, command));
    }

    return lenses;
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: 'markdown' },
      new MermaidCodeLensProvider()
    )
  );

  const command = vscode.commands.registerCommand(
    'mermaidPanZoom.open',
    (mermaidText: string, fileUri: string) => {
      const fileName = path.basename(fileUri);
      ReactWebViewPanel.render(
        context.extensionUri,
        'mermaid-pan-zoom',
        fileName,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'src/webview/dist'),
          ],
        },
        mermaidText
      );
    }
  );
  context.subscriptions.push(command);
}

// This method is called when your extension is deactivated
export function deactivate() {}
