import * as vscode from "vscode";
import { SidebarProvider } from "./view";
import { generateReadme } from "./utils";
import { Credentials } from "./credentials";

export function activate(context: vscode.ExtensionContext) {
  const credentials = new Credentials();
  const sidebar = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.commands.registerCommand("fosscode.loginToGitHub", async () => {
      await credentials.initialize(context);
      const octokit = await credentials.getOctokit();
      const userInfo = await octokit.users.getAuthenticated();
      vscode.window.showInformationMessage(
        `Logged into GitHub as ${userInfo.data.login}`
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(`fosscode.generateReadme`, async () => {
      await generateReadme(credentials);
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("fosscode-sidebar", sidebar)
  );
}

export function deactivate() {}
