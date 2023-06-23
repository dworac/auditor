/**
 * @file src/audits/communityGuidelines/issue.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains the method to create or update the issue for the community guidelines audit.
 */
import { Octokit } from "@octokit/rest";
import { markdownTable } from "markdown-table";
import { CommunityStandardsResults } from "./communityStandardsResults";

/**
 * Creates or updates the issue for the community guidelines audit.
 *
 * @param {Octokit} installationClient - The Octokit client for the installation.
 * @param {CommunityStandardsResults} basicAudit - The basic audit data.
 */
export default async (
  installationClient: Octokit,
  basicAudit: CommunityStandardsResults
) => {
  let mdTable = markdownTable([
    ["Validations", "Result", "Docs"],
    [
      "Has description",
      basicAudit.hasDescription ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/github-settings)",
    ],
    [
      "Has homepage",
      basicAudit.hasHomepage ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/github-settings)",
    ],
    [
      "Has readme",
      basicAudit.hasReadme ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/readme-docs)",
    ],
    [
      "Has code of conduct",
      basicAudit.hasCodeOfConduct ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/code-of-conduct)",
    ],
    [
      "Has contributing",
      basicAudit.hasContributing ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/contributing)",
    ],
    [
      "Has license",
      basicAudit.hasLicense ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/license)",
    ],
    [
      "Has security policy",
      basicAudit.hasSecurityPolicy ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/security-policy)",
    ],
    [
      "Has issue template",
      basicAudit.hasIssueTemplate ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/issue-templates)",
    ],
    [
      "Has pull request template",
      basicAudit.hasPullRequestTemplate ? "&nbsp;&nbsp;✅" : "&nbsp;&nbsp;❌",
      "[open](https://docs.dworac.com/repositories/community-standards/pr-templates)",
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

  // find an issue with the lable "audit" if it exists, update description otherwise create it
  const { data: issues } = await installationClient.rest.issues.listForRepo({
    owner: basicAudit.owner,
    repo: basicAudit.repoName,
    labels: "community-guidelines-audit",
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
      labels: ["community-guidelines-audit"],
      body: mdTable,
      title,
      assignee: basicAudit.owner,
    });
  }
};
