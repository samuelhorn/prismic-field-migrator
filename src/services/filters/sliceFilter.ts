import { SharedSlice } from "@prismicio/client";
import { CONFIG } from "../../config";

export class SliceFilter {
  static isEligibleForMigration(slice: SharedSlice): boolean {
    // Check slice type and variation
    const correctVariation =
      slice.slice_type === CONFIG.sliceToMigrate.type &&
      CONFIG.sliceToMigrate.variations.includes(slice.variation);

    // Check source fields exist
    const hasValidFields = this.validateSourceFields(slice);

    // Check target container exists
    const hasTargetContainer = this.validateTargetContainer(slice);

    return correctVariation && hasValidFields && hasTargetContainer;
  }

  private static validateSourceFields(slice: SharedSlice): boolean {
    const { container, fields } = CONFIG.sliceToMigrate.fieldMapping.from;
    const sourceContainer = container ? slice[container] : slice;

    // If source is array, check at least one item has all required fields
    if (Array.isArray(sourceContainer)) {
      return sourceContainer.some((item) =>
        fields.every((fieldName) => item.hasOwnProperty(fieldName))
      );
    }

    // If source is object, check all required fields exist
    return fields.every((fieldName) =>
      sourceContainer.hasOwnProperty(fieldName)
    );
  }

  private static validateTargetContainer(slice: SharedSlice): boolean {
    const targetPath =
      CONFIG.sliceToMigrate.fieldMapping.to.container.split(".");
    let target = slice;

    // Navigate through path except last segment
    for (let i = 0; i < targetPath.length - 1; i++) {
      if (!target[targetPath[i]]) {
        return false;
      }
      target = target[targetPath[i]];
    }

    return true;
  }
}
