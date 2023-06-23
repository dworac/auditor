/**
 * @file src/audits/communityGuidelines/CommunityGuidelinesResume.ts
 * @author dworac <mail@dworac>
 *
 * This interface is used to store the results of the community guidelines audit.
 */
export interface CommunityStandardsResults {
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
