# Firebase Service Account Setup Guide

This guide helps you configure Firebase with service account authentication for your XMenity Social Token Factory.

## 🔑 Getting Your Firebase Service Account Credentials

### Method 1: Using Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

3. **Go to Service Accounts Tab**
   - Click on "Service accounts" tab
   - You'll see "Firebase Admin SDK" section

4. **Generate New Private Key**
   - Click "Generate new private key"
   - Download the JSON file
   - Keep this file secure!

### Method 2: Using Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your Firebase project

2. **Navigate to IAM & Admin > Service Accounts**
   - Find your Firebase Admin SDK service account
   - Click on it

3. **Create New Key**
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the file

## 🔧 Configuration Options

### Option 1: Environment Variables (Recommended for Production)

Extract these values from your service account JSON file:

```bash
# From your service account JSON file
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Option 2: Service Account File Path

```bash
# Point to your downloaded JSON file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
FIREBASE_PROJECT_ID=your-project-id
```

## 🏗️ For Different Deployment Platforms

### **GCP VM Deployment**

If your VM is already configured with a service account:

```bash
# Check if service account is configured
gcloud auth list

# If configured, you might not need explicit credentials
# Just set the project ID
FIREBASE_PROJECT_ID=your-project-id
```

### **Vercel Deployment**

```bash
# Add these environment variables in Vercel dashboard
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Important for Vercel:** Make sure to properly escape the private key:
- Replace actual line breaks with `\n`
- Wrap the entire key in quotes

### **Replit Deployment**

In Replit Secrets:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### **Docker Deployment**

Either use environment variables or mount the JSON file:

```dockerfile
# Option 1: Environment variables in docker-compose.yml
environment:
  - FIREBASE_PROJECT_ID=your-project-id
  - FIREBASE_PRIVATE_KEY=your-private-key
  - FIREBASE_CLIENT_EMAIL=your-client-email

# Option 2: Mount JSON file
volumes:
  - ./path/to/service-account.json:/app/service-account.json
environment:
  - GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
```

## 🔍 Testing Your Configuration

Create a test script to verify your Firebase connection:

```javascript
// test-firebase.js
const { FirebaseService } = require('./lib/firebase');

async function testFirebase() {
  try {
    // Test Firestore connection
    const testDoc = await FirebaseService.saveDocument('test', 'connection', {
      timestamp: new Date(),
      message: 'Firebase connection successful!'
    });
    
    console.log('✅ Firebase connected successfully!');
    
    // Clean up test document
    await FirebaseService.deleteDocument('test', 'connection');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
}

testFirebase();
```

Run the test:
```bash
node test-firebase.js
```

## 🛡️ Security Best Practices

1. **Never commit service account files** to version control
2. **Use environment variables** in production
3. **Restrict service account permissions** to only what's needed
4. **Rotate keys regularly** (every 90 days recommended)
5. **Monitor service account usage** in Firebase console

## 🚨 Troubleshooting

### Common Errors:

**Error: "FIREBASE_PRIVATE_KEY is not valid"**
- Make sure private key includes header/footer
- Check for proper escaping of newlines (`\n`)
- Verify quotes around the entire key

**Error: "Service account does not exist"**
- Verify FIREBASE_CLIENT_EMAIL is correct
- Check that service account has proper roles
- Ensure project ID matches

**Error: "Permission denied"**
- Service account needs "Firebase Admin SDK Administrator Service Agent" role
- Add additional roles as needed for your specific use case

### Verification Steps:

1. **Check environment variables are loaded:**
   ```javascript
   console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
   console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
   console.log('Private Key (first 50 chars):', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50));
   ```

2. **Test with minimal Firebase operation:**
   ```javascript
   const admin = require('firebase-admin');
   
   // This should not throw an error
   const app = admin.initializeApp({
     credential: admin.credential.cert({
       projectId: process.env.FIREBASE_PROJECT_ID,
       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
     }),
   });
   
   console.log('Firebase app initialized:', app.name);
   ```

## 📚 Additional Resources

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Service Account Authentication](https://cloud.google.com/docs/authentication/getting-started)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## 🎯 Next Steps

After configuring Firebase:

1. ✅ Set up your environment variables
2. ✅ Test the connection
3. ✅ Deploy your Social Token Factory
4. ✅ Configure Firestore security rules
5. ✅ Set up Firebase Functions (if needed)

Your Firebase service account is now ready for the Social Token Factory! 🚀