import { firestore } from 'firebase-admin';
import { User } from '../models/user';
import { Giveaway } from '../models/giveaway';

const db = firestore();
const usersCollection = db.collection('users');

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => doc.data() as User);
}

export const getAllFcmTokens = async (): Promise<string[]> => {
    const users = await getUsers();
    return users.flatMap(user => user.fcmTokens);
};

export const findUsersToNotifyForGiveaway = async (giveaway: Giveaway): Promise<User[]> => {
    let query: firestore.Query = usersCollection;

    const platforms = giveaway.platforms.split(', ');
    if (platforms.length > 0) {
        query = query.where('notificationPreferences.platforms', 'array-contains-any', platforms);
    }

    const giveawayType = giveaway.type;
    if (giveawayType) {
        query = query.where('notificationPreferences.types', 'array-contains', giveawayType);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as User);
};