import * as vscode from 'vscode';
import { PROVIDER_TYPES } from './providers/types';
import { COMMAND_TYPES } from './commands/types';
import { containerFactory } from './container';
import { ICodeLensProviderManager } from './providers/ICodeLensProviderManager';
import { ICommandsManager } from './commands/ICommandsManager';

export function activate(context: vscode.ExtensionContext) {
  // DIコンテナ取得
  const container = containerFactory(context);

  // プロバイダー登録
  const codeLensProviderManager = container.get<ICodeLensProviderManager>(
    PROVIDER_TYPES.ICodeLensProviderManager
  );
  codeLensProviderManager.registerCodeLensProvider(context);

  // コマンド登録
  const commandsManager = container.get<ICommandsManager>(
    COMMAND_TYPES.VscodeCommandManager
  );
  commandsManager.registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
