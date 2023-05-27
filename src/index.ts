/**
 * @file index.ts
 * @author dworac <mail@dworac.com>
 *
 * This is the entry point for the application.
 */

import Logger from "@dworac/logger";
import sum from "./sum";
import getProjectsV2Numbers from "./Queries/getProjectsV2Numbers";
import getProjectV2BasicInfo from "./Queries/getProjectV2BasicInfo";

/**
 * Main function.
 */
async function main() {
  const res = sum(1, 2);
  Logger.logInfo(`1 + 2 = ${res}`);

  const numbers = await getProjectsV2Numbers();
  console.log(numbers);

  for (let i = 0; i < numbers.length; i += 1) {
    const basicInfo = await getProjectV2BasicInfo(numbers[i]);
    console.log(basicInfo);
  }
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
