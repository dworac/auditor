/**
 * @file src/audits/communityGuidelines/auditRepo.ts
 * @author dworac <mail@dworac.com>
 *
 * This file audits each one of the repos for the community guidelines audit.
 */
import { Octokit } from "@octokit/rest";
import { RepoSettingsResults } from "./repoSettingsResults";
import repoSettingsIssue from "./repoSettingsIssue";

export default async (
  installationClient: Octokit,
  owner: string,
  name: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rule: any) => rule.pattern === "master"
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDefaultBranch = await installationClient.graphql<any>(`
    {
        repository(owner: "${owner}", name: "${name}") {
            defaultBranchRef {
                name
            }
        }
    }
    `);

  const defaultBranch = getDefaultBranch.repository.defaultBranchRef.name;

  const results: RepoSettingsResults = {
    repoName: name,
    owner,
    masterHasBranchProtection: !!masterBranchProtection,
    defaultBranchIsMaster: defaultBranch === "master",
  };

  await repoSettingsIssue(installationClient, results);
};
