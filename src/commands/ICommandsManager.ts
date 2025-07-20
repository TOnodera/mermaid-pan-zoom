import * as vscode from 'vscode';

export interface ICommandsManager {
  registerCommands(context: vscode.ExtensionContext): void;
}
