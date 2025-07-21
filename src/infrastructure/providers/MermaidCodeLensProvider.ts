import * as vscode from 'vscode';
import { findMermaidBlocks } from '../../utilities/findMermaidBlocks';
import { injectable } from 'inversify';
import { COMMAND_NAMES } from '../../commands/types';

/**
 * Mermaidコードブロックに対するCodeLensプロバイダー
 * @implements {vscode.CodeLensProvider}
 */
@injectable()
export class MermaidCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];

    const blocks = findMermaidBlocks(document);
    for (const block of blocks) {
      const command: vscode.Command = {
        title: `Open in Mermaid Pan Zoom`,
        command: COMMAND_NAMES.MermaidPanZoomOpen,
        // コマンド呼び出しの引数になる
        arguments: [block.content, document.fileName],
      };
      lenses.push(new vscode.CodeLens(block.range, command));
    }

    return lenses;
  }
}
