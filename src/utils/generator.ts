import * as vscode from "vscode";
import { Credentials } from "../credentials";

export const generateReadme = async (credentials: Credentials) => {
  const octokit = await credentials.getOctokit();
  const userInfo = await octokit.users.getAuthenticated();

  const emails = await octokit.users.listEmailsForAuthenticatedUser();
  const email = emails.data.find((email) => email.primary)?.email;

  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
  const readmePath = `${rootPath}/README.md`;

  let readmeHeading = [
    `# ${vscode.workspace.name}`,
    "",
    "This is a sample README.md file generated by the `fosscode.generateReadme` command.",
  ].join("\n");

  let readmeHowItWorks = [
    "",
    "## How it works",
    "",
    "This is a sample How it works section.",
  ].join("\n");

  let readmeLicense = [
    "",
    "## License",
    "",
    "This is a sample License section.",
  ].join("\n");

  let readmeContributing = [
    "",
    "## Contributing",
    "",
    "This is a sample Contributing section.",
  ].join("\n");

  let readmeSupport = [
    "",
    "## Support",
    "",
    "Maintainers for this project:",
    `@${userInfo.data.login}`,
    "### Contact me",
    "",
    `Feel free to contact me at <${email}>.`,
    "",
    "Feel free to open an issue if you have any questions or suggestions.",
  ].join("\n");

  let readmeAuthors = [
    "",
    "## Authors",
    "",
    "This is a sample Authors section.",
  ].join("\n");

  const readme = readmeHeading
    .concat(readmeHowItWorks)
    .concat(readmeLicense)
    .concat(readmeContributing)
    .concat(readmeSupport)
    .concat(readmeAuthors);

  vscode.workspace.fs.writeFile(
    vscode.Uri.file(readmePath),
    Buffer.from(readme)
  );

  vscode.workspace.openTextDocument(readmePath).then((doc) => {
    vscode.window.showTextDocument(doc);
  });
};
