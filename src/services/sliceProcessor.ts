// src/services/sliceProcessor.ts
import { CONFIG } from "../config";
import * as prismic from "@prismicio/client";

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
    return slice.items
      .filter((item) => item.link)
      .map((item) => ({
        link: item.link,
        parent: item,
      }));
  }

  private static transformData(sourceData: any[]) {
    const { fields: sourceFields } =
      CONFIG.sliceToMigrate.fieldMapping.source[0];

    return sourceData.map(({ link, parent }) => {
      const { key, ...restLink } = link;
      return {
        ...restLink,
        text: parent[sourceFields.label.slice(2)],
        variant: parent[sourceFields.style.slice(2)],
      };
    });
  }

  private static applyChanges(slice: any, transformedData: any[]) {
    const existingLinks = Array.isArray(slice.primary.link)
      ? prismic.isFilled.link(slice.primary.link)
        ? slice.primary.link
        : []
      : [];

    return {
      ...slice,
      items: slice.items.filter((item) => !item.link),
      primary: {
        ...slice.primary,
        link: [...existingLinks, ...transformedData],
      },
    };
  }

  private static isEligibleSlice(slice: any) {
    return (
      slice.slice_type === CONFIG.sliceToMigrate.type &&
      CONFIG.sliceToMigrate.variations.includes(slice.variation) &&
      slice.items?.some((item) => item.link)
    );
  }
}
