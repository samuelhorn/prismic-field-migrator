import ora, { Ora } from "ora";

export class DocumentMigrationTracker {
  private mainSpinner: Ora;
  private updateSpinner: Ora;
  private lastDocumentId: string | null = null;
  private lastDocumentType: string | null = null;
  private lastDocumentUid: string | undefined;

  constructor() {
    this.mainSpinner = ora();
    this.updateSpinner = ora();
  }

  start(totalDocuments: number) {
    this.mainSpinner.succeed(
      `Migration started: ${totalDocuments} documents to migrate`
    );
  }

  onDocumentUpdating(
    current: number,
    total: number,
    documentId: string,
    documentType: string,
    documentUid?: string
  ) {
    if (this.lastDocumentId) {
      this.updateSpinner.succeed(
        `Document with ID ${this.lastDocumentId} updated (${
          this.lastDocumentUid || this.lastDocumentType
        })`
      );
    }
    this.lastDocumentId = documentId;
    this.lastDocumentType = documentType;
    this.lastDocumentUid = documentUid;
    this.updateSpinner.start(`Updating document ${current} of ${total}`);
  }

  complete(total: number) {
    if (this.lastDocumentId) {
      this.updateSpinner.succeed(
        `Document with ID ${this.lastDocumentId} updated (${
          this.lastDocumentUid || this.lastDocumentType
        })`
      );
    }
    this.mainSpinner.succeed(
      `Migration completed: ${total} documents migrated.`
    );
  }

  error(message: string) {
    this.updateSpinner.stop();
    this.mainSpinner.fail(`Migration failed: ${message}`);
  }
}
