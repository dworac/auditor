/**
 * @file src/audits/index.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains all audits to be ran.
 */
import communityGuidelines from "./communityGuidelines";
import repoSettings from "./repoSettings";

export default async () => {
  // await communityGuidelines();
  await repoSettings();
};
