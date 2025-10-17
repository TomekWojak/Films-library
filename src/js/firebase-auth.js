import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
	getAuth,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyBkQOy6ixn4fEHqWxMlxxhkTKD-5ybXKZs",
	authDomain: "film-library-auth.firebaseapp.com",
	projectId: "film-library-auth",
	storageBucket: "film-library-auth.firebasestorage.app",
	messagingSenderId: "648543380429",
	appId: "1:648543380429:web:82726414a24f67eb815a84",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const verifyCredentials = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error.code,
		};
	}
};
