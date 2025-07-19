import * as vscode from 'vscode';
import { getUriForVsCodeWebView } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';
import * as fs from 'fs';
import { findMermaidBlocks } from '../utilities/findMermaidBlocks';

export class ReactWebViewPanel {
  public static currentPanel: ReactWebViewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    mermaidText: string
  ) {
    this._panel = panel;
    // パネルをとじたときのイベントを登録
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    // htmlコンテンツを設定
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );

    // メッセージ受信時の処理
    this._panel.webview.onDidReceiveMessage(
      async (message: { type: string }) => {
        if (message.type === 'get-mermaid') {
          // マーメイド取得する処理
          console.log(mermaidText);
          this._panel.webview.postMessage({
            type: 'send-mermaid',
            payload: mermaidText,
          });
        }
      }
    );
  }

  public static render(
    extentionUri: vscode.Uri,
    panelViewType: string,
    panelTitle: string,
    viewColumn: vscode.ViewColumn,
    config: vscode.WebviewPanelOptions & vscode.WebviewOptions,
    mermaidText: string
  ): void {
    if (!ReactWebViewPanel.currentPanel) {
      const panel = vscode.window.createWebviewPanel(
        panelViewType,
        panelTitle,
        viewColumn,
        config
      );
      ReactWebViewPanel.currentPanel = new ReactWebViewPanel(
        panel,
        extentionUri,
        mermaidText
      );
    }
    ReactWebViewPanel.currentPanel?._panel.reveal(vscode.ViewColumn.Beside);
  }

  private _getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ): string {
    // ファイルを読み込んでリソースパスを置換
    const indexPath = vscode.Uri.joinPath(
      extensionUri,
      'src',
      'webview',
      'dist',
      'index.html'
    );
    const html = fs.readFileSync(indexPath.fsPath, 'utf8');
    // vscodeのWebview URIに変換
    const replacedHtml = html.replace(
      /(src|href)="(.+?)"/g,
      (match, attr, src) => {
        const resourceUri = vscode.Uri.joinPath(
          extensionUri,
          'src',
          'webview',
          'dist',
          src
        );
        const webviewUri = webview.asWebviewUri(resourceUri);
        return `${attr}="${webviewUri}"`;
      }
    );
    // csp nonceを生成してスクリプトタグに追加
    const nonce = getNonce();
    const replacedHtmlWithNonce = replacedHtml.replace(
      /<script([^>]*?)>/g,
      `<script$1 nonce="${nonce}">`
    );

    return replacedHtmlWithNonce;
  }

  public dispose() {
    ReactWebViewPanel.currentPanel = undefined;
    this._disposables.forEach((d) => d.dispose());
  }
}
