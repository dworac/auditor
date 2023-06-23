import { Probot } from "probot";

export default (app: Probot) => {
  app.on("issues.opened", async (context) => {
    console.log("popoopopop");
    const issueComment = context.issue({
      body: "Thanks for opening this issue dworac!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("repository.");
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
