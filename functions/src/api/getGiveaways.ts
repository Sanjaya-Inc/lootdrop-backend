
import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "../config/firebase";
import { Giveaway } from "../models/giveaway";

const db = getFirestore();

export const getGiveaways = onCall(async () => {
  try {
    const now = new Date();
    const giveawaysSnapshot = await db
      .collection("giveaways")
      .where("endDate", ">", now)
      .orderBy("endDate")
      .get();

    const giveaways: Giveaway[] = [];
    giveawaysSnapshot.forEach((doc) => {
      giveaways.push(doc.data() as Giveaway);
    });

    return { giveaways };
  } catch (error) {
    console.error("Error getting giveaways:", error);
    throw new Error("An error occurred while fetching giveaways.");
  }
});
