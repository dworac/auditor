/**
 * @file src/audits/communityGuidelines/CommunityGuidelinesResume.ts
 * @author dworac <mail@dworac>
 *
 * This interface is used to store the results of the community guidelines audit.
 */
export interface RepoSettingsResults {
  repoName: string;
  owner: string;
  masterHasBranchProtection: boolean;
  defaultBranchIsMaster: boolean;
}
