import * as assert from "assert";
import * as vscode from "vscode";
import { suite, test } from "mocha";
import { defaultSettings } from "../../defaultSettings";
import { jbmPath, deactivateJBM } from "../../util";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("defaultSettings contains expected configuration", () => {
    assert.strictEqual(defaultSettings["editor.fontFamily"], "JetBrains Mono");
    assert.strictEqual(defaultSettings["editor.fontLigatures"], true);
  });

  test("jbmPath constructs path to JetBrainsMono directory", () => {
    const mockContext = {
      extensionPath: "/test/path"
    } as vscode.ExtensionContext;

    const resolved = jbmPath(mockContext);
    assert.ok(resolved.endsWith("JetBrainsMono"));
  });

  test("deactivateJBM handles undefined context safely", () => {
    assert.doesNotThrow(() => {
      deactivateJBM();
    });
  });

  test("Commands jetbrainsmono.activate and jetbrainsmono.deactivate are registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("jetbrainsmono.activate"));
    assert.ok(commands.includes("jetbrainsmono.deactivate"));
  });
});