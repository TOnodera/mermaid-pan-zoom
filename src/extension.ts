import * as vscode from 'vscode';
import { ReactWebViewPanel } from './webview/ReactWebViewPanel';
import { findMermaidBlocks } from './utilities/findMermaidBlocks';

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
        title: 'Mermaid プレビューを開く',
        command: 'mermaidPreview.open',
        // 関数呼び出しの引数になる
        arguments: [block.content],
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
    'mermaidPreview.open',
    (mermaidText: string) => {
      ReactWebViewPanel.render(
        context.extensionUri,
        'mermaidPreview',
        'Mermaid プレビュー',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
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
