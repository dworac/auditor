/**
 * @param repositoryName
 * @file src/audits/repoSettings/repositoryNameConvention.ts
 * @author dworac <mail@dworac.com>
 *
 * This file checks if the repository name follows the naming convention.
 */
export default (repositoryName: string) => {
  //     Check if repository name is in kebab-case
  const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(repositoryName)) {
    return false;
  }

  return true;
};
