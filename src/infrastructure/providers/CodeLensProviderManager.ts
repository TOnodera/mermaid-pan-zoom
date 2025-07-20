import { inject, injectable, multiInject } from 'inversify';
import * as vscode from 'vscode';
import { PROVIDER_TYPES } from '../../providers/types';
import { ICodeLensProviderManager } from '../../providers/ICodeLensProviderManager';

@injectable()
export class CodeLensProviderManager implements ICodeLensProviderManager {
  constructor(
    @inject(PROVIDER_TYPES.IMermaidCodeLensProvider)
    private mermaidCodeLensProvider: vscode.CodeLensProvider
  ) {}
  registerCodeLensProvider(context: vscode.ExtensionContext) {
    // プロバイダー登録
    const mermaidCodeLensProvider = vscode.languages.registerCodeLensProvider(
      { language: 'markdown' },
      this.mermaidCodeLensProvider
    );
    context.subscriptions.push(mermaidCodeLensProvider);
  }
}
