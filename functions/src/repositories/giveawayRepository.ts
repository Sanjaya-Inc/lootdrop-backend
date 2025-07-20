
import {getFirestore} from "../config/firebase";
import {Giveaway} from "../models/giveaway";

const db = getFirestore();
const giveawaysCollection = db.collection("giveaways");

export const getExistingIds = async (
  giveawayIds: number[]): Promise<number[]> => {
  const existingIds: number[] = [];
  if (giveawayIds.length === 0) {
    return existingIds;
  }

  const snapshot = await giveawaysCollection.where(
    "id", "in", giveawayIds).get();
  snapshot.forEach((doc) => {
    existingIds.push(doc.data().id);
  });
  return existingIds;
};

export const batchCreate = async (giveaways: Giveaway[]): Promise<void> => {
  const batch = db.batch();
  giveaways.forEach((giveaway) => {
    const docRef = giveawaysCollection.doc(giveaway.id.toString());
    batch.set(docRef, giveaway);
  });
  await batch.commit();
};
