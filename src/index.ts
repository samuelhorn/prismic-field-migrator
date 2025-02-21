// src/index.ts
import ora from "ora";
import * as prismic from "@prismicio/client";
import { CONFIG } from "./config";
import { DocumentFilter } from "./services/filters/documentFilter";
import { DocumentProcessor } from "./services/documentProcessor";
import { DocumentMigrationTracker } from "./services/documentMigrationTracker";

const writeClient = prismic.createWriteClient(CONFIG.repository!, {
  writeToken: CONFIG.migrationToken!,
});

async function migrateDocuments() {
  const tracker = new DocumentMigrationTracker();

  try {
    tracker.startFetching();
    const documents = await writeClient.dangerouslyGetAll();
    tracker.completeFetching();

    const documentFilter = new DocumentFilter();
    const documentsToMigrate =
      documentFilter.filterDocumentsForMigration(documents);

    // Create migration instance
    const migration = prismic.createMigration();

    // Prepare all document migrations
    for (const doc of documentsToMigrate) {
      if (
        CONFIG.perTypeMode.enabled &&
        doc.type !== CONFIG.perTypeMode.documentType
      ) {
        continue;
      }
      DocumentProcessor.prepareDocumentMigration(migration, doc);
    }

    // Execute migration
    await writeClient.migrate(migration, {
      reporter: (event) => {
        if (event.type === "start") {
          tracker.start(event.data.pending.documents);
        } else if (event.type === "documents:updating") {
          tracker.onDocumentUpdating(
            event.data.current,
            event.data.total,
            event.data.document.document.id!,
            event.data.document.document.type!,
            event.data.document.document.uid || undefined
          );
        } else if (event.type === "end") {
          tracker.complete(event.data.migrated.documents);
        }
      },
    });
  } catch (error) {
    tracker.error(error.message);
    console.error(error);
  }
}

migrateDocuments();
