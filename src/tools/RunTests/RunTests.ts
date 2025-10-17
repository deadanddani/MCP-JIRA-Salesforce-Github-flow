import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const RunTests: Tool = {
  name: "Run_Tests",
  description: "Ejecuta tests en Salesforce usando el Salesforce CLI y retorna los resultados.",
  inputSchema: {
    alias: z.string().describe("Target organization's alias."),
    testClasses: z.array(z.string()).describe("List of test class names to run."),
    classesToCover: z.array(z.string()).describe("List of test class names to cover, this will be the only coverage information returned the rest will be skiped."),
  },
  execute: runTests,
  annotations: {
  title: "Run tests in Salesforce",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

function runTests({ alias, testClasses, classesToCover }: { alias: string; testClasses: string[]; classesToCover: string[] }) {
  let resultMessage;
  try {
    const classes = testClasses.join(",");
    resultMessage = executeSync(`sf apex run test --target-org ${alias} --classnames ${classes} --json --wait 30`);
    // if(resultMessage.length > 2000) {
    //   //remove the warning messages at the start of the json
    //   resultMessage = resultMessage.replace(/^[^{]*({.*)$/s, '$1');
    //   resultMessage = resultMessage.replace(/(.*\})[^}]*$/s, '$1');
    //   // let result = JSON.parse(resultMessage);
    //   // result.result.coverage.coverage = result.result.coverage.coverage.filter((item: { name: string; }) =>
    //   //   classesToCover.includes(item.name)
    //   // );
    //   // resultMessage = JSON.stringify(result);
    // }
  } catch (error) {
    resultMessage = `Error while running tests: ${error}`;
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
