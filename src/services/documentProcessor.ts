import ora from "ora";
import fetch from "node-fetch";
import { CONFIG } from "../config";
import { SliceProcessor } from "./sliceProcessor";

export class DocumentProcessor {
  static async processDocument(doc: any) {
    const spinner = ora(
      `Processing document ${doc.id} (${doc.uid || doc.type})`
    ).start();

    try {
      const updatePayload = this.prepareUpdatePayload(doc);
      await this.sendUpdateRequest(doc.id, updatePayload, spinner);
      return true;
    } catch (error) {
      spinner.fail(
        `Error processing document ${doc.id} (${doc.uid || doc.type}): ${
          error.message
        }`
      );
      return false;
    }
  }

  private static prepareUpdatePayload(doc: any) {
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

    // Handle special case for use_cases document type which have an old uid field that needs to be removed
    return doc.type === "use_cases" ? { ...updatedDoc, uid: null } : updatedDoc;
  }

  private static async sendUpdateRequest(
    docId: string,
    payload: any,
    spinner: any
  ) {
    const response = await fetch(CONFIG.apiEndpoint + docId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.migrationToken}`,
        "x-api-key": CONFIG.apiKey!,
        repository: CONFIG.repository,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    spinner.succeed(
      `Successfully migrated document ${docId} (${payload.uid || payload.type})`
    );
  }
}
