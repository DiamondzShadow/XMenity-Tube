# 🎭 XMenity Social Token Factory

> **The Complete Social Token Platform - Beautiful UI meets Powerful Backend**

A comprehensive social token factory that enables X (Twitter) creators to mint tokens based on their social engagement metrics, featuring a modern UI built with Radix components and powerful backend integration with InsightIQ, Firebase, and Arbitrum.

## ✨ Features

### 🎨 **Modern Frontend (Next.js 15 + Radix UI)**
- **Beautiful Dashboard** - Clean, modern interface with gradient backgrounds
- **Radix UI Components** - Professional, accessible UI components
- **Real-time Updates** - Live token metrics and social stats
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark/Light Theme** - Theme switching with next-themes
- **Interactive Charts** - Token performance visualization with Recharts

### 🔗 **Backend Integration**
- **InsightIQ Connect SDK** - OAuth and social profile/engagement data
- **Thirdweb SDK** - Contract interaction and transaction sending  
- **Sign-In With Ethereum (SIWE)** - Wallet verification
- **Firebase Integration** - Backend storage and analytics (diamond-zminter project)
- **Arbitrum One** - Low-cost blockchain deployment

### 🏗️ **Smart Contract Features**
- **Social Token Factory** - Deploy custom ERC-20 tokens for creators
- **Milestone-based Minting** - Automatic token rewards for social milestones
- **Oracle Integration** - Real-time social metrics verification
- **Identity NFTs** - Soulbound tokens for creator verification
- **Reward Distribution** - Batch token transfers to supporters

### 🛡️ **Security & Compliance**
- **Role-based Access Control** - Secure permission management
- **Rate Limiting** - API protection against abuse
- **SIWE Authentication** - Cryptographic wallet verification
- **Input Validation** - Comprehensive data sanitization
- **Anti-Sybil Measures** - Protection against fake accounts

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase account
- InsightIQ API access
- Thirdweb account

### **1. Clone the Repository**
```bash
git clone https://github.com/DiamondzShadow/XMenity-Tube.git
cd XMenity-Tube
```

### **2. Install Dependencies**
```bash
npm install --legacy-peer-deps
```

### **3. Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### **4. Required Environment Variables**

#### **Firebase Configuration (diamond-zminter project)**
```bash
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@diamond-zminter.iam.gserviceaccount.com
FIREBASE_AUTH_DOMAIN=diamond-zminter.firebaseapp.com
FIREBASE_DATABASE_URL=https://diamond-zminter-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=diamond-zminter.firebasestorage.app
```

#### **InsightIQ Configuration (Staging)**
```bash
INSIGHTIQ_BASE_URL=https://api.staging.insightiq.ai/v1
INSIGHTIQ_CLIENT_ID=62b74562-505d-4062-aa18-8ed30298b243
INSIGHTIQ_CLIENT_SECRET=f1a58605-ae7e-4450-8c92-3ada5dfcaabd
```

#### **Smart Contract Configuration**
```bash
FACTORY_CONTRACT_ADDRESS=0x2AF9605d00E61Aa38a40562B651227b59c506275
ARBITRUM_RPC_URL=https://arbitrum-one.infura.io/v3/your_infura_key
CHAIN_ID=42161
```

#### **Application Configuration**
```bash
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_generated_64_character_random_hex_string
```

### **5. Generate JWT Secret**
```bash
# Generate a secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### **6. Start Development Server**
```bash
npm run dev
```

Your app will be available at `http://localhost:3000` 🎉

## 🏗️ Architecture

### **Frontend Stack**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Radix UI** - Professional component library
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Recharts** - Data visualization
- **next-themes** - Theme management

### **Web3 Stack**
- **Wagmi v2** - React hooks for Ethereum
- **Viem v2** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **Thirdweb SDK** - Web3 development tools
- **SIWE** - Sign-In With Ethereum

