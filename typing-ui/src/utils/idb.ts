// src/utils/idb.ts
import { openDB } from "idb";
import type { TypingState } from "./textParser";

const DB_NAME = "retype-pdf-db";
const STORE_NAME = "pdfData";

export interface singlePdfRecord {
  id:1;
  name:string;
  data: TypingState[];
  file: File;
}

export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const savePDFJson = async (record: singlePdfRecord) => {
  const db = await getDB();
  await db.put(STORE_NAME, record);
};

export const getPDFJson = async ():Promise<singlePdfRecord | null> => {
  const db = await getDB();
  return db.get(STORE_NAME, 1) || null;
};

export const deletePDFJson = async () => {
  const db = await getDB();
  await db.delete(STORE_NAME, 1);
};
