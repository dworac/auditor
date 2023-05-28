import { Octokit } from "@octokit/rest";
import config from "../config";

const octokitClient = new Octokit({ auth: config.GITHUB_TOKEN });

export default octokitClient;
