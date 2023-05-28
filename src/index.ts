/**
 * @file index.ts
 * @author dworac <mail@dworac.com>
 *
 * This is the entry point for the application.
 */

import Logger from "@dworac/logger";
import audits from "./audits";

/**
 * Main function.
 */
async function main() {
  await audits();
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
