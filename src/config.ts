import { ConfigVariable } from "@dworac/config";

class Config {
  @ConfigVariable(String)
  GITHUB_APP_ID!: string;

  @ConfigVariable(String)
  GITHUB_APP_PRIVATE_KEY!: string;

  @ConfigVariable(String)
  GITHUB_APP_CLIENT_ID!: string;

  @ConfigVariable(String)
  GITHUB_APP_CLIENT_SECRET!: string;
}

const config = new Config();

export default config;