### **Backend Stack**
- **Firebase Admin SDK** - Server-side Firebase integration
- **InsightIQ API** - Social media analytics
- **Prisma ORM** - Database management
- **Express.js** - API server
- **JSON Web Tokens** - Session management

## 🎨 UI Components

### **Dashboard Features**
- **📊 Analytics Cards** - Real-time token metrics
- **🎛️ Token Creation** - Step-by-step token launcher
- **🐦 Social Integration** - X/Twitter account linking
- **📈 Performance Charts** - Token analytics and growth
- **⚙️ Settings Panel** - Configuration management

### **Component Examples**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Beautiful gradient buttons
<Button className="bg-purple-600 hover:bg-purple-700">
  Create Token
</Button>

// Professional cards with metrics
<Card>
  <CardHeader>
    <CardTitle>Total Value</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$12,345</div>
  </CardContent>
</Card>
```

## 🔧 Deployment

### **Vercel (Recommended)**
```bash
npm run deploy:vercel
```

### **Local Development**
```bash
npm run dev
```

### **Docker**
```bash
docker build -t xmenity-social-factory .
docker run -p 3000:3000 xmenity-social-factory
```

### **GCP VM**
```bash
# For external access (replace with your IP)
npm run dev -- -H 0.0.0.0
# Configure firewall for port 3000
```

## 📱 External Access (VM Deployment)

For deployment on cloud VMs with external IP access:

### **AWS EC2**
1. Go to **Security Groups** in AWS Console
2. Add **Inbound Rule**: Custom TCP, Port 3000, Source 0.0.0.0/0

### **Google Cloud**
```bash
gcloud compute firewall-rules create allow-xmenity-port \
  --allow tcp:3000 \
  --description="Allow XMenity Social Token Factory on port 3000" \
  --direction=INGRESS
```

### **Test External Access**
```bash
curl -I http://YOUR_EXTERNAL_IP:3000
```

## 🧪 Testing

### **Firebase Connection**
```bash
npm run test:firebase
```

### **Development Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run update-vm    # Update VM deployment
```

## 📚 API Routes

### **Authentication**
- `POST /api/siwe/nonce` - Generate SIWE nonce
- `POST /api/siwe/verify` - Verify SIWE signature

### **Token Management**
- `POST /api/tokens/create` - Create new social token
- `GET /api/tokens/user` - Get user's tokens
- `POST /api/tokens/mint` - Mint tokens based on milestones

### **Social Integration**
- `POST /api/social/connect` - Connect X/Twitter account
- `GET /api/social/stats` - Get social media statistics
- `POST /api/social/verify` - Verify social milestones

## 🗄️ Database Schema

```sql
-- Core tables for social token management
User          - User accounts and wallet addresses
SocialAccount - Connected social media accounts
CreatorToken  - Deployed creator tokens
IdentityNFT   - Soulbound identity tokens
TokenDistribution - Token distribution records
RewardClaim   - Milestone reward claims
OracleUpdate  - Social metrics updates
```

## 🎯 Roadmap

### **Phase 1: Core Platform ✅**
- [x] Social token creation
- [x] Wallet integration
- [x] Basic UI components

### **Phase 2: Enhanced UI ✅**
- [x] Modern Radix UI components
- [x] Beautiful dashboard
- [x] Responsive design

### **Phase 3: Advanced Features 🚧**
- [ ] Advanced analytics
- [ ] Multi-chain support
- [ ] DAO governance integration

### **Phase 4: Ecosystem 📋**
- [ ] Mobile app
- [ ] Third-party integrations
- [ ] Marketplace features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** - Amazing component library
- **Vercel** - Deployment platform
- **Thirdweb** - Web3 development tools
- **InsightIQ** - Social media analytics
- **Arbitrum** - Layer 2 scaling solution

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **Documentation**: [Your docs URL]  
- **Discord**: [Your Discord server]
- **Twitter**: [Your Twitter handle]

---

**Built with ❤️ by DiamondzShadow**

*Empowering creators with decentralized social tokens* 🚀