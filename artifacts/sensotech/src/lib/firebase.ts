import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAIAuy0kaXTHwB92-fHB2lTpoanAmnAkEg",
  authDomain: "sensotech-939b4.firebaseapp.com",
  databaseURL: "https://sensotech-939b4-default-rtdb.firebaseio.com",
  projectId: "sensotech-939b4",
  storageBucket: "sensotech-939b4.appspot.com",
  messagingSenderId: "1234567890",
  appId: "sensotech-web",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
