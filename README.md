# 🎭 XMenity Social Token Factory

> **Create and manage social tokens for X (Twitter) creators using InsightIQ integration, deployed on Arbitrum**

A comprehensive social token factory that enables X (Twitter) creators to mint tokens based on their social engagement metrics, verified through InsightIQ and deployed on Arbitrum for low-cost transactions.

## 🌟 Features

### 🔗 Core Integrations
- **InsightIQ Connect SDK** - OAuth and social profile/engagement data
- **Thirdweb SDK** - Contract interaction and transaction sending  
- **Sign-In With Ethereum (SIWE)** - Wallet verification
- **Firebase** - Backend storage and analytics (diamond-zminter project)
- **Arbitrum One** - Low-cost blockchain deployment

### 🏗️ Smart Contract Features
- **Social Token Factory** - Deploy custom ERC-20 tokens for creators
- **Milestone-based Minting** - Token minting based on follower/engagement milestones
- **Oracle Integration** - Real-time social media data verification
- **Identity NFTs** - Soulbound tokens for creator verification
- **Batch Reward Distribution** - Efficient token distribution to followers

### 🎨 Frontend Features
- **Modern Next.js UI** - React, TailwindCSS, responsive design
- **Wallet Integration** - RainbowKit, Wagmi, Viem for Web3 connectivity
- **Real-time Analytics** - Firebase Analytics tracking
- **Multi-platform Deployment** - Vercel, Replit, GCP VM, Docker support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (diamond-zminter)
- InsightIQ API access
- Thirdweb account
- Web3 wallet (MetaMask recommended)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd xmenity-social-token-factory
npm install --legacy-peer-deps
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:

```bash
# Firebase Configuration (diamond-zminter project)
FIREBASE_PROJECT_ID=diamond-zminter
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@diamond-zminter.iam.gserviceaccount.com

# InsightIQ Integration
INSIGHTIQ_API_KEY=your_insightiq_api_key
INSIGHTIQ_CLIENT_ID=your_client_id
INSIGHTIQ_CLIENT_SECRET=your_client_secret

# Thirdweb Configuration
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# Smart Contract (Arbitrum One)
SOCIAL_TOKEN_FACTORY_ADDRESS=0x2AF9605d00E61Aa38a40562B651227b59c506275
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/social_tokens

# Security
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Database Setup
```bash
# Initialize Prisma
npx prisma generate
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

### 4. Development
```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📖 Documentation

### 🔥 Firebase Setup
Your project uses the **diamond-zminter** Firebase project:
- **Project ID**: `diamond-zminter`
- **Console**: https://console.firebase.google.com/project/diamond-zminter
- **Setup Guide**: See `scripts/firebase-setup.md`

### 🛠️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Firebase Admin  │    │  InsightIQ API  │
│   (Frontend)    │    │   (Database)     │    │  (Social Data)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────────────────────────────────────────────────────────────┐
    │                    Arbitrum One Network                         │
    │  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐    │
    │  │ Social Token    │  │   Creator    │  │   Identity      │    │
    │  │    Factory      │  │   Tokens     │  │     NFTs        │    │
    │  └─────────────────┘  └──────────────┘  └─────────────────┘    │
    └─────────────────────────────────────────────────────────────────┘
```

### 🔗 Smart Contract Integration

The factory contract `0x2AF9605d00E61Aa38a40562B651227b59c506275` on Arbitrum One provides:

```solidity
// Create new social token
function createSocialToken(
    string memory name,
    string memory symbol,
    address creator,
    uint256 initialSupply
) external returns (address tokenAddress);

// Mint tokens based on milestones
function mintFromMilestone(
    address tokenAddress,
    address recipient,
    uint256 amount,
    bytes calldata oracleData
) external;
```

### 📊 Analytics Events

Firebase automatically tracks:
- `wallet_connected` - User connects wallet
- `social_account_linked` - Links X/Twitter account  
- `token_created` - Creates new social token
- `token_minted` - Mints tokens from milestones
- `reward_distributed` - Distributes rewards to followers

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### GCP VM
```bash
npm run deploy:gcp
```

### Local Development
```bash
npm run deploy:local
```

### Docker
```bash
docker build -t xmenity-social-tokens .
docker run -p 3000:3000 xmenity-social-tokens
```

## 🧪 Testing

### Firebase Connection
```bash
npm run test:firebase
```

### Full Test Suite
```bash
npm test
```

## 🔐 Security Features

- **SIWE Authentication** - Cryptographic wallet verification
- **Rate Limiting** - API endpoint protection
- **Environment Validation** - Secure config management
- **Role-based Access** - Creator/admin/user permissions
- **Anti-Sybil Measures** - Prevent duplicate accounts
- **Oracle Verification** - Trusted social media data

## 🎯 Use Cases

### For Creators
- **Monetize Following** - Convert followers into token holders
- **Reward Engagement** - Distribute tokens for likes, retweets, comments
- **Milestone Rewards** - Automatic token minting at follower milestones
- **Community Building** - Create exclusive holder benefits

### For Followers
- **Earn Tokens** - Get rewarded for engaging with content
- **Creator Access** - Exclusive content and experiences
- **Token Trading** - Buy/sell creator tokens on secondary markets
- **Governance** - Vote on creator decisions

## 📈 Roadmap

- [ ] **Multi-chain Support** - Expand beyond Arbitrum
- [ ] **Advanced Analytics** - Detailed creator dashboards  
- [ ] **NFT Integration** - Combine tokens with exclusive NFTs
- [ ] **Mobile App** - React Native mobile application
- [ ] **DAO Features** - Decentralized governance for creators

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `scripts/firebase-setup.md`
- **Issues**: GitHub Issues
- **Discord**: [Join our community](#)
- **Email**: support@xmenity.com

## 🙏 Acknowledgments

- **Thirdweb** - Web3 development framework
- **InsightIQ** - Social media analytics
- **Firebase** - Backend infrastructure  
- **Arbitrum** - Layer 2 scaling solution
- **Next.js** - React framework

---

**Built with ❤️ for the creator economy on Web3** 🚀💎