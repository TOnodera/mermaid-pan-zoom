import { inject, injectable } from 'inversify';
import path from 'path';
import * as vscode from 'vscode';
import { ReactWebViewPanel } from '../../webview/ReactWebViewPanel';
import { VscodeCommand } from '../../commands/types';
import { IConfigProvider } from '../../providers/IConfigProvider';
import { PROVIDER_TYPES } from '../../providers/types';
import { CONSTANT_VALUES } from '../../types';

@injectable()
export class MermaidPanZoomOpenCommand implements VscodeCommand {
  constructor(
    @inject(CONSTANT_VALUES.Command.MermaidPanZoomOpen)
    public readonly id: string,

    @inject(PROVIDER_TYPES.IConfigProvider)
    private readonly configProvider: IConfigProvider
  ) {}

  execute(mermaidText: string, fileUri: vscode.Uri): void {
    const extentionUri = this.configProvider.getConfig().extentionUri;
    const fileName = path.basename(fileUri.toString());
    ReactWebViewPanel.render(
      extentionUri,
      this.id,
      fileName,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extentionUri, 'src/webview/dist'),
        ],
      },
      mermaidText
    );
  }
}
