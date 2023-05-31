/**
 * @file src/audits/index.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains all audits to be ran.
 */
import communityGuidelines from "./communityGuidelines/communityGuidelines";

export default async () => {
  await communityGuidelines();
};
