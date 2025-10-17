import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const DeployMetadata: Tool = {
  name: "Deploy_Metadata",
  description: "Deploy the changes using Salesforce CLI.",
  inputSchema: {
    alias: z.string().describe("Alias of the org to execute the command."),
    projectPath: z.string().describe("Full Path of the Salesforce proyect where the deploy should be executed."),
    metadataPaths: z.string().describe("Full Path of the files to deploy separated by comas, use always especific files never use full poryect path, a big folder or package.xml files."),
  },
  execute: deployMetadata,
  annotations: {
    title: "Deploy metadata to Salesforce",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function deployMetadata({ alias,projectPath , metadataPaths }: { alias: string; projectPath: string; metadataPaths: string }) {
  let resultMessage;
  try {
    resultMessage = executeSync(`cd ${projectPath} && sf deploy metadata --target-org ${alias} --source-dir ${metadataPaths} --json`);
  } catch (error) {
    resultMessage = `Error during deployment: ${error}`;
  }
  return {
    content: [
      {
        type: "text",
        text: resultMessage,
      },
    ],
  };
}
