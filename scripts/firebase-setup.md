# Firebase Service Account Setup Guide for Diamond ZMinter Project

This guide helps you configure Firebase with service account authentication for your XMenity Social Token Factory using your **diamond-zminter** Firebase project.

## 🔑 Your Firebase Project Details

**Project ID:** `diamond-zminter`  
**Service Account:** `firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com`  
**Auth Domain:** `diamond-zminter.firebaseapp.com`  
**Database URL:** `https://diamond-zminter-default-rtdb.firebaseio.com`  
**Storage Bucket:** `diamond-zminter.firebasestorage.app`

## 📋 Service Account Configuration Options

### Method 1: Service Account Key File (Recommended for Local Development)

1. **Download Your Service Account Key**
   - Go to: https://console.firebase.google.com/project/diamond-zminter/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save the file as `serviceAccountKey.json` in your project root

2. **Set Environment Variable** (Optional)
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./serviceAccountKey.json
   ```

3. **The app will automatically detect and use the key file**

### Method 2: Environment Variables (Production/Deployment)

If you prefer environment variables or for production deployment:

```bash
# Firebase Configuration (Service Account)
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://diamond-zminter-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=diamond-zminter.firebasestorage.app

# Extract the private key from your service account JSON file
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_actual_private_key_here\n-----END PRIVATE KEY-----"
```

## 🚀 Platform-Specific Setup

### **GCP VM (Your Current Setup)**

Since you mentioned your VM is connected to your Firebase account:

```bash
# Option A: Use service account key file (easiest)
wget "https://console.firebase.google.com/project/diamond-zminter/settings/serviceaccounts/adminsdk" -O serviceAccountKey.json

# Option B: Use gcloud to get credentials
gcloud auth application-default login
```

### **Local Development**

```bash
# Clone the repo
git clone [your-repo-url]
cd xmenity-tube

# Copy your service account key
cp /path/to/your/serviceAccountKey.json ./serviceAccountKey.json

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Vercel Deployment**

In your Vercel dashboard, add environment variables:

```
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your-private-key]\n-----END PRIVATE KEY-----"
FIREBASE_DATABASE_URL=https://diamond-zminter-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=diamond-zminter.firebasestorage.app
```

### **Docker Deployment**

```dockerfile
# Mount service account key as volume
docker run -v /path/to/serviceAccountKey.json:/app/serviceAccountKey.json your-app

# Or use environment variables in docker-compose.yml
environment:
  - FIREBASE_PROJECT_ID=diamond-zminter
  - FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com
  - FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
```

## 🔐 Security Best Practices

1. **Never commit service account keys to git**
   - The `.gitignore` includes `serviceAccountKey.json`
   - Use environment variables for production

2. **Rotate keys regularly**
   - Generate new keys every 90 days
   - Delete old keys from Firebase Console

3. **Limit service account permissions**
   - Only grant necessary Firebase features
   - Use Firebase Security Rules

## ✅ Testing Your Setup

Run the test command to verify Firebase connection:

```bash
npm run test:firebase
```

This will test:
- Firebase Admin SDK initialization
- Firestore connection
- Authentication service
- Storage access

## 🆘 Troubleshooting

### Common Issues:

1. **"Error: Could not load the default credentials"**
   - Ensure service account key file exists
   - Check file permissions (readable)
   - Verify environment variables are set

2. **"Firebase App already initialized"**
   - Normal behavior, app reuses existing instance
   - No action needed

3. **"Insufficient permissions"**
   - Check service account has required roles:
     - Firebase Admin SDK Administrator
     - Cloud Datastore User
     - Firebase Authentication Admin

### Debug Mode:

Enable debug logging:
```bash
DEBUG=firebase* npm run dev
```

## 📞 Support

If you encounter issues:
1. Check the Firebase Console for your project
2. Verify service account permissions
3. Test with minimal Firebase operations first
4. Check the application logs for detailed error messages

---

**Your Service Account Email:** `firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com`  
**Project Console:** https://console.firebase.google.com/project/diamond-zminter