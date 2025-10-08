import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const DeployMetadata: Tool = {
  name: "Deploy_Metadata",
  description: "Despliega metadatos en Salesforce usando el Salesforce CLI.",
  inputSchema: {
    alias: z.string().describe("Alias de la organización de destino."),
    metadataPaths: z.string().describe("Ruta de los archivos o directorios de metadatos a desplegar, separados por comas."),
  },
  execute: deployMetadata,
  annotations: {
    title: "Desplegar metadatos en Salesforce",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function deployMetadata({ alias, metadataPaths }: { alias: string; metadataPaths: string }) {
  let resultMessage;
  try {
    resultMessage = executeSync(`sf project deploy start --target-org ${alias} --source-dir ${metadataPaths} --json`);
  } catch (error) {
    resultMessage = `Error durante el despliegue: ${error}`;
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
