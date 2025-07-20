/**
 * vscodeで実行するコマンド
 * callback: (...args: any[]) => any
 * で定義されているのany型を使っている
 */
export interface VscodeCommand {
  /**
   * 識別用ID
   */
  id: string;
  /**
   * コマンド本体
   * @param args
   * @returns
   */
  execute: (...args: any[]) => any;
}

/**
 * インジェクションで使う識別子登録
 */
export const COMMAND_TYPES = {
  VscodeCommand: Symbol('VscodeCommand'),
  VscodeCommandManager: Symbol('VscodeCommandManager'),
} as const;

export const COMMAND_NAMES = {
  MermaidPanZoomOpen: 'mermaidPanZoom.open',
} as const;
