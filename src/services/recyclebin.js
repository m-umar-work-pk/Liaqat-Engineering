import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const BIN_COLLECTION = "recycleBin";

/**
 * Move a document from a Firestore collection into the recycle bin.
 * Keeps the original data + id so it can be restored exactly.
 */
export const softDeleteFromFirestore = async (collectionName, id, data, deletedBy) => {
  await addDoc(collection(db, BIN_COLLECTION), {
    sourceType: "firestore",
    sourceCollection: collectionName,
    sourceId: id,
    data: data || {},
    label: data?.name || data?.projectName || data?.title || id,
    deletedAt: new Date().toISOString(),
    deletedBy: deletedBy || null,
  });
  await deleteDoc(doc(db, collectionName, id));
};

/**
 * Move a localStorage-backed item (e.g. Orders) into the recycle bin.
 * The item stays out of localStorage until it is restored.
 */
export const softDeleteFromLocalStorage = async (storageKey, idKey, item, deletedBy) => {
  const id = item?.[idKey];
  await addDoc(collection(db, BIN_COLLECTION), {
    sourceType: "localStorage",
    sourceKey: storageKey,
    sourceId: id,
    idKey,
    data: item || {},
    label: item?.title || item?.orderId || id,
    deletedAt: new Date().toISOString(),
    deletedBy: deletedBy || null,
  });
};

/** Real-time subscription to the recycle bin, newest first. */
export const subscribeToBin = (callback) => {
  const q = query(collection(db, BIN_COLLECTION), orderBy("deletedAt", "desc"));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    },
    (error) => {
      console.error("Recycle bin subscription error:", error);
      callback([]);
    }
  );
  return unsubscribe;
};

/** Restore a bin item back to where it came from, then remove it from the bin. */
export const restoreFromBin = async (binItem) => {
  if (binItem.sourceType === "firestore") {
    await setDoc(doc(db, binItem.sourceCollection, binItem.sourceId), binItem.data);
  } else if (binItem.sourceType === "localStorage") {
    const key = binItem.sourceKey;
    const idKey = binItem.idKey || "key";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const withoutDupes = existing.filter((x) => x?.[idKey] !== binItem.sourceId);
    withoutDupes.push(binItem.data);
    localStorage.setItem(key, JSON.stringify(withoutDupes));
  }
  await deleteDoc(doc(db, BIN_COLLECTION, binItem.id));
};

/** Permanently delete a single item from the bin. */
export const permanentlyDeleteFromBin = async (binItemId) => {
  await deleteDoc(doc(db, BIN_COLLECTION, binItemId));
};

/** Empty the entire bin. */
export const emptyBin = async (binItems) => {
  await Promise.all(binItems.map((item) => deleteDoc(doc(db, BIN_COLLECTION, item.id))));
};
