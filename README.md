## 📦 Dependencies

These are the dependencies required for the project to run and develop properly:

### 🔧 Main dependencies (`dependencies`)

| Package                     | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | Official SDK for the ModelContext protocol, useful for specific integrations |
| `@salesforce/cli`           | Salesforce CLI, required to run `sf` commands programmatically               |
| `zod`                       | Library for validation and schema definition in TypeScript                   |

### 🛠️ Development dependencies (`devDependencies`)

| Package       | Description                                        |
| ------------- | -------------------------------------------------- |
| `typescript`  | TypeScript language support                        |
| `@types/node` | Type definitions for using Node.js with TypeScript |

---

💡 **Note:** To install all dependencies, run:

```bash
npm install
```

## Run for testing

To run the application in test mode (without publishing a package), you can use the Model Context Protocol inspector and run the TypeScript entrypoint directly with `tsx`:

```
npx @modelcontextprotocol/inspector npx -y tsx src/index.ts
```

This will start the inspector and load your local MCP using the `src/index.ts` file.

## IMPORTANT — UAT-only safety notice

⚠️ IMPORTANT: All tooling in this MCP must only be used against UAT environments. Change-deployments and test executions must NOT be run against Production organizations.

- Deployments (e.g. `Deploy_Metadata`) and test runs (e.g. `Run_Tests`) must only target UAT environments. Always verify the target alias before running any destructive operation.
- Use clear environment aliases that indicate UAT (for example: `uat-xxx`). Avoid aliases that point to production or that do not clearly identify the environment.
- Always double-check the `alias` parameter and the org listed by `List_Orgs` before running commands that change data or metadata.

Failure to follow this guidance may result in data loss or unwanted changes in production. When in doubt, authenticate to a UAT org and test there first.

## Configure Cursor (mcp-tools)

If you want to add this MCP to Cursor for local development/debugging, add the following entry in the `mcp-tools` section of Cursor's configuration (adjust the path to `src/index.ts` on your machine):

```
"mcp-salesforce-cli": {
  "command": "npx",
  "args": ["tsx", "/Users/danielvadillorand/Documents/Proyects/MCPs_for_Salesforce_CLI/src/index.ts"]
}
```

Replace the path in `args` with the absolute path to your local `src/index.ts`.

## Tool documentation

Each tool in the MCP has its own documentation file in `docs/tools/` (one file per tool) to avoid overloading this README. Check the files there to see what each tool does, its inputs and usage examples.

## Tools (priority order)

Use the tools below in roughly the listed priority when working a JIRA ticket or interacting with an org. The first two (especially `Get_Path`) are recommended to run first since they help discover context and pick the correct org/environment.

1. Get_Path — Returns a detailed, ordered set of instructions to resolve a JIRA ticket. MUST be executed first to get the step-by-step plan. See `docs/tools/GetPath.md`.
2. List_Orgs — Lists authenticated orgs and their metadata; use this early to pick the right target org (dev/sandbox vs prod). See `docs/tools/ListOrgs.md`.
3. Get_Objects_Context — Returns the list of standard and custom sObjects available in the target org. See `docs/tools/GetObjectsContext.md`.
4. Get_Object_Schema — Returns the schema/description of a specific sObject. See `docs/tools/GetObjectSchema.md`.
5. Query_Records — Executes a SOQL query against the target org and returns results. See `docs/tools/QueryRecords.md`.
6. Get_Org_Limits — Retrieves current org limits (API calls, storage, etc.) and computes usage percentages. See `docs/tools/GetOrgLimits.md`.
7. Open_Org_Page — Opens the org page in the browser (optionally a specific source file, private mode). See `docs/tools/OpenOrgPage.md`.
8. Deploy_Metadata — Deploys metadata to a UAT org (use with caution). See `docs/tools/DeployMetadata.md`.
9. Run_Tests — Runs Apex tests and returns results and coverage summaries. See `docs/tools/RunTests.md`.
10. Auth_Salesforce_Instance — Starts a web-login to authenticate a Salesforce org and create an alias. See `docs/tools/AuthSF.md`.

## Using Get_Path (why and how)

Get_Path is the core orchestration tool to start when you have a JIRA ticket to resolve. It analyzes the ticket URL and returns a strict, ordered set of instructions that the MCP should follow (which org to use, what tools to call, what files to change, branch naming, tests to run, etc.). Always run this before executing tool-level actions — it reduces mistakes and ensures the correct order of operations.

When to run:
- You have a JIRA ticket (URL) and need a complete plan to implement it.
- Before creating branches or running deployments.

Minimal example (CLI flow):

```bash
# 1) Ask Get_Path for the plan using the JIRA URL
sf run-mcp --mcp ./src/index.ts --tool Get_Path --input '{"jiraURL":"https://your-jira.example/browse/PROJ-123"}'

# 2) Review the returned instructions and follow them (it will usually recommend which org alias to use and which tools to run next)

# 3) Use List_Orgs to confirm the suggested org alias
sf run-mcp --mcp ./src/index.ts --tool List_Orgs --input '{}'

# 4) Call the tools recommended by the plan (e.g. Get_Objects_Context, Get_Org_Limits, etc.)
```

Tip: combine `Get_Path` with `List_Orgs` to avoid accidentally targeting Production. `Get_Path` normally recommends a develop/sandbox org in step 1. If it doesn't, stop and confirm.

