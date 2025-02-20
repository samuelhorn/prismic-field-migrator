import { loadEnvConfig } from "./utils/envLoader";

loadEnvConfig();

export const CONFIG = {
  perTypeMode: {
    enabled: false,
    documentType: "page",
  },
  repository: "prismic-main",
  migrationToken: process.env.MIGRATION_TOKEN,
  apiKey: process.env.API_KEY,
  apiEndpoint: process.env.API_ENDPOINT,
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
    validItemFields: ["link", "link_label", "link_style"],
  },
  possibleSliceZones: ["slices", "slices1", "slices2", "slices3"],
};
