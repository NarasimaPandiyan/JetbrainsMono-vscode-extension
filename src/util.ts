import * as vscode from "vscode";
import path = require("path");
import { defaultSettings, GeneralObject } from "./defaultSettings";

const showDialog = vscode.window.showInformationMessage;

const JBMPath = (context: vscode.ExtensionContext) =>
  path.resolve(context.extensionPath, "JetBrainsMono");

const updateUserSettings = (settings: GeneralObject, remove = false) =>
  Object.entries(settings).forEach(([key, value]) =>
    vscode.workspace
      .getConfiguration()
      .update(
        key,
        remove ? undefined : value,
        vscode.ConfigurationTarget.Global
      )
  );

export function dirOpen(dirPath: string) {
  let command = "";
  switch (process.platform) {
    case "darwin":
      command = "open";
      break;
    case "win32":
      command = "explorer";
      break;
    default:
      command = "xdg-open";
      break;
  }
  return require("child_process").exec(`${command} ${dirPath}`);
}

export function JBMActivation(context: vscode.ExtensionContext) {
  const JBMAddress = JBMPath(context);
  updateUserSettings(defaultSettings);
  dirOpen(JBMAddress);
  showDialog(`${context.extension.packageJSON.displayName} is activated!`);
  showDialog(
    `Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JBMAddress}`
  );
}

export const JBMActivationPrompt = (context: vscode.ExtensionContext) =>
  showDialog("Activate JetBrains Mono?", "Yes", "No").then((value) =>
    value === "Yes"
      ? JBMActivation(context)
      : (showDialog(
          "You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JBM' in command palette."
        ) as any)
  );

export function firstTimeActivation(context: vscode.ExtensionContext) {
  const version = context.extension.packageJSON.version ?? "1.0.0";
  const previousVersion = context.globalState.get(context.extension.id);
  if (previousVersion === version) return;

  JBMActivation(context);
  context.globalState.update(context.extension.id, version);
}

export function deactivateJBM(context: vscode.ExtensionContext) {
  // context.globalState.update(context.extension.id, undefined);
  updateUserSettings(defaultSettings, true);
  showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}
