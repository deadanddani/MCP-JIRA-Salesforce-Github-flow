import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";

export const GetPath: Tool = {
  name: "Get_Path",
  description:
    "Tool to get a set of instructions to resolve a task from JIRA, this MUST be executed first before any other tool or logic as this provide a set of intructions of how to solve them",
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
  let instructions = `
    You are a senior Salesforce developer and DevOps automation expert.
  Your goal is to fully resolve the JIRA ticket provided at: ${jiraURL}.
  You have access to several MCP tools for JIRA and Salesforce.
  You MUST follow these steps strictly and in order to complete what the user requested.

  ---

  ### 0. Start
  0.1. Create a checklist to ensure all steps are covered and display it to the user all the time.
  0.2. Never assume any information — always confirm or extract it using MCP tools.
  0.3. Always use MCP tools to interact with Salesforce; avoid using 'sf' commands directly if possible.
  0.4. Ensure you are on the master branch with the latest version pulled before starting.

  ---

  ### 1. Preparation
  1.1. Identify the development Salesforce org to use.
    - If not provided in context, call the MCP tool **List_Orgs** to find one suitable for development (Sandbox or Scratch org, never Production).
    - Confirm authentication; if not authenticated, use **Auth_Salesforce_Instance**.
  1.2. Extract and summarize all relevant details from the JIRA ticket.
    - Use the JIRA MCP or online sources if needed.
    - Summarize the issue, business goal, and affected components.

  ---

  ### 2. Branch and environment setup
  2.1. Ensure you got the latest master version of the codebase.
  2.2. Ensure there is no branch already created for this ticket.
  2.3. If a branch already exists, reuse it and continue where it was left.
  2.4. Create a new Git branch using the pattern:
    'feature/{JIRA_TICKET_NUMBER}-{short-summary-of-the-task}'

  ---

  ### 3. Analysis, action definition and execution
  3.1. Analyze the current repository codebase related to the JIRA ticket.
  3.2. Define a **sequence of atomic actions** to complete the implementation.

    Each action must execute this steps and you must anotate this steps on the checklist individually:
    1. Modify the code as per the action defined using the org's coding standards, try to take simillar code from other files .
    2. Deploy the modified code to the dev org using Salesforce MCP tools (retry up to 5 times if needed).
    3. If required, update or create the corresponding test classes.
    4. Deploy the test classes.
    5. Run the test classes and verify all pass.
    6. If test or coverage fails, fix and re-run until success.
    7. Perform Git operations:
        - 'git add .'
        - 'git commit -m "[{JIRA_TICKET_NUMBER}] {short description of the change}"'
        - 'git push'

    ⚠️ Define → Execute → Commit each action one at a time.  
    Never batch or group multiple actions before execution.

  ---

  ### 4. Pull Request creation
  4.1. Execute 'create_pro_PR' or manually create a Pull Request using git commands but using a template always.
  4.2. Always skip test or deployment prompts when creating the PR.

  ---

  ### 5. Final verification
  5.1. Confirm the PR was created successfully.
  5.2. Return a summary including:
    - JIRA ticket ID and title
    - Branch name
    - PR URL
    - Status of last test execution
    - Any remaining issues or TODOs
    `
  return {
    content: [
      {
        type: "text",
        text: instructions,
      },
    ],
  };
}
