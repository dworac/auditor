import { Octokit } from "@octokit/rest";
import config from "../config";

const octokit = new Octokit({ auth: config.GITHUB_TOKEN });

const getRepos = async () => {
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({});

  const filtered = repos.filter((repo) => repo.name === "to-delete");

  return filtered;
};

export default getRepos;
