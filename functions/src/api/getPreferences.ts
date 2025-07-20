
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "../config/firebase";

const db = getFirestore();

export const getPreferences = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = request.auth.uid;
  let userDoc;

  try {
    userDoc = await db.collection("users").doc(uid).get();
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while fetching preferences."
    );
  }

  if (!userDoc.exists) {
    throw new HttpsError("not-found", "User not found.");
  }

  const user = userDoc.data();
  return { notificationPreferences: user?.notificationPreferences || {} };
});
