/**
 * @file index.ts
 * @author dworac <mail@dworac.com>
 *
 * This is the entry point for the application.
 */

import Logger from "@dworac/logger";
import { App } from "@octokit/app";
import { createServer } from "node:http";

import { App, createNodeMiddleware } from "octokit";

import config from "./config";
import onIssue from "./onIssue";

const { Server, Probot } = require("probot");

/**
 * Main function.
 */
async function main() {
  // await audits();
  // const app = new App({
  //   appId: config.GITHUB_APP_ID,
  //   privateKey: config.GITHUB_APP_PRIVATE_KEY,
  //   webhooks: {
  //     secret: "development",
  //     webhookProxy: "https://smee.io/CvDjZzSERMQo2ZC",
  //   },
  //   oauth: {
  //     clientId: config.GITHUB_APP_CLIENT_ID,
  //     clientSecret: config.GITHUB_APP_CLIENT_SECRET,
  //   },
  // });
  //
  // app.webhooks.on("issues.opened", ({ octokit, payload }) => {
  //   console.log("issue opened");
  //   return octokit.rest.issues.createComment({
  //     owner: payload.repository.owner.login,
  //     repo: payload.repository.name,
  //     body: "Hello, World!",
  //   });
  // });
  //
  // // Your app can now receive webhook events at `/api/github/webhooks`
  // createServer(createNodeMiddleware(app)).listen(3000);

  const server = new Server({
    Probot: Probot.defaults({
      appId: config.GITHUB_APP_ID,
      privateKey: config.GITHUB_APP_PRIVATE_KEY,
      secret: "development",
    }),
    webhookProxy: "https://smee.io/CvDjZzSERMQo2ZC",
  });

  await server.load(onIssue);

  server.start();
}

main().catch((e) => {
  Logger.logError(e);
  process.exit(1);
});
