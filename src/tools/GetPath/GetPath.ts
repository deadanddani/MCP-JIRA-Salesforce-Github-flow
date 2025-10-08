import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";

export const GetPath: Tool = {
  name: "Get_Path",
  description:
    "Tool to get a set of instructions to resolve a task from JIRA, this MUST be executed first before any other tool as this provide a set of intructions of how to solve them",
  inputSchema: {
    jiraURL: z
      .string()
      .describe(
        "Link to the JIRA task to resolve"
      )
  },
  execute: getPath,
  annotations: {
    title: "Get instructions to resolve JIRA tickets",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getPath({
  jiraURL
}: {
  jiraURL: string;
}) {
  let instructions =
    `You are a Salesforce expert developer. You will have to analize this JIRA ticket: ${jiraURL} ` + 
    `execute this list of actions in order to do so:` +
    `1. If not provided or already definen ask the following topics:` +
    `1.1 The org to work with it should be a develop one, if not provided or already defined ask for it` +
    `2. Execute the JIRA MCP tools to extract all the information about the ticket that you need in order to resolve it` +
    `3. Using github commands and based on the JIRA ticket create a new branch called {Feature/fix}/{JIRA_TICKET_NUMBER}_{SHORT_DESCRIPTION}` +
    `4. Based on the information extracted and the current code of the repo, provide a set of actions to resolve the ticket,` +
      `make any needed call to MCP tools to extract the data needed from the org` +
    `5. Execute each of the actions in order, action execution path:` +
    `5.1 Modify the code as requested on the action using the rules set by the org ` +
    `5.2 Usng MCP tools deploy the code to the org defined at the start as develop, if something fail iterate changing the code untiil it works` +
    `5.3 If needed create or modify tests classes the test the new code, using the rules set by the org` +
    `5.4 Using MCP tools deploy the test classes to the org defined at the start as develop, if something fail iterate changing the code untiil it works` +
    `5.5 Using MCP tools run all the tests classes modified or created, or any directly related class to the changed code, if something fail iterate changing the code untiil it works` +
    `5.6 Using github commands add and commit adding a small description of the change done on the comment` +
    `6. Using github commands push all the changes to the branch`;
  return {
    content: [
      {
        type: "text",
        text: instructions,
      },
    ],
  };
}
