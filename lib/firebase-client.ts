// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE6zHl0Gq0neyzy3fYLYvuc_JuJSGL_0c",
  authDomain: "diamond-zminter.firebaseapp.com",
  databaseURL: "https://diamond-zminter-default-rtdb.firebaseio.com",
  projectId: "diamond-zminter",
  storageBucket: "diamond-zminter.firebasestorage.app",
  messagingSenderId: "645985546491",
  appId: "1:645985546491:web:f17b7c96929114d63f405e",
  measurementId: "G-R34WPFKLDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Helper functions for client-side operations
export const FirebaseClient = {
  // Auth helpers
  getCurrentUser: () => auth.currentUser,
  
  // Analytics helpers
  logEvent: (eventName: string, eventParams?: any) => {
    if (analytics) {
      import("firebase/analytics").then(({ logEvent }) => {
        logEvent(analytics, eventName, eventParams);
      });
    }
  },

  // Custom events for our Social Token Factory
  logUserConnectedWallet: (walletAddress: string) => {
    FirebaseClient.logEvent('wallet_connected', { wallet_address: walletAddress });
  },

  logSocialAccountLinked: (platform: string, username: string) => {
    FirebaseClient.logEvent('social_account_linked', { platform, username });
  },

  logTokenCreated: (tokenName: string, tokenSymbol: string) => {
    FirebaseClient.logEvent('token_created', { token_name: tokenName, token_symbol: tokenSymbol });
  },

  logTokenMinted: (tokenAddress: string, amount: string) => {
    FirebaseClient.logEvent('token_minted', { token_address: tokenAddress, amount });
  },

  logRewardDistributed: (tokenAddress: string, recipientCount: number, totalAmount: string) => {
    FirebaseClient.logEvent('reward_distributed', { 
      token_address: tokenAddress, 
      recipient_count: recipientCount, 
      total_amount: totalAmount 
    });
  },
};

export default app;