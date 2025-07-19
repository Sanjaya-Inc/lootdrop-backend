
import { messaging } from 'firebase-admin';

export const sendNotification = async (token: string, title: string, body: string) => {
    const message = {
        notification: {
            title,
            body,
        },
        token,
    };

    await messaging().send(message);
};

export const sendBatchNotifications = async (tokens: string[], title: string, body: string) => {
    const messages = tokens.map(token => ({
        notification: {
            title,
            body,
        },
        token,
    }));

    if (messages.length > 0) {
        await messaging().sendAll(messages);
    }
};
