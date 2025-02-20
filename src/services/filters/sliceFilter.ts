import { CONFIG } from "../../config";

export class SliceFilter {
  static isEligibleForMigration(slice: any) {
    const correctVariation =
      slice.slice_type === CONFIG.sliceToMigrate.type &&
      CONFIG.sliceToMigrate.variations.includes(slice.variation);

    const hasValidItems = slice.items?.some(
      (item: any) => item.link && (item.link_label || item.link_style)
    );

    const hasOnlyValidFields = slice.items?.every((item: any) => {
      const keys = Object.keys(item);
      return (
        keys.every((key) =>
          CONFIG.sliceToMigrate.validItemFields.includes(key)
        ) && keys.length <= CONFIG.sliceToMigrate.validItemFields.length
      );
    });

    const hasPrimaryLink = slice.primary.hasOwnProperty("link");

    return (
      correctVariation && hasValidItems && hasPrimaryLink && hasOnlyValidFields
    );
  }
}
