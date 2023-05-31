import { Octokit } from "octokit";
import config from "../config";

const octokit = new Octokit({ auth: config.GITHUB_APP_ID });

interface ProjectV2BasicInfo {
  title: string;
  shortDescription: string;
  creator: {
    login: string;
  };
  repositories: {
    nodes: {
      name: string;
      nameWithOwner: string;
    }[];
  };
  updatedAt: string;
  public: boolean;
}

const getProjectV2BasicInfo = async (
  number: number
): Promise<ProjectV2BasicInfo> => {
  const query = `
  query { 
  viewer { 
    projectV2(number:${number}){
      title
      shortDescription
      creator{
        login
      }
      repositories(first:100){
        nodes{
          name
          nameWithOwner
        }
      }
      updatedAt
      public
    }
  }
}
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await octokit.graphql<{
    viewer: {
      projectV2: ProjectV2BasicInfo;
    };
  }>(query);

  return response.viewer.projectV2;
};

export default getProjectV2BasicInfo;
