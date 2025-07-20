import { Container } from 'inversify';
import * as vscode from 'vscode';
import { PROVIDER_TYPES } from '../providers/types';
import { MermaidCodeLensProvider } from '../infrastructure/providers/MermaidCodeLensProvider';
import { ICommandsManager } from '../commands/ICommandsManager';
import { COMMAND_NAMES, COMMAND_TYPES, VscodeCommand } from '../commands/types';
import { CommandsManager } from '../infrastructure/commands/CommandsManager';
import { MermaidPanZoomOpenCommand } from '../infrastructure/commands/MermaidPanZoomOpenCommand';
import { IConfigProvider } from '../providers/IConfigProvider';
import { ICodeLensProviderManager } from '../providers/ICodeLensProviderManager';
import { CodeLensProviderManager } from '../infrastructure/providers/CodeLensProviderManager';
import 'reflect-metadata';
import { CONSTANT_VALUES } from '../types';

// DIコンテナ作成
const container = new Container();
container
  .bind<vscode.CodeLensProvider>(PROVIDER_TYPES.IMermaidCodeLensProvider)
  .to(MermaidCodeLensProvider)
  .inSingletonScope();
container
  .bind<ICommandsManager>(COMMAND_TYPES.VscodeCommandManager)
  .to(CommandsManager)
  .inSingletonScope();
container
  .bind<VscodeCommand>(COMMAND_TYPES.VscodeCommand)
  .to(MermaidPanZoomOpenCommand)
  .inSingletonScope();
container
  .bind<string>(CONSTANT_VALUES.Command.MermaidPanZoomOpen)
  .toConstantValue(COMMAND_NAMES.MermaidPanZoomOpen);
container
  .bind<ICodeLensProviderManager>(PROVIDER_TYPES.ICodeLensProviderManager)
  .to(CodeLensProviderManager)
  .inSingletonScope();

export const containerFactory = (context: vscode.ExtensionContext) => {
  container
    .bind<IConfigProvider>(PROVIDER_TYPES.IConfigProvider)
    // contextに応じて動的に設定を取得する
    .toConstantValue({
      getConfig: () => ({
        extentionUri: context.extensionUri,
      }),
    });
  return container;
};
