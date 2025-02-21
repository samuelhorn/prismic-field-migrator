import { CONFIG } from "../config";

export class SliceProcessor {
  static processSlices(slices: any[] = []) {
    return slices.map((slice) => this.processSlice(slice));
  }

  private static processSlice(slice: any) {
    if (!this.isEligibleSlice(slice)) {
      return slice;
    }

    const sourceData = this.getSourceData(slice);
    const transformedData = this.transformData(sourceData);
    return this.applyChanges(slice, transformedData);
  }

  private static getSourceData(slice: any) {
    const { container, fields } = CONFIG.sliceToMigrate.fieldMapping.from;
    const sourceContainer = container ? slice[container] : slice;

    if (!Array.isArray(sourceContainer)) {
      return [sourceContainer];
    }

    return sourceContainer.filter((item) =>
      Object.values(fields).every((fieldName) => item.hasOwnProperty(fieldName))
    );
  }

  private static transformData(sourceData: any[]) {
    const { fields: sourceFields } = CONFIG.sliceToMigrate.fieldMapping.from;
    const { transformations } = CONFIG.sliceToMigrate.fieldMapping.to;

    // Validate that at least one transformation is defined
    if (!transformations?.spread && !transformations?.rename) {
      // If no transformations, copy all source fields
      return sourceData.map((item) => {
        const result = {};
        sourceFields.forEach((field) => {
          if (item[field]) {
            result[field] = item[field];
          }
        });
        return result;
      });
    }

    return sourceData.map((item) => {
      const result = {};

      // Handle fields to spread
      if (transformations.spread) {
        transformations.spread.forEach((fieldName) => {
          if (item[fieldName]) {
            Object.assign(result, item[fieldName]);
          }
        });
      }

      // Handle field renaming if rename transformations exist
      if (transformations.rename) {
        Object.entries(transformations.rename).forEach(
          ([fromField, toField]) => {
            if (item[fromField]) {
              result[toField] = item[fromField];
            }
          }
        );
      }

      return result;
    });
  }

  private static applyChanges(slice: any, transformedData: any[]) {
    const containerPath =
      CONFIG.sliceToMigrate.fieldMapping.to.container.split(".");
    const result = { ...slice };
    let target = result;

    // Navigate to the correct container
    for (let i = 0; i < containerPath.length - 1; i++) {
      if (!target[containerPath[i]]) {
        target[containerPath[i]] = {};
      }
      target = target[containerPath[i]];
    }

    // Set the transformed data
    const lastKey = containerPath[containerPath.length - 1];
    target[lastKey] = transformedData;

    // Remove source fields if not preserving
    if (!CONFIG.sliceToMigrate.fieldMapping.to.preserveSource) {
      const { container } = CONFIG.sliceToMigrate.fieldMapping.from;
      if (container) {
        delete result[container];
      }
    }

    return result;
  }

  private static isEligibleSlice(slice: any) {
    return (
      slice.slice_type === CONFIG.sliceToMigrate.type &&
      CONFIG.sliceToMigrate.variations.includes(slice.variation)
    );
  }
}
