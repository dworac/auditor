/**
 * @file src/queries/pathExists.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains the pathExists query. It checks if a path exists in a repo.
 */
import { Octokit } from "@octokit/rest";

/**
 *
 * @param {Octokit} installationClient - The Octokit client for the installation
 * @param {string} owner - The owner of the repo
 * @param {string} repoName - The name of the repo
 * @param {string} path - The path to check
 * @returns {Promise<boolean>} - True if the path exists, false otherwise
 */
export default async (
  installationClient: Octokit,
  owner: string,
  repoName: string,
  path: string
) => {
  try {
    await installationClient.rest.repos.getContent({
      owner,
      repo: repoName,
      path,
    });
    return true;
  } catch (e) {
    return false;
  }
};
