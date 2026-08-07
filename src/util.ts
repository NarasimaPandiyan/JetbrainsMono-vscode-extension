import * as vscode from "vscode";
import * as path from "path";
import * as cp from "child_process";
import { defaultSettings, GeneralObject } from "./defaultSettings";

const showDialog = vscode.window.showInformationMessage;

export const jbmPath = (context: vscode.ExtensionContext): string =>
  path.resolve(context.extensionPath, "JetBrainsMono");

export const updateUserSettings = (settings: GeneralObject, remove = false): void => {
  Object.entries(settings).forEach(([key, value]: [string, any]) =>
    vscode.workspace
      .getConfiguration()
      .update(
        key,
        remove ? undefined : value,
        vscode.ConfigurationTarget.Global
      )
  );
};

export function dirOpen(dirPath: string): cp.ChildProcess {
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
  return cp.exec(`${command} "${dirPath}"`, (err) => {
    if (err) {
      globalThis.console.error(`Failed to open directory ${dirPath}: ${err.message}`);
    }
  });
}

export function jbmActivation(context: vscode.ExtensionContext): void {
  const jbmAddress = jbmPath(context);
  updateUserSettings(defaultSettings);
  dirOpen(jbmAddress);
  showDialog(`${context.extension.packageJSON.displayName} is activated!`);
  showDialog(
    `Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${jbmAddress}`
  );
}

export const jbmActivationPrompt = (context: vscode.ExtensionContext): Thenable<string | undefined> =>
  showDialog("Activate JetBrains Mono?", "Yes", "No").then((value: string | undefined) => {
    if (value === "Yes") {
      jbmActivation(context);
      return value;
    } else {
      showDialog(
        "You can activate JetBrains Mono later by running 'Activate JetBrains Mono Font pack' in command palette."
      );
      return value;
    }
  });

export function firstTimeActivation(context: vscode.ExtensionContext): void {
  const version = context.extension.packageJSON.version ?? "1.0.0";
  const previousVersion = context.globalState.get<string>(context.extension.id);
  if (previousVersion === version) return;

  jbmActivationPrompt(context);
  context.globalState.update(context.extension.id, version);
}

export function deactivateJBM(context?: vscode.ExtensionContext): void {
  updateUserSettings(defaultSettings, true);
  const displayName = context?.extension?.packageJSON?.displayName ?? "JetBrains Mono";
  showDialog(`${displayName} is deactivated!`);
}

// Backwards compatibility aliases
export const JBMPath = jbmPath;
export const JBMActivation = jbmActivation;
export const JBMActivationPrompt = jbmActivationPrompt;