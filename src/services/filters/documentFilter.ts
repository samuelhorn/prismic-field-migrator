import { CONFIG } from "../../config";
import { SliceFilter } from "./sliceFilter";

export class DocumentFilter {
  public filterDocumentsForMigration(documents: any[]) {
    return documents.filter((doc) =>
      CONFIG.possibleSliceZones.some((sliceType) =>
        doc.data[sliceType]?.some((slice: any) =>
          SliceFilter.isEligibleForMigration(slice)
        )
      )
    );
  }
}
