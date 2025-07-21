# Firebase Service Account Setup Guide for Diamond ZMinter Project

This guide helps you configure Firebase with service account authentication for your XMenity Social Token Factory using your **diamond-zminter** Firebase project.

## 🔑 Your Firebase Project Details

**Project ID:** `diamond-zminter`  
**Auth Domain:** `diamond-zminter.firebaseapp.com`  
**Database URL:** `https://diamond-zminter-default-rtdb.firebaseio.com`  
**Storage Bucket:** `diamond-zminter.firebasestorage.app`

## 📋 Getting Your Service Account Credentials

### Method 1: Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/diamond-zminter
   - You should see your "Diamond ZMinter" project

2. **Navigate to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

3. **Go to Service Accounts Tab**
   - Click on "Service accounts" tab
   - You'll see "Firebase Admin SDK" section

4. **Generate New Private Key**
   - Click "Generate new private key"
   - Download the JSON file (keep it secure!)

### Method 2: Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select "diamond-zminter" project

2. **Navigate to IAM & Admin > Service Accounts**
   - Find your Firebase Admin SDK service account
   - Should look like: `firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com`

3. **Create New Key**
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the file

## 🔧 Configuration for Your Project

### Environment Variables Setup

From your downloaded service account JSON file, extract these values:

```bash
# Your specific Firebase project configuration
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[Your actual private key here]\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com
FIREBASE_AUTH_DOMAIN=diamond-zminter.firebaseapp.com
FIREBASE_DATABASE_URL=https://diamond-zminter-default-rtdb.firebaseio.com/
FIREBASE_STORAGE_BUCKET=diamond-zminter.firebasestorage.app
```

### Example JSON Structure

Your service account file should look like:

```json
{
  "type": "service_account",
  "project_id": "diamond-zminter",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## 🏗️ For Your GCP VM Deployment

Since your VM is connected to your Firebase account:

### Option 1: VM Default Service Account (Easiest)

```bash
# Check if your VM has proper permissions
gcloud auth list

# Check current project
gcloud config get-value project

# Should show diamond-zminter
# If correct, you might only need:
FIREBASE_PROJECT_ID=diamond-zminter
```

### Option 2: Explicit Service Account

Set these environment variables on your VM:

```bash
# Create .env file on your VM
echo "FIREBASE_PROJECT_ID=diamond-zminter" >> .env
echo "FIREBASE_PRIVATE_KEY=\"[Your Private Key]\"" >> .env
echo "FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com" >> .env
```

## 🔍 Testing Your Configuration

Create a test file to verify the connection:

```javascript
// test-firebase-connection.js
const admin = require('firebase-admin');

// Test configuration
const firebaseConfig = {
  projectId: 'diamond-zminter',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

try {
  const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    projectId: 'diamond-zminter',
    databaseURL: 'https://diamond-zminter-default-rtdb.firebaseio.com',
    storageBucket: 'diamond-zminter.firebasestorage.app',
  });

  console.log('✅ Firebase connected successfully to diamond-zminter!');
  console.log('App name:', app.name);
  
  // Test Firestore
  const db = admin.firestore();
  db.collection('test').add({
    message: 'Connection test successful',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log('✅ Firestore write test successful!');
    process.exit(0);
  });

} catch (error) {
  console.error('❌ Firebase connection failed:', error);
  process.exit(1);
}
```

Run the test:
```bash
node test-firebase-connection.js
```

## 📊 Firebase Analytics Integration

Your project also includes Analytics tracking. The client-side will automatically track:

- Wallet connections
- Social account linking
- Token creation events
- Reward distributions
- User engagement metrics

Analytics Dashboard: https://console.firebase.google.com/project/diamond-zminter/analytics

## 🛡️ Security Checklist

- [ ] Downloaded service account JSON securely
- [ ] Added JSON file to `.gitignore` 
- [ ] Set environment variables correctly
- [ ] Tested Firebase connection
- [ ] Verified Firestore rules are properly configured
- [ ] Enabled necessary Firebase services (Auth, Firestore, Storage, Analytics)

## 🚨 Troubleshooting Common Issues

### Error: "Project diamond-zminter not found"
- Verify you have access to the project
- Check that the project ID is exactly `diamond-zminter`

### Error: "Permission denied"
- Ensure your service account has the "Firebase Admin SDK Administrator Service Agent" role
- Check IAM permissions in Google Cloud Console

### Error: "Invalid private key"
- Make sure newlines are properly escaped: `\\n` in .env files
- Verify the key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

## 🎯 Quick Setup Commands

```bash
# For GCP VM (if service account is pre-configured)
export FIREBASE_PROJECT_ID=diamond-zminter

# For manual setup (replace with your actual values)
export FIREBASE_PROJECT_ID=diamond-zminter
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[Your Key]\n-----END PRIVATE KEY-----"
export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com"

# Test the setup
npm run test:firebase
```

Your Firebase configuration is now ready for the diamond-zminter project! 🚀💎