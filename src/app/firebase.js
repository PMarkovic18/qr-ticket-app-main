import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCZBM8iM2MQdwI9lU3YoJumUidldCsG7QI",
  authDomain: "qr-ticket-app-1dd83.firebaseapp.com",
  projectId: "qr-ticket-app-1dd83",
  storageBucket: "qr-ticket-app-1dd83.appspot.com",
  messagingSenderId: "309424713165",
  appId: "1:309424713165:web:02928efca473156dfda884",
  measurementId: "G-1843LPRWKX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };