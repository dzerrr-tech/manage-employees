import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRLOsf166VNsodvjVBRDUOgW1ISTrNV-0", 
  authDomain: "managerbyabidzar.firebaseapp.com",
  projectId: "managerbyabidzar",
  storageBucket: "managerbyabidzar.appspot.com",
  messagingSenderId: "895354084443", 
  appId: "1:895354084443:web:6911e1929474240ceab37e" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const API_BASE_URL = 'https://managerbyabidzar-production.up.railway.app/api';
