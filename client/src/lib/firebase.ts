import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBSgeLnIx5kJQc706lZbdyzW-xBLRc4K8o",
  authDomain: "fitzel-auto.firebaseapp.com",
  databaseURL: "https://fitzel-auto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "Fitzel-auto",
  storageBucket: "fitzel-auto.firebasestorage.app",
  messagingSenderId: "484013462731",
  appId: "1:484013462731:web:cbec9232551cd6bb11b74e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
