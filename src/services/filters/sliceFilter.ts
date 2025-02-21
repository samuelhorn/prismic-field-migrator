import { CONFIG } from "../../config";

export class SliceFilter {
  static isEligibleForMigration(slice: any) {
    const correctVariation =
      slice.slice_type === CONFIG.sliceToMigrate.type &&
      CONFIG.sliceToMigrate.variations.includes(slice.variation);

    // Check if items exist and contain required source fields
    const hasValidItems = slice.items?.some((item: any) => {
      const sourceConfig = CONFIG.sliceToMigrate.fieldMapping.source[0];
      const hasLink = item.link; // Base requirement

      // Check if all required fields from mapping exist
      const hasRequiredFields = Object.entries(sourceConfig.fields).every(
        ([_, path]) => {
          if (path === ".") return hasLink;
          if (path.startsWith("^.")) {
            const fieldName = path.slice(2);
            return item.hasOwnProperty(fieldName);
          }
          return item.hasOwnProperty(path);
        }
      );

      return hasLink && hasRequiredFields;
    });

    // Check if primary target exists
    const hasPrimaryTarget = slice.primary?.hasOwnProperty("link");

    return correctVariation && hasValidItems && hasPrimaryTarget;
  }
}
