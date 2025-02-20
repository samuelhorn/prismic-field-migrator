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

    const existingPrimaryLinks = this.getExistingPrimaryLinks(slice);
    const newLinks = this.transformItemLinks(slice.items);

    return {
      ...slice,
      items: slice.items.filter((item) => !item.link),
      primary: {
        ...slice.primary,
        link: [...existingPrimaryLinks, ...newLinks],
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

  private static getExistingPrimaryLinks(slice: any) {
    return Array.isArray(slice.primary.link)
      ? prismic.isFilled.link(slice.primary.link)
        ? slice.primary.link
        : []
      : [];
  }

  private static transformItemLinks(items: any[]) {
    return (
      items
        ?.filter((item) => item.link)
        .map(({ link: { key, ...restLink }, link_label, link_style }) => ({
          ...restLink,
          text: link_label,
          variant: this.getLinkVariant(link_style),
        })) || []
    );
  }

  private static getLinkVariant(style: string) {
    return style === "primary"
      ? "primary"
      : style === "secondary"
      ? "secondary"
      : "tertiary";
  }
}
