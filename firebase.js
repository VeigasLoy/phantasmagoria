/* ========================================
JavaScript (firebase.js)
========================================
This file initializes Firebase and handles all authentication logic.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { 
    getAuth,
    signInWithRedirect, 
    GoogleAuthProvider, 
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firebase Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyDrsB2tVCChtR17CoWSr88Rcy7uI7pZ-w8",
    authDomain: "phantasmagoria-57bde.firebaseapp.com",
    projectId: "phantasmagoria-57bde",
    storageBucket: "phantasmagoria-57bde.appspot.com",
    messagingSenderId: "1093598854019",
    appId: "1:1093598854019:web:a713afd251ec429e7614b6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- Authentication Functions ---

export async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error("Google Sign-In failed:", error);
    }
}

export async function handleEmailSignIn() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('auth-error');
    if (!email || !password) {
        errorDiv.textContent = "Please enter email and password.";
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        errorDiv.textContent = "";
    } catch (error) {
        console.error("Email Sign-In failed:", error.message);
        errorDiv.textContent = "Invalid email or password.";
    }
}

export async function handleEmailSignUp() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('auth-error');
    if (!email || !password) {
        errorDiv.textContent = "Please enter email and password.";
        return;
    }
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        errorDiv.textContent = "";
    } catch (error) {
        console.error("Email Sign-Up failed:", error.code, error.message);
        switch (error.code) {
            case 'auth/weak-password':
                errorDiv.textContent = "Password should be at least 6 characters.";
                break;
            case 'auth/email-already-in-use':
                errorDiv.textContent = "This email is already in use.";
                break;
            case 'auth/invalid-email':
                errorDiv.textContent = "Please enter a valid email address.";
                break;
            default:
                errorDiv.textContent = "Error creating account. Please try again.";
                break;
        }
    }
}

export async function handleSignOut() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign out failed:", error);
    }
}
