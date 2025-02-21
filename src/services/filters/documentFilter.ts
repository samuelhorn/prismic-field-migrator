import type { PrismicDocument, SharedSlice } from "@prismicio/client";
import { CONFIG } from "../../config";
import { SliceFilter } from "./sliceFilter";

export class DocumentFilter {
  public filterDocumentsForMigration(
    documents: PrismicDocument[]
  ): PrismicDocument[] {
    return documents.filter((doc) =>
      CONFIG.possibleSliceZones.some((sliceType) =>
        doc.data[sliceType]?.some((slice: SharedSlice) =>
          SliceFilter.isEligibleForMigration(slice)
        )
      )
    );
  }
}
