import ora from "ora";
import * as prismic from "@prismicio/client";
import { CONFIG } from "./config";
import { DocumentFilter } from "./services/filters/documentFilter";
import { DocumentProcessor } from "./services/documentProcessor";

const writeClient = prismic.createWriteClient(CONFIG.repository, {
  writeToken: CONFIG.migrationToken!,
});

function logMigrationSummary(
  successfulMigrations: number,
  failedMigrations: number,
  totalDocuments: number
) {
  const summarySpinner = ora().start();
  if (failedMigrations === 0) {
    summarySpinner.succeed(
      `${successfulMigrations} of ${totalDocuments} documents migrated successfully`
    );
  } else {
    summarySpinner.fail(
      `${successfulMigrations} documents migrated successfully and ${failedMigrations} failed`
    );
  }
}

async function migrateDocuments() {
  const fetchSpinner = ora("Fetching documents...").start();
  let successfulMigrations = 0;
  let failedMigrations = 0;

  try {
    const documents = await writeClient.dangerouslyGetAll();
    fetchSpinner.succeed("Documents fetched successfully.");

    const documentFilter = new DocumentFilter();
    const documentsToMigrate =
      documentFilter.filterDocumentsForMigration(documents);

    for (const doc of documentsToMigrate) {
      if (
        CONFIG.perTypeMode.enabled &&
        doc.type !== CONFIG.perTypeMode.documentType
      ) {
        continue;
      }

      const success = await DocumentProcessor.processDocument(doc);
      success ? successfulMigrations++ : failedMigrations++;
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }

    logMigrationSummary(
      successfulMigrations,
      failedMigrations,
      documentsToMigrate.length
    );
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateDocuments();
