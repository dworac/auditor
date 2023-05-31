/**
 * @file src/audits/communityGuidelines/auditRepo.ts
 * @author dworac <mail@dworac.com>
 *
 * This file audits each one of the repos for the community guidelines audit.
 */
import { Octokit } from "@octokit/rest";
import pathExists from "../../queries/pathExists";
import communityGuidelinesIssue from "./repoSettingsIssue";
import { RepoSettingsResults } from "./repoSettingsResults";
import repoSettingsIssue from "./repoSettingsIssue";

export default async (
  installationClient: Octokit,
  owner: string,
  name: string
) => {
  const branchProtections = await installationClient.graphql<any>(`
{
  repository(owner: "${owner}", name: "${name}") {
    branchProtectionRules(first: 10) {
      nodes {
        lockBranch
        id
        pattern
        allowsForcePushes
        allowsDeletions
        isAdminEnforced
        restrictsPushes
        requiresCodeOwnerReviews
      }
    }
  }
}`);

  const masterBranchProtection =
    branchProtections.repository.branchProtectionRules.nodes.find(
      (rule: any) => rule.pattern === "master"
    );

  const results: RepoSettingsResults = {
    repoName: name,
    owner,
    masterHasBranchProtection: !!masterBranchProtection,
  };

  console.log(results);

  //
  // // check if repo contains a readme
  // const readmeExists = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "README.md"
  // );
  // // check if code of conduct exists
  // const codeOfConductExists = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "CODE_OF_CONDUCT.md"
  // );
  // // check if contributing exists
  // const contributingExists = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "CONTRIBUTING.md"
  // );
  // // check if license exists
  // const licenseExists = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "LICENSE.md"
  // );
  // // check if security policy exists
  // const securityPolicyExists = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "SECURITY.md"
  // );
  //
  // // check if repo has issue templates
  // const hasIssueTemplates = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   ".github/ISSUE_TEMPLATE"
  // );
  //
  // // check if repo has pull request templates
  // const hasPullRequestTemplates = await pathExists(
  //   installationClient,
  //   owner,
  //   name,
  //   "pull_request_template.md"
  // );
  //
  // const basicAudit: RepoSettingsResults = {
  //   repoName: name,
  //   owner,
  //   hasDescription: repo.data.description !== null,
  //   hasHomepage: repo.data.homepage !== null,
  //   hasReadme: readmeExists,
  //   hasCodeOfConduct: codeOfConductExists,
  //   hasContributing: contributingExists,
  //   hasLicense: licenseExists,
  //   hasSecurityPolicy: securityPolicyExists,
  //   hasIssueTemplate: hasIssueTemplates,
  //   hasPullRequestTemplate: hasPullRequestTemplates,
  // };
  //
  // await communityGuidelinesIssue(installationClient, basicAudit);
  await repoSettingsIssue(installationClient, results);
};
