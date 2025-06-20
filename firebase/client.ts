// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjlqDaucEepERjKrVYgdTOHfkp3xa0ero",
  authDomain: "discover-ease-ee29d.firebaseapp.com",
  projectId: "discover-ease-ee29d",
  storageBucket: "discover-ease-ee29d.firebasestorage.app",
  messagingSenderId: "74362577316",
  appId: "1:74362577316:web:62e0b71f3ae387e95b2131",
  measurementId: "G-0PNV4YPVL5",
};

// Initialize Firebase
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);

  if (typeof window !== "undefined" && (await isSupported())) {
    console.log("analytic initializing..");
    analytics = getAnalytics(app);
  }
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
  if (typeof window !== "undefined" && (await isSupported())) {
    console.log("analytic initializing..");

    analytics = getAnalytics(app);
  }
}
export { auth, storage, analytics };
// const analytics = getAnalytics(app);
