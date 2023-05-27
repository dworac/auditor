import { ConfigVariable } from "@dworac/config";

class Config {
  @ConfigVariable(String)
  GITHUB_TOKEN!: string;
}

const config = new Config();

export default config;
