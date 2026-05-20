// api/_lib/firebase.js
// Firebase Admin init for Vercel serverless. Module-scoped so it persists across warm invocations.

import admin from 'firebase-admin';

let _app = null;
let _db = null;
let _auth = null;

function getCredentials() {
  const credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };

  if (credentials.projectId && credentials.clientEmail && credentials.privateKey) {
    return credentials;
  }

  throw new Error(
    'Firebase Admin env vars are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in Vercel.'
  );
}

export function getAdminApp() {
  if (_app) return _app;

  if (!admin.apps.length) {
    _app = admin.initializeApp({
      credential: admin.credential.cert(getCredentials())
    });
  } else {
    _app = admin.app();
  }

  return _app;
}

export function getDb() {
  if (_db) return _db;
  _db = getAdminApp().firestore();
  return _db;
}

export function getAuth() {
  if (_auth) return _auth;
  _auth = getAdminApp().auth();
  return _auth;
}

export { admin };
