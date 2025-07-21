import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin SDK configuration using service account
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(firebaseAdminConfig),
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0];
}

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Utility functions for common operations
export class FirebaseService {
  // User management
  static async createUser(email: string, password: string, displayName?: string) {
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const userRecord = await auth.getUserByEmail(email);
      return userRecord;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  static async getUserByUid(uid: string) {
    try {
      const userRecord = await auth.getUser(uid);
      return userRecord;
    } catch (error) {
      console.error('Error getting user by UID:', error);
      throw error;
    }
  }

  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw error;
    }
  }

  // Firestore operations
  static async saveDocument(collection: string, docId: string, data: any) {
    try {
      await firestore.collection(collection).doc(docId).set(data);
      return { success: true };
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  static async getDocument(collection: string, docId: string) {
    try {
      const doc = await firestore.collection(collection).doc(docId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  static async updateDocument(collection: string, docId: string, data: any) {
    try {
      await firestore.collection(collection).doc(docId).update(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  static async deleteDocument(collection: string, docId: string) {
    try {
      await firestore.collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  static async queryDocuments(collection: string, field?: string, operator?: any, value?: any) {
    try {
      let query = firestore.collection(collection);
      
      if (field && operator && value !== undefined) {
        query = query.where(field, operator, value);
      }
      
      const snapshot = await query.get();
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return documents;
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Storage operations
  static async uploadFile(fileName: string, buffer: Buffer, contentType?: string) {
    try {
      const bucket = storage.bucket();
      const file = bucket.file(fileName);
      
      await file.save(buffer, {
        metadata: {
          contentType: contentType || 'application/octet-stream',
        },
      });
      
      // Make file publicly readable
      await file.makePublic();
      
      return {
        success: true,
        url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async deleteFile(fileName: string) {
    try {
      const bucket = storage.bucket();
      await bucket.file(fileName).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Custom claims for role-based access
  static async setCustomClaims(uid: string, claims: any) {
    try {
      await auth.setCustomUserClaims(uid, claims);
      return { success: true };
    } catch (error) {
      console.error('Error setting custom claims:', error);
      throw error;
    }
  }
}

// Alternative configuration if you have the service account JSON file
export const initializeFirebaseWithServiceAccount = (serviceAccountPath?: string) => {
  if (serviceAccountPath || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccount = require(serviceAccountPath || process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    
    if (!getApps().length) {
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }
  return app;
};

export default { auth, firestore, storage, FirebaseService };