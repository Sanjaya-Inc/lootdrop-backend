
import {getFirestore} from "../config/firebase";
import {Giveaway} from "../models/giveaway";

const db = getFirestore();
const giveawaysCollection = db.collection("giveaways");

export const getExistingIds = async (
  giveawayIds: number[]): Promise<number[]> => {
  if (giveawayIds.length === 0) {
    return [];
  }

  // Use a single query with array-contains-any for better performance
  // However, since we need exact matches, we'll use a Map-based approach
  
  // Create a Set for O(1) lookups
  const giveawayIdsSet = new Set(giveawayIds);
  
  // Get min and max values for efficient range query
  const minId = Math.min(...giveawayIds);
  const maxId = Math.max(...giveawayIds);
  
  const snapshot = await giveawaysCollection
    .where("id", ">=", minId)
    .where("id", "<=", maxId)
    .get();
  
  const existingIds: number[] = [];
  snapshot.forEach((doc) => {
    const id = doc.data().id;
    if (giveawayIdsSet.has(id)) {
      existingIds.push(id);
    }
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
