/**
 * @file src/audits/index.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains all audits to be ran.
 */
import communityStandards from "./communityStandards";
import repoSettings from "./repoSettings";

export default async () => {
  // await communityStandards();
  await repoSettings();
};
