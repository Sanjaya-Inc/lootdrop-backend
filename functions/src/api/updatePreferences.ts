
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const updatePreferences = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = request.auth.uid;
  const { notificationPreferences } = request.data;

  try {
    await db.collection("users").doc(uid).update({ notificationPreferences });
    return { success: true };
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while updating preferences."
    );
  }
});
