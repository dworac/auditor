import Logger from "@dworac/logger";
import { markdownTable } from "markdown-table";
import { Octokit } from "@octokit/rest";
import {
  getAppInstallationIds,
  getOctokitClientForInstallation,
} from "../../providers/octokitClient";

export interface BasicAudit {
  repoName: string;
  owner: string;
  hasDescription: boolean;
  hasHomepage: boolean;
  hasReadme: boolean;
  hasCodeOfConduct: boolean;
  hasContributing: boolean;
  hasLicense: boolean;
  hasSecurityPolicy: boolean;
  hasIssueTemplate: boolean;
  hasPullRequestTemplate: boolean;
}

const auditIssue = async (
  installationClient: Octokit,
  basicAudit: BasicAudit
) => {
  // find an issue with the lable "audit" if it exists, update description otherwise create it
  const { data: issues } = await installationClient.rest.issues.listForRepo({
    owner: basicAudit.owner,
    repo: basicAudit.repoName,
    labels: "audit",
  });

  let mdTable = markdownTable([
    ["Validations", "Result"],
    ["Has description", basicAudit.hasDescription ? "✅" : "❌"],
    ["Has homepage", basicAudit.hasHomepage ? "✅" : "❌"],
    ["Has readme", basicAudit.hasReadme ? "✅" : "❌"],
    ["Has code of conduct", basicAudit.hasCodeOfConduct ? "✅" : "❌"],
    ["Has contributing", basicAudit.hasContributing ? "✅" : "❌"],
    ["Has license", basicAudit.hasLicense ? "✅" : "❌"],
    ["Has security policy", basicAudit.hasSecurityPolicy ? "✅" : "❌"],
    ["Has issue template", basicAudit.hasIssueTemplate ? "✅" : "❌"],
    [
      "Has pull request template",
      basicAudit.hasPullRequestTemplate ? "✅" : "❌",
    ],
  ]);

  const score = Object.values(basicAudit).filter((v) => {
    if (typeof v === "boolean") {
      return v;
    }
    return false;
  }).length;

  const totalBoolean = Object.values(basicAudit).filter((v) => {
    return typeof v === "boolean";
  }).length;

  const scorePercentage = Math.round((score / totalBoolean) * 100);

  mdTable = `
## 🔬 [Audit] Community Standards ${scorePercentage}% 

Here how this project compares to [recommended community standards](https://opensource.guide/)
These guidelines are not mandatory, but they are a good starting point for maintaining a healthy, collaborative community.

${mdTable}
  `;

  const title = `🔬 [Audit] Community Standards ${scorePercentage}%`;

  if (issues.length > 0) {
    const issue = issues[0];
    await installationClient.rest.issues.update({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      issue_number: issue.number,
      body: mdTable,
      title,
    });
  } else {
    await installationClient.rest.issues.create({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      labels: ["audit"],
      body: mdTable,
      title,
    });
  }
};

const fileExists = async (
  installationClient: Octokit,
  owner: string,
  repoName: string,
  path: string
) => {
  try {
    await installationClient.rest.repos.getContent({
      owner,
      repo: repoName,
      path,
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const audit = async (
  installationClient: Octokit,
  owner: string,
  name: string
) => {
  const repo = await installationClient.repos.get({
    repo: name,
    owner,
  });

  // check if repo contains a readme
  const readmeExists = await fileExists(
    installationClient,
    owner,
    name,
    "README.md"
  );
  // check if code of conduct exists
  const codeOfConductExists = await fileExists(
    installationClient,
    owner,
    name,
    "CODE_OF_CONDUCT.md"
  );
  // check if contributing exists
  const contributingExists = await fileExists(
    installationClient,
    owner,
    name,
    "CONTRIBUTING.md"
  );
  // check if license exists
  const licenseExists = await fileExists(
    installationClient,
    owner,
    name,
    "LICENSE.md"
  );
  // check if security policy exists
  const securityPolicyExists = await fileExists(
    installationClient,
    owner,
    name,
    "SECURITY.md"
  );

  // check if repo has issue templates
  const hasIssueTemplates = await fileExists(
    installationClient,
    owner,
    name,
    ".github/ISSUE_TEMPLATE"
  );

  // check if repo has pull request templates
  const hasPullRequestTemplates = await fileExists(
    installationClient,
    owner,
    name,
    "pull_request_template.md"
  );

  const basicAudit: BasicAudit = {
    repoName: name,
    owner,
    hasDescription: repo.data.description !== null,
    hasHomepage: repo.data.homepage !== null,
    hasReadme: readmeExists,
    hasCodeOfConduct: codeOfConductExists,
    hasContributing: contributingExists,
    hasLicense: licenseExists,
    hasSecurityPolicy: securityPolicyExists,
    hasIssueTemplate: hasIssueTemplates,
    hasPullRequestTemplate: hasPullRequestTemplates,
  };

  await auditIssue(installationClient, basicAudit);
};

export default async () => {
  const installationIds = await getAppInstallationIds();

  Logger.logInfo(`Auditing ${installationIds.length} installations...`);

  for (let i = 0; i < installationIds.length; i += 1) {
    const installationId = installationIds[i];
    const installationClient = getOctokitClientForInstallation(installationId);

    // eslint-disable-next-line no-await-in-loop
    const { data: repos } = await installationClient.request(
      "GET /installation/repositories"
    );
    Logger.logInfo(
      `Auditing ${repos.total_count} repos for installation ${installationId}...`
    );

    for (let j = 0; j < repos.repositories.length; j += 1) {
      const repo = repos.repositories[j];
      Logger.logInfo(`Auditing ${repo.full_name}...`);
      // eslint-disable-next-line no-await-in-loop
      await audit(installationClient, repo.owner.login, repo.name);
    }
  }
};
