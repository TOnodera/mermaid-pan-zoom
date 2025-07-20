import * as vscode from 'vscode';

export interface ICodeLensProviderManager {
  registerCodeLensProvider(context: vscode.ExtensionContext): void;
}
