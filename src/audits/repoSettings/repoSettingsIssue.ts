/**
 * @file src/audits/communityGuidelines/issue.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains the method to create or update the issue for the community guidelines audit.
 */
import { Octokit } from "@octokit/rest";
import { markdownTable } from "markdown-table";
import { RepoSettingsResults } from "./repoSettingsResults";

/**
 * Creates or updates the issue for the community guidelines audit.
 *
 * @param {Octokit} installationClient - The Octokit client for the installation.
 * @param {RepoSettingsResults} basicAudit - The basic audit data.
 */
export default async (
  installationClient: Octokit,
  basicAudit: RepoSettingsResults
) => {
  let mdTable = markdownTable([
    ["Validations", "Result"],
    [
      "Master branch is protected",
      basicAudit.masterHasBranchProtection ? "✅" : "❌",
    ],
    [
      "Master as default branch",
      basicAudit.defaultBranchIsMaster ? "✅" : "❌",
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
## 🔬 [Audit] Repository Settings ${scorePercentage}% 

Here how this project compares to [recommended community standards](https://opensource.guide/)
These guidelines are not mandatory, but they are a good starting point for maintaining a healthy, collaborative community.

${mdTable}
  `;

  const title = `🔬 [Audit] Repository Settings ${scorePercentage}%`;

  // find an issue with the lable "audit" if it exists, update description otherwise create it
  const { data: issues } = await installationClient.rest.issues.listForRepo({
    owner: basicAudit.owner,
    repo: basicAudit.repoName,
    labels: "repository-settings-audit",
  });

  if (issues.length > 0) {
    const issue = issues[0];
    await installationClient.rest.issues.update({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      issue_number: issue.number,
      body: mdTable,
      title,
      assignee: basicAudit.owner,
    });
  } else {
    await installationClient.rest.issues.create({
      owner: basicAudit.owner,
      repo: basicAudit.repoName,
      labels: ["repository-settings-audit"],
      body: mdTable,
      title,
      assignee: basicAudit.owner,
    });
  }
};
