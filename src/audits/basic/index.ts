import Logger from "@dworac/logger";
import { markdownTable } from "markdown-table";
import octokitClient from "../../providers/octokitClient";
import getRepos from "../../Queries/getRepos";

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

const auditIssue = async (basicAudit: BasicAudit) => {
  // find an issue with the lable "audit" if it exists, update description otherwise create it
  const { data: issues } = await octokitClient.rest.issues.listForRepo({
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
    if (typeof v === "boolean") {
      return true;
    }
    return false;
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
    await octokitClient.rest.issues.update({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      issue_number: issue.number,
      body: mdTable,
      title,
    });
  } else {
    await octokitClient.rest.issues.create({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      labels: ["audit"],
      body: mdTable,
      title,
    });
  }
};

const fileExists = async (owner: string, repoName: string, path: string) => {
  try {
    await octokitClient.rest.repos.getContent({
      owner,
      repo: repoName,
      path,
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const audit = async (owner: string, name: string) => {
  const repo = await octokitClient.repos.get({
    repo: name,
    owner,
  });

  // check if repo contains a readme
  const readmeExists = await fileExists(owner, name, "README.md");
  // check if code of conduct exists
  const codeOfConductExists = await fileExists(
    owner,
    name,
    "CODE_OF_CONDUCT.md"
  );
  // check if contributing exists
  const contributingExists = await fileExists(owner, name, "CONTRIBUTING.md");
  // check if license exists
  const licenseExists = await fileExists(owner, name, "LICENSE.md");
  // check if security policy exists
  const securityPolicyExists = await fileExists(owner, name, "SECURITY.md");

  // check if repo has issue templates
  const hasIssueTemplates = await fileExists(
    owner,
    name,
    ".github/ISSUE_TEMPLATE"
  );

  // check if repo has pull request templates
  const hasPullRequestTemplates = await fileExists(
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

  await auditIssue(basicAudit);
};

export default async () => {
  // basicAudit("dworac", "to-delete");
  const repos = await getRepos();

  Logger.logInfo(`Auditing ${repos.length} repos...`);

  for (let i = 0; i < 1; i += 1) {
    const repo = repos[i];
    Logger.logInfo(`Auditing ${repo.name}...`);
    // eslint-disable-next-line no-await-in-loop
    await audit(repo.owner.login, repo.name);
  }
};
