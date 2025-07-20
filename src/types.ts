import * as vscode from 'vscode';
export interface ApplicationConfig {
  extentionUri: vscode.Uri;
}

export const CONSTANT_VALUES = {
  Command: {
    MermaidPanZoomOpen: Symbol('COMMAND.MERMAID_PAN_ZOOM_OPEN'),
  },
} as const;
