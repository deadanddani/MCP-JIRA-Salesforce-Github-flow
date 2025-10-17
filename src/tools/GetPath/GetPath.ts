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
  /* first iteration of the instructions
  let instructions =
    `You are a Salesforce expert developer. You will have to analize this JIRA ticket: ${jiraURL} ` + 
    `execute this list of actions in order to do so:` +
    `1. If not provided or already definen ask the following topics:` +
    `1.1 The org to work with it should be a develop one, if not provided or already defined  search for it with MCP tools and/or ask for it` +
    `2. Execute the JIRA MCP tools or search on internet to extract all the information about the ticket that you need in order to resolve it` +
    `3. Using github commands and based on the JIRA ticket create a new branch called {Feature/fix}/{JIRA_TICKET_NUMBER}-{SHORT-DESCRIPTION}` +
    `4. Based on the information extracted and the current code of the repo, provide a set of actions to resolve the ticket,` +
      `make any needed call to MCP tools to extract the data needed from the org` +
    `5. Execute each of the actions in order, action execution path:` +
    `5.1 Modify the code as requested on the action using the rules set by the org ` +
    `5.2 Usng MCP tools deploy the code to the org defined at the start as develop, if something fail iterate changing the code untiil it works` +
    `5.3 If needed create or modify tests classes the test the new code, using the rules set by the org` +
    `5.4 Using MCP tools deploy the test classes to the org defined at the start as develop, if something fail iterate changing the code untiil it works` +
    `5.5 Using MCP tools run all the tests classes modified or created, or any directly related class to the changed code, if something fail iterate changing the code untiil it works` +
    `5.6 Using github commands add and commit adding a small description of the change done on the comment` +
    `6. Using github commands push all the changes to the branch` +
    `7. Execute the create_pro_PR command to create a PR to the main branch`;*/

  //IA refined solution
  let instructions = `
    You are a senior Salesforce developer and DevOps automation expert.
    Your goal is to fully resolve the JIRA ticket provided at: ${jiraURL}.
    You have access to several MCP tools for JIRA and Salesforce.
    You MUST follow these steps strictly and in order in order to complete what the user requested.

    ---

    ### 0. Start
    0.1. Create a checklist to ensure all steps are covered and display it to the user all the time.
    0.2. Never assume any information, always confirm or extract it using MCP tools.
    0.3. Always use the MCP tools to interact Salesforce, avoid using sf commands directly if posible.
    0.4. Ensure you are before start on the master branch with the lastest version doing a pull.


    ### 1. Preparation
    1.1. Identify the development Salesforce org to use.
      - If not provided in context, call the MCP tool "List_Orgs" to find one suitable for development it has to be a Sandbox or Scratch org never Production.
      - Confirm you it is authenticated and if not auth in it with the the MCP tool "Auth_Salesforce_Instance".
    1.2. Extract and summarize all relevant details from the JIRA ticket.
      - Use the JIRA MCP or online sources if needed.
      - Summarize the issue, business goal, and affected components.

    ---

    ### 2. Branch and environment setup
    2.1. Ensure you got the last master version of the codebase.
    2.2. Ensure there is no branch already created for this ticket.
    2.3. If a branch already exists for this ticket, take the commits and continue where it was left.
    2.4. Create a new Git branch using the following pattern:
      \`feature/{JIRA_TICKET_NUMBER}-{short-summary-of-the-task}\`

    ---

    ### 3. Analysis and action planning
    3.1. Analyze the current repository codebase related to the ticket.
    3.2. Define a detailed list of atomic "actions" to complete the implementation.
      - Each action must describe:
        1. What needs to be changed or created (Apex class, trigger, component, etc.)
        2. Why it is needed (link to JIRA issue)
        3. The exact files to modify.
      - **Each action will be executed immediately in its own isolated loop (see step 4).**

    ---

    ### 4. Implementation and testing loop (per action)
    For each action defined in step 3.2, perform the following steps *in sequence* and confirm completion before moving to the next action:

    4.1. Apply the code modification following Salesforce repo rules.
    4.2. Deploy the modified code to the development org using Salesforce MCP tools.
        - Retry up to 5 times if it fails.
    4.3. Update or create the required test classes.
    4.4. Deploy the test classes.
    4.5. Run the test classes and ensure all pass.
    4.6. **Immediately after the tests succeed, execute the git commands:**
      - 'git add .'
      - 'git commit -m "[{JIRA_TICKET_NUMBER}] {short description of the change}"'
      - 'git push'
      - Confirm the commit was pushed successfully before continuing.
    4.7. Mark this action as “DONE ✅” in the checklist before moving to the next one.

    **Important:** Never accumulate multiple actions before committing; every action must be committed and done individually.


    ### 5. PR creation
    5.1. Execute this command \`create_pro_PR\` or try to find a template for Pull requests create it using git commands.
    5.2. always avoid deploying or running tests when the command asks.

    ---

    ### 7. Final verification
    7.1. Confirm the PR was created successfully.
    7.2. Return a summary including:
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
