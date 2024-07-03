import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

export const db = admin.firestore();
export const auth = admin.auth();

module.exports = { admin};
