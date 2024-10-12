import { auth, db } from "@/app/Config/firebase"; // Import Firestore db
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { Alert } from "react-native";

// Validate the email and password inputs
const validate = (fullName: string, email: string, password: string) => {
  if (!fullName || !email || !password) {
    Alert.alert('Validation Error', 'Full name, email, and password are required.');
    return false;
  }
  if (password.length < 6) {
    Alert.alert('Validation Error', 'Password must be at least 6 characters.');
    return false;
  }
  return true;
};

const useAuthentication = () => {
  // Register a new user with full name, email, and password
  const register = async (fullName: string, email: string, password: string) => {
    if (!validate(fullName, email, password)) return; // Return if validation fails

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name in Firebase Authentication
      await updateProfile(userCredential.user, { displayName: fullName });

      // Store user data in Firestore
      const userRef = doc(db, "users", userCredential.user.uid); // Reference to the user document
      await setDoc(userRef, {
        fullName, // Store full name in Firestore
        email: userCredential.user.email, // Store email in Firestore
        uid: userCredential.user.uid, // Store UID in Firestore
        createdAt: new Date().toISOString(), // Add a created timestamp
      });
    } catch (error: any) { // Handle specific error types
      console.error('Error registering user:', error.message);
      Alert.alert('Registration Error', error.message || 'An error occurred while registering.');
    }
  };

  // Log in an existing user with email and password
   const login = async (email: string, password: string) => {
    try {
      console.log(`Logging in with email: ${email} and password: ${password}`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential) {
        console.log('Login successful:');
      } else {
        console.error('Login failed: No user credential returned');
      }

      return userCredential;
    } catch (error: any) { // Handle specific error types
      console.error('Login Error:', error.message);
      Alert.alert('Login Error', error.message || 'An error occurred while logging in.');
      throw error;
    }
  };

  // Log out the current user
  const logout = async () => {
    console.log('Logging out user');
    try {
      await signOut(auth);
      Alert.alert('Success', 'User logged out successfully!');
    } catch (error: any) { // Handle specific error types
      Alert.alert('Logout Error', error.message || 'An error occurred while logging out.');
    }
  };

  return {
    register,
    login,
    logout
  };
};

export default useAuthentication;