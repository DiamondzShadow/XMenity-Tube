# 🚀 Staging Environment Setup Guide

This guide will help you set up your Social Token Factory for **staging/development** with your specific InsightIQ credentials.

## 📋 **Prerequisites**

- Node.js 18+ installed
- Firebase service account key file
- InsightIQ staging credentials (you have these!)
- PostgreSQL database (optional for local development)

## 🔧 **Environment Configuration**

### **1. Copy and configure your environment file:**

```bash
cp .env.example .env
```

### **2. Your InsightIQ Staging Configuration:**

```bash
# InsightIQ Configuration (Staging Environment)
INSIGHTIQ_BASE_URL=https://api.staging.insightiq.ai/v1
INSIGHTIQ_API_KEY=                                    # Leave empty - using OAuth
INSIGHTIQ_CLIENT_ID=62b74562-505d-4062-aa18-8ed30298b243
INSIGHTIQ_CLIENT_SECRET=f1a58605-ae7e-4450-8c92-3ada5dfcaabd
```

### **3. Generate your JWT secret:**

```bash
# Generate a secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add it to your `.env` file.

### **4. Firebase Configuration:**

Since you're using a service account, add your `serviceAccountKey.json` file to the project root:

```bash
# Your Firebase service account is already configured in .env.example
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com
# ... other Firebase settings
```

## 🏗️ **Installation & Setup**

### **1. Install dependencies:**
```bash
npm install
```

### **2. Set up database (optional for basic testing):**
```bash
# If using PostgreSQL
npx prisma generate
npx prisma migrate dev
```

### **3. Start development server:**
```bash
npm run dev
```

Your app will be available at: http://localhost:3000

## 🧪 **Testing InsightIQ Integration**

### **OAuth Flow Test:**

1. **Connect Wallet** - Use MetaMask or any Web3 wallet
2. **Sign SIWE Message** - Authenticate your wallet
3. **Link Twitter Account** - This will use your InsightIQ staging credentials
4. **Create Social Token** - Test the full flow

### **Expected Behavior in Staging:**

- ✅ **OAuth redirects** work with staging URLs
- ✅ **Profile data** is fetched from staging API
- ✅ **Engagement metrics** may be mock/test data
- ✅ **Token creation** works with test data

## 🔍 **Debugging InsightIQ Issues**

### **Check API Responses:**

The InsightIQ client includes logging. Check your console for:

```
InsightIQ API Request: POST /connect/twitter/initiate
InsightIQ API Request: GET /profile/62b74562-505d-4062-aa18-8ed30298b243
```

### **Common Issues:**

1. **401 Unauthorized:**
   - Check `CLIENT_ID` and `CLIENT_SECRET` are correct
   - Verify staging API URL is correct

2. **OAuth Redirect Issues:**
   - Ensure your redirect URI is whitelisted in InsightIQ staging
   - Check `NEXTAUTH_URL` matches your development URL

3. **API Rate Limits:**
   - Staging may have different rate limits than production
   - Implement retry logic for testing

## 🌐 **API Endpoints Being Used**

Your app will make requests to these InsightIQ staging endpoints:

```
POST /connect/twitter/initiate    # Start OAuth flow
POST /connect/twitter/callback    # Complete OAuth
GET  /profile/{accountId}         # Get profile data
GET  /engagement/{accountId}      # Get engagement metrics
POST /milestones/check           # Check milestone achievements
```

## 🔒 **Security Notes for Staging**

- ✅ **Client credentials** are properly configured
- ✅ **JWT secrets** are randomly generated
- ✅ **Firebase service account** is secure
- ⚠️ **Never commit** `.env` file to git
- ⚠️ **Use different secrets** for production

## 📊 **Monitoring & Analytics**

Your Firebase Analytics will track:
- Wallet connections
- Social account linking attempts
- Token creation events
- InsightIQ API calls

View analytics at: https://console.firebase.google.com/project/diamond-zminter/analytics

## 🆘 **Troubleshooting**

### **If InsightIQ API calls fail:**

1. **Verify credentials:**
   ```bash
   echo $INSIGHTIQ_CLIENT_ID
   echo $INSIGHTIQ_CLIENT_SECRET
   ```

2. **Check staging API status:**
   ```bash
   curl -I https://api.staging.insightiq.ai/v1/health
   ```

3. **Test authentication:**
   ```bash
   curl -X POST https://api.staging.insightiq.ai/v1/auth/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "62b74562-505d-4062-aa18-8ed30298b243",
       "client_secret": "f1a58605-ae7e-4450-8c92-3ada5dfcaabd",
       "grant_type": "client_credentials"
     }'
   ```

## 🔄 **Next Steps**

1. **Test OAuth Flow** - Connect a Twitter account
2. **Verify Data Sync** - Check profile and engagement data
3. **Create Test Token** - Test the complete flow
4. **Monitor Analytics** - Check Firebase dashboard
5. **Deploy to Staging** - Use deployment scripts when ready

Your staging environment is ready! 🎉

---

**Need Help?**
- Check the main README.md for additional setup instructions
- Review Firebase setup guide: `scripts/firebase-setup.md`
- Test API connections with the provided curl commands