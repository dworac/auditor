import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import config from "../config";

const octokitClient = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: config.GITHUB_APP_ID,
    privateKey: config.GITHUB_APP_PRIVATE_KEY,
    clientId: config.GITHUB_APP_CLIENT_ID,
    clientSecret: config.GITHUB_APP_CLIENT_SECRET,
  },
});

export const getAppInstallationIds = async () => {
  const installations = await octokitClient.request("GET /app/installations");
  return installations.data.map((installation) => installation.id);
};

export const getOctokitClientForInstallation = (installationId: number) => {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.GITHUB_APP_ID,
      privateKey: config.GITHUB_APP_PRIVATE_KEY,
      clientId: config.GITHUB_APP_CLIENT_ID,
      clientSecret: config.GITHUB_APP_CLIENT_SECRET,
      installationId,
    },
  });
};
