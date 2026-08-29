import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// GANTI nilai di bawah ini dengan config dari Firebase Console:
// Project Settings > General > scroll ke "Your apps" > pilih app web kamu > "SDK setup and configuration"
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_KAMU",
  authDomain: "managerbyabidzar.firebaseapp.com",
  projectId: "managerbyabidzar",
  storageBucket: "managerbyabidzar.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);