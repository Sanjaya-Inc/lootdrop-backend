import {onSchedule} from "firebase-functions/v2/scheduler";
import {initializeFirebase} from "./config/firebase";
import {getGiveaways} from "./services/gamerpowerService";
import {getExistingIds, batchCreate} from "./repositories/giveawayRepository";
import {findUsersToNotifyForGiveaway} from "./repositories/userRepository";
import {sendBatchNotifications} from "./services/notificationService";
import {Giveaway} from "./models/giveaway";

initializeFirebase();

export const checkAndNotify = onSchedule("every 24 hours", async () => {
  console.log("Checking for new giveaways...");
  try {
    const giveaways = await getGiveaways();
    if (giveaways.length === 0) {
      console.log("No giveaways found.");
      return;
    }

    const giveawayIds = giveaways.map((g) => g.id);
    const existingIds = await getExistingIds(giveawayIds);
    const newGiveaways = giveaways.filter((g) => !existingIds.includes(g.id));

    if (newGiveaways.length > 0) {
      console.log(`Found ${newGiveaways.length} new giveaways.`);
      await batchCreate(newGiveaways);

      for (const giveaway of newGiveaways) {
        const usersToNotify = await findUsersToNotifyForGiveaway(
            giveaway as Giveaway
        );
        const fcmTokens = usersToNotify.flatMap((user) => user.fcmTokens);

        if (fcmTokens.length > 0) {
          const title = "New Giveaway!";
          const body = `A new giveaway has been added: ${giveaway.title}`;
          await sendBatchNotifications(fcmTokens, title, body);
        }
      }
    } else {
      console.log("No new giveaways.");
    }
  } catch (error) {
    console.error("An unexpected error occurred in checkAndNotify:", error);
  }
});

export * from "./api/updatePreferences";
export * from "./api/getGiveaways";
export * from "./api/getPreferences";
