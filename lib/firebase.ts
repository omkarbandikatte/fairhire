import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBSvqxuHDroQgy1GIyDTTPttwiKBo5RTFw",
  authDomain: "login-auth-d5749.firebaseapp.com",
  projectId: "login-auth-d5749",
  storageBucket: "login-auth-d5749.firebasestorage.app",
  messagingSenderId: "928966742841",
  appId: "1:928966742841:web:839c5d3071b92f43720ee8",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
