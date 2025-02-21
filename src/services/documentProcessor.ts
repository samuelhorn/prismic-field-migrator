import type { Migration, PrismicDocument } from "@prismicio/client";
import { SliceProcessor } from "./sliceProcessor";

export class DocumentProcessor {
  static prepareDocumentMigration(migration: Migration, doc: PrismicDocument) {
    const updatedDoc = {
      ...doc,
      data: {
        ...doc.data,
        slices: SliceProcessor.processSlices(doc.data.slices),
        ...(doc.data.slices1 && {
          slices1: SliceProcessor.processSlices(doc.data.slices1),
        }),
        ...(doc.data.slices2 && {
          slices2: SliceProcessor.processSlices(doc.data.slices2),
        }),
        ...(doc.data.slices3 && {
          slices3: SliceProcessor.processSlices(doc.data.slices3),
        }),
      },
    };

    // Handle special case for use_cases document type
    if (doc.type === "use_cases") {
      updatedDoc.uid = null;
    }

    return migration.updateDocument(updatedDoc);
  }
}
