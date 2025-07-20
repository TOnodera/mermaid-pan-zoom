import { injectable, multiInject } from 'inversify';
import * as vscode from 'vscode';
import { COMMAND_TYPES, VscodeCommand } from '../../commands/types';
import { ICommandsManager } from '../../commands/ICommandsManager';

@injectable()
export class CommandsManager implements ICommandsManager {
  constructor(
    @multiInject(COMMAND_TYPES.VscodeCommand) private commands: VscodeCommand[]
  ) {}

  registerCommands(context: vscode.ExtensionContext): void {
    this.commands.forEach((command) => {
      context.subscriptions.push(
        vscode.commands.registerCommand(command.id, (...args) =>
          command.execute(...args)
        )
      );
    });
  }
}
