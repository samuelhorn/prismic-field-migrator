import { loadEnvConfig } from "./utils/envLoader";

loadEnvConfig();

export const CONFIG = {
  perTypeMode: {
    enabled: true,
    documentType: "page",
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
      source: [
        {
          location: "items[*].link",
          fields: {
            link: ".",
            label: "^.link_label",
            style: "^.link_style",
          },
          removeAfterMigration: true,
        },
      ],
      target: {
        location: "primary.link[*]",
        fields: {
          link: ".",
          text: "text",
          variant: "variant",
        },
      },
    },
  },
  possibleSliceZones: ["slices", "slices1", "slices2", "slices3"],
};
