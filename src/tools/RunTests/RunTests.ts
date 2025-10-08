import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const RunTests: Tool = {
  name: "Run_Tests",
  description: "Ejecuta tests en Salesforce usando el Salesforce CLI y retorna los resultados.",
  inputSchema: {
    alias: z.string().describe("Alias de la organización de destino."),
    testClasses: z.array(z.string()).describe("Lista de clases de test a ejecutar separados por comas."),
  },
  execute: runTests,
  annotations: {
    title: "Ejecutar tests en Salesforce",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

function runTests({ alias, testClasses }: { alias: string; testClasses: string[] }) {
  let resultMessage;
  try {
    const classes = testClasses.join(",");
    resultMessage = executeSync(`sf apex run test --target-org ${alias} --classnames ${classes} --json`);
  } catch (error) {
    resultMessage = `Error durante la ejecución de tests: ${error}`;
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
