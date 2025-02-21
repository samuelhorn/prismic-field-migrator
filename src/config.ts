import { loadEnvConfig } from "./utils/envLoader";
import { Config } from "./types/configTypes";

loadEnvConfig();

export const CONFIG: Config = {
  perTypeMode: {
    enabled: true,
    documentTypes: ["page"],
  },
  repository: process.env.REPOSITORY,
  migrationToken: process.env.MIGRATION_TOKEN,
  apiKey: process.env.API_KEY,
  sliceToMigrate: {
    type: "main_call_to_action",
    variations: [
      "illustrated",
      "default",
      "compact",
      "productVisual",
      "illustratedProof",
      "illustratedBackground",
      "illustratedBottom",
      "illustratedBottomFullWidth",
    ],
    fieldMapping: {
      from: {
        container: "items",
        fields: ["link", "link_label", "link_style"],
      },
      to: {
        container: "primary.link",
        transformations: {
          spread: ["link"],
          rename: {
            link_style: "variant",
            link_label: "text",
          },
        },
        preserveSource: false,
      },
    },
  },
  possibleSliceZones: ["slices", "slices1", "slices2", "slices3"],
};
