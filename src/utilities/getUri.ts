import { Uri, Webview } from "vscode";

/**
 * vscodeのWebviewで使用するURIを生成するヘルパー関数
 * @param webview
 * @param extensionUri
 * @param pathList
 * @returns
 */
export function getUriForVsCodeWebView(
  webview: Webview,
  extensionUri: Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}
