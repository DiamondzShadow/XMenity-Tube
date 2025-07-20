# XMenity Social Token Factory 🚀

A comprehensive platform for X (Twitter) creators to launch their own community tokens on Arbitrum, powered by InsightIQ verification and milestone-based tokenomics.

## 🌟 Overview

XMenity Social Token Factory empowers verified social media creators to:
- Create custom ERC-20 community tokens with milestone-based minting
- Deploy smart contract wallets on Arbitrum
- Mint identity NFTs/Soulbound Tokens (SBTs) for verification
- Distribute rewards to followers based on engagement metrics
- Build sustainable creator economies backed by real social influence

## 📋 Deployed Contract Information

**Factory Contract Address:** `0x2AF9605d00E61Aa38a40562B651227b59c506275`  
**Network:** Arbitrum One (Chain ID: 42161)  
**Admin Address:** `0x5ED9006821a00A16D059C51C70FC2216fd996D57`  
**Contract Type:** ERC20 Factory (TokenERC20)  
**Symbol:** SOCIALF  

## 🏗️ Architecture Components

### 1. **InsightIQ Integration**
- OAuth authentication with X (Twitter)
- Verified profile data retrieval
- Real-time engagement metrics
- Anti-Sybil protection

### 2. **Smart Contract System**
- **Wallet Factory:** On-demand smart wallet deployment
- **Token Factory:** Custom ERC-20 token creation with milestone logic
- **Identity NFT Contract:** Soulbound tokens for creator verification
- **Reward Distributor:** Batch token distribution to followers

### 3. **Milestone-Based Tokenomics**
- **Continuous Growth:** Mint tokens per new follower
- **Threshold Model:** Milestone-based minting (10k, 20k followers)
- **Content-Driven:** Rewards based on posts and engagement
- **Oracle Integration:** Chainlink-powered data feeds

### 4. **Frontend Dashboard**
- Next.js application with Web3 integration
- Wallet connection (MetaMask, WalletConnect)
- Real-time metrics dashboard
- Token creation and management interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A wallet with Arbitrum network configured
- InsightIQ API access
- Database (PostgreSQL)

### Installation

```bash
# Clone the repository
git clone https://github.com/DiamondzShadow/XMenity-Tube.git
cd XMenity-Tube

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Environment Configuration

```env
# Thirdweb Configuration
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# Contract Configuration
FACTORY_CONTRACT_ADDRESS=0x2AF9605d00E61Aa38a40562B651227b59c506275
ADMIN_WALLET_PRIVATE_KEY=your_admin_private_key

# InsightIQ Configuration
INSIGHTIQ_API_KEY=your_insightiq_api_key
INSIGHTIQ_BASE_URL=https://api.staging.insightiq.ai/v1

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/social_tokens
```

## 📱 User Flow

### For Creators:

1. **Connect X Account** → Verify identity via InsightIQ
2. **Deploy Smart Wallet** → Create Arbitrum wallet for token management
3. **Launch Community Token** → Define tokenomics and deploy ERC-20
4. **Mint Identity NFT** → Get verified creator badge (optional)
5. **Reward Community** → Distribute tokens to engaged followers

### For Followers:

1. **Link Wallet** → Connect wallet to receive rewards
2. **Verify Identity** → Prove social media account ownership
3. **Engage & Earn** → Receive tokens based on engagement
4. **Use Tokens** → Participate in creator economy

## 🔧 Technical Stack

### Smart Contracts
- **Solidity 0.8.17+**
- **OpenZeppelin** (ERC20, ERC721, Access Control)
- **Thirdweb SDK** for contract interactions
- **Chainlink Oracles** for off-chain data

### Frontend
- **Next.js 14** with TypeScript
- **Wagmi & Viem** for Web3 integration
- **RainbowKit** for wallet connections
- **TailwindCSS** for styling
- **Prisma ORM** for database

### Backend
- **Express.js** API server
- **JWT** authentication
- **PostgreSQL** database
- **InsightIQ SDK** integration

## 🔒 Security Features

- **SIWE (Sign-In With Ethereum)** for wallet verification
- **Oracle-gated minting** prevents arbitrary token creation
- **Role-based access control** for smart contracts
- **Rate limiting** and anti-Sybil mechanisms
- **Soulbound tokens** for non-transferable identity

## 📊 Token Economics Example

```solidity
// Example: Alice's Token Configuration
Name: "AliceCoin"
Symbol: "ALICE"
Initial Supply: 0
Minting Rule: 1 ALICE per new follower
Milestone Bonus: 1000 ALICE at 10k followers
Burn Mechanism: Manual owner burn
```

## 🎯 Use Cases

### Content Creators
- Launch fan tokens tied to growth metrics
- Reward top supporters automatically
- Build exclusive content access systems
- Create community governance tokens

### Influencers
- Monetize follower engagement
- Distribute brand partnership rewards
- Build loyalty programs
- Create NFT collections for fans

### Communities
- Establish community currencies
- Reward active participation
- Create milestone-based incentives
- Build decentralized creator funds

## 🛠️ Development

### Running Tests
```bash
npm test                  # Run all tests
npm run test:contracts    # Smart contract tests
npm run test:integration  # Integration tests
```

### Contract Deployment
```bash
npx hardhat compile
npx hardhat deploy --network arbitrum
npx hardhat verify CONTRACT_ADDRESS --network arbitrum
```

### Database Migration
```bash
npx prisma migrate dev
npx prisma studio  # Database admin interface
```

## 📈 Roadmap

- [ ] **Phase 1:** Core token factory implementation
- [ ] **Phase 2:** Advanced milestone configurations
- [ ] **Phase 3:** Cross-platform social media support
- [ ] **Phase 4:** DAO governance for communities
- [ ] **Phase 5:** Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **Documentation:** [docs.xmenity.com](https://docs.xmenity.com)
- **Discord:** [Join Community](https://discord.gg/xmenity)
- **Twitter:** [@XMenityTube](https://twitter.com/XMenityTube)

## 🙏 Acknowledgments

- **InsightIQ** for social media verification APIs
- **Thirdweb** for Web3 development tools
- **Arbitrum** for scalable blockchain infrastructure
- **Chainlink** for reliable oracle services

---

**Built with ❤️ by the XMenity Team**

*Empowering creators to build sustainable token economies backed by real social influence.*