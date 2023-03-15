import * as vscode from "vscode";
import {
  deactivateJBM,
  JBMActivation,
  firstTimeActivation
} from "./util";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName}" installed!`
  );

  firstTimeActivation(context);

  let activateCommand = vscode.commands.registerCommand(
    "jetbrainsmono.activate",
    () => JBMActivation(context)
  );
  let deactivateCommand = vscode.commands.registerCommand(
    "jetbrainsmono.deactivate",
    () => deactivateJBM(context)
  );
  context.subscriptions.push(activateCommand, deactivateCommand);
}

export function deactivate(context: vscode.ExtensionContext) {
  deactivateJBM(context);
}
