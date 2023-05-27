import { Octokit } from "octokit";
import config from "../config";

const octokit = new Octokit({ auth: config.GITHUB_TOKEN });

const getProjectsV2Numbers = async (): Promise<number[]> => {
  const query = `
 query { 
  viewer { 
    projectsV2(first:100){
      nodes{
        number
      }
      totalCount
    }
  }
} 
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await octokit.graphql<any>(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.viewer.projectsV2.nodes.map((n: any) => n.number);
};

export default getProjectsV2Numbers;
