/**
 * @file src/audits/communityGuidelines/communityGuidelines.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains the community guidelines audit.
 */
import Logger from "@dworac/logger";
import {
  getAppInstallationIds,
  getOctokitClientForInstallation,
} from "../../providers/octokitClient";
import auditRepo from "./auditRepo";

export default async () => {
  const installationIds = await getAppInstallationIds();

  Logger.logInfo(`Auditing ${installationIds.length} installations...`);

  for (let i = 0; i < installationIds.length; i += 1) {
    const installationId = installationIds[i];
    const installationClient = getOctokitClientForInstallation(installationId);

    // eslint-disable-next-line no-await-in-loop
    const { data: repos } = await installationClient.request(
      "GET /installation/repositories"
    );
    Logger.logInfo(
      `Auditing ${repos.total_count} repos for installation ${installationId}...`
    );

    for (let j = 0; j < repos.repositories.length; j += 1) {
      const repo = repos.repositories[j];
      Logger.logInfo(`Auditing ${repo.full_name}...`);
      // eslint-disable-next-line no-await-in-loop
      await auditRepo(installationClient, repo.owner.login, repo.name);
    }
  }
};
