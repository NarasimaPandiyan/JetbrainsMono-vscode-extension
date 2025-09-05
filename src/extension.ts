import * as vscode from "vscode";
import {
  deactivateJBM,
  JBMActivation,
  firstTimeActivation
} from "./util";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Use globalThis.console for Node.js compatibility
  globalThis.console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName}" installed!`
  );

  firstTimeActivation(context);

  const activateCommand = vscode.commands.registerCommand(
    "jetbrainsmono.activate",
    () => JBMActivation(context)
  );
  const deactivateCommand = vscode.commands.registerCommand(
    "jetbrainsmono.deactivate",
    () => deactivateJBM(context)
  );
  context.subscriptions.push(activateCommand, deactivateCommand);
}

export function deactivate(context: vscode.ExtensionContext): void {
  deactivateJBM(context);
}