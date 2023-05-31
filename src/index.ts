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
  //
  // const appOctokit = new Octokit({
  //   authStrategy: createAppAuth,
  //   auth: {
  //     appId: config.GITHUB_APP_ID,
  //     privateKey: config.GITHUB_APP_PRIVATE_KEY,
  //     clientId: config.GITHUB_APP_CLIENT_ID,
  //     clientSecret: config.GITHUB_APP_CLIENT_SECRET,
  //   },
  // });
  //
  // // logged in as:
  //
  // const loggedInUser = await appOctokit.request("GET /app");
  // console.log(loggedInUser.data.slug);
  //
  // const installations = await appOctokit.request("GET /app/installations");
  // const installationIds = installations.data.map(
  //   (installation) => installation.id
  // );
  // console.log(`Found ${installationIds.length} installations`);
  // console.log(installationIds);
  //
  // for (const installationId of installationIds) {
  //   console.log(installationId);
  //
  //   const client = new Octokit({
  //     authStrategy: createAppAuth,
  //     auth: {
  //       appId: config.GITHUB_APP_ID,
  //       privateKey: config.GITHUB_APP_PRIVATE_KEY,
  //       clientId: config.GITHUB_APP_CLIENT_ID,
  //       clientSecret: config.GITHUB_APP_CLIENT_SECRET,
  //       installationId,
  //     },
  //   });
  //
  //   const repos = await client.request("GET /installation/repositories");
  //
  //   console.log("repos", repos.data.repositories[0].name);
  // }
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
