import * as admin from "firebase-admin";

let initialized = false;

export const initializeFirebase = (): void => {
  if (!initialized) {
    admin.initializeApp();
    initialized = true;
  }
};

export const getFirestore = () => {
  if (!initialized) {
    initializeFirebase();
  }
  return admin.firestore();
};

export const getAuth = () => {
  if (!initialized) {
    initializeFirebase();
  }
  return admin.auth();
};

export const getStorage = () => {
  if (!initialized) {
    initializeFirebase();
  }
  return admin.storage();
};

export const getMessaging = () => {
  if (!initialized) {
    initializeFirebase();
  }
  return admin.messaging();
};