# 🌱 RePlas - Decentralized Plastic Waste Management Platform

<div align="center">

![RePlas Logo](public/logo.png)

**Transforming plastic waste into digital rewards through blockchain technology**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![Celo](https://img.shields.io/badge/Celo-Blockchain-green)](https://celo.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[Live Demo](https://replas-demo.vercel.app) • [Documentation](https://docs.replas.org) • [API Reference](https://api.replas.org/docs)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Smart Contract Deployment](#smart-contract-deployment)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🌍 Overview

RePlas is a revolutionary decentralized platform that incentivizes plastic waste recycling through blockchain technology. Built on the Celo network, it creates a transparent, traceable, and rewarding ecosystem for plastic waste management across Africa and beyond.

### 🎯 Mission

To create a sustainable circular economy for plastic waste by connecting consumers, producers, and recyclers through blockchain-verified transactions and AI-powered verification systems.

### 🔍 Problem Statement

- **8 million tons** of plastic waste enter oceans annually
- **91%** of plastic waste is not recycled globally
- Lack of transparency in recycling supply chains
- Limited incentives for proper waste disposal
- Difficulty tracking plastic waste lifecycle

### 💡 Solution

RePlas addresses these challenges by:
- **Tokenizing recycling efforts** with blockchain rewards
- **AI-powered verification** of plastic submissions
- **Complete traceability** from production to recycling
- **Gamified experience** encouraging participation
- **Direct connection** between stakeholders

## ✨ Features

### 🔐 Core Features

- **🪙 Token Rewards**: Earn RePlas tokens for verified plastic submissions
- **📱 QR Code Tracking**: Complete traceability through QR codes
- **🤖 AI Verification**: Gemini AI-powered plastic type identification
- **🌐 Blockchain Integration**: Transparent transactions on Celo network
- **📊 Impact Analytics**: Real-time environmental impact tracking
- **🏪 Marketplace**: Redeem tokens for eco-friendly products
- **👥 Community Features**: Leaderboards, challenges, and social impact

### 🎭 User Roles

#### 👤 Consumers
- Submit plastic waste for recycling
- Earn tokens for verified submissions
- Track personal environmental impact
- Participate in community challenges

#### 🏭 Producers
- Generate QR codes for plastic products
- Track product lifecycle
- Verify recycling completion
- Access sustainability analytics

#### ♻️ Recyclers
- Verify plastic submissions
- Process waste materials
- Earn processing fees
- Manage recycling operations

#### 👨‍💼 Administrators
- Platform oversight and management
- Smart contract administration
- Analytics and reporting
- Community moderation

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with role-based access
- **File Storage**: AWS S3
- **API Documentation**: Swagger/OpenAPI

### Blockchain
- **Network**: Celo (Alfajores Testnet / Mainnet)
- **Smart Contracts**: Solidity
- **Web3 Library**: ethers.js + Celo ContractKit
- **Token Standard**: ERC-20 (RePlas Token)
- **NFTs**: ERC-721 (Impact Certificates)

### AI & Machine Learning
- **AI Provider**: Google Gemini 2.5 Pro
- **Image Analysis**: Computer Vision for plastic identification
- **Natural Language**: Conversational AI for education
- **Analytics**: Environmental impact calculations

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / AWS EC2
- **Database**: MongoDB Atlas
- **CDN**: Cloudflare
- **Monitoring**: Sentry + Analytics

## 🏗 Architecture

```mermaid
graph TB
  subgraph "Frontend (Next.js)"
    A[Landing Page]
    B[Dashboard]
    C[Submit Plastic]
    D[Plastic Scan Page]
    E[Marketplace]
    F[Analytics]
  end

  subgraph "Backend Services"
    G[User Management API]
    H[Plastic Submission API]
    I[Token Reward API]
    J[AI Service API]
    L[Material Tracker API]
  end

  subgraph "Blockchain (Celo)"
    M[RePlas Token Contract]
    N[Traceability Contract]
    O[Impact NFT Contract]
    P[Escrow Contract]
  end

  subgraph "AI Pipeline & Scalability"
    X[Message Queue (RabbitMQ/Kafka)]
    Y[AI Worker Service]
    Z[Cache (Redis)]
  end

  subgraph "External Services"
    Q[MongoDB Atlas]
    R[AWS S3]
    S[Gemini AI]
    T[IPFS]
  end

  A --> G
  B --> H
  C --> H
  D --> J
  E --> L
  F --> J

  G --> Q
  H --> R
  I --> M
  J --> X
  X --> Y
  Y --> S
  Y --> Z
  Z --> J
  L --> O

  M --> P
  N --> T
```

### ⚙️ Scalability & AI Integration Patterns

To ensure high availability and performance as AI features grow in complexity and usage, consider the following integration and scaling strategies:

- **Direct Synchronous Calls**: For low-volume or prototyping stages, the frontend can call the AI Service API (`/api/analyze-plastic` or `/api/chat`) directly, reducing system complexity but limiting throughput.
- **Asynchronous Processing**: Offload heavy AI workloads to a message queue (RabbitMQ/Kafka) and background AI worker service to decouple request handling from processing time, improving responsiveness and failure isolation.
- **Dedicated AI Microservice**: Isolate the AI logic into its own microservice or serverless function, allowing independent scaling (CPU/GPU allocation), separate deployment pipelines, and tighter resource management.
- **Caching Layer**: Use Redis to cache frequent image analysis results or AI responses, reducing redundant calls to Gemini AI and lowering latency.
- **Horizontal Scaling & Load Balancing**: Deploy multiple instances of the AI Service and worker services behind a load balancer (e.g., Vercel functions, AWS ALB), enabling auto-scaling based on load and traffic patterns.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/your-username/replas-platform.git
cd replas-platform

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Installation

### Frontend Setup

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install additional packages for development
npm install -D @types/node @types/react @types/react-dom

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Install additional packages
npm install -D nodemon @types/express @types/node

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contract Setup

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Initialize Hardhat project
npx hardhat init

# Compile contracts
npx hardhat compile

# Deploy to Alfajores testnet
npx hardhat run scripts/deploy.js --network alfajores

# Verify contracts
npx hardhat verify --network alfajores DEPLOYED_CONTRACT_ADDRESS
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/replas

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30d

# Celo Blockchain
CELO_PROVIDER_URL=https://alfajores-forno.celo-testnet.org
ADMIN_PRIVATE_KEY=your-private-key-here
NEXT_PUBLIC_CELO_NETWORK=alfajores

# Smart Contract Addresses
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_TRACEABILITY_CONTRACT_ADDRESS=0x0987654321098765432109876543210987654321
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x5678901234567890123456789012345678901234
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x4321098765432109876543210987654321098765

# Storage (AWS S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
S3_BUCKET_NAME=replas-images

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# External APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Getting Environment Variables

| Variable | How to Obtain |
|----------|---------------|
| `MONGODB_URI` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Create free cluster |
| `CELO_PROVIDER_URL` | Use `https://alfajores-forno.celo-testnet.org` for testnet |
| `ADMIN_PRIVATE_KEY` | Export from [Celo Extension Wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh) |
| `GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `AWS_*` | [AWS Console](https://aws.amazon.com/) - Create IAM user with S3 access |

## 📜 Smart Contract Deployment

### 1. Setup Hardhat Configuration

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
      chainId: 42220,
    },
  },
};
```

### 2. Deploy Contracts

```bash
# Deploy to Alfajores testnet
npx hardhat run scripts/deploy.js --network alfajores

# Deploy to Celo mainnet
npx hardhat run scripts/deploy.js --network celo
```

### 3. Verify Deployment

```bash
# Verify on Celoscan
npx hardhat verify --network alfajores DEPLOYED_CONTRACT_ADDRESS

# Check deployment
npx hardhat run scripts/verify-deployment.js --network alfajores
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/users/register
POST /api/users/login
POST /api/users/refresh
GET  /api/users/profile
PUT  /api/users/profile
```

### Plastic Submission Endpoints

```http
POST /api/submissions          # Submit plastic for recycling
GET  /api/submissions          # Get user submissions
GET  /api/submissions/:id      # Get specific submission
PUT  /api/submissions/:id      # Update submission
POST /api/submissions/:id/verify # Verify submission
```

### Token & Rewards Endpoints

```http
GET  /api/rewards/balance      # Get token balance
GET  /api/rewards/transactions # Get transaction history
POST /api/rewards/distribute   # Distribute rewards (admin)
POST /api/rewards/redeem       # Redeem tokens
```

### QR Code Endpoints

```http
POST /api/qr/generate          # Generate QR code
GET  /api/qr/resolve/:code     # Resolve QR code
POST /api/qr/batch-generate    # Generate multiple QR codes
```

### AI Service Endpoints

```http
POST /api/ai/chat              # Chat with AI assistant
POST /api/ai/analyze-image     # Analyze plastic image
POST /api/ai/impact-summary    # Generate impact summary
```

### Example API Usage

```javascript
// Submit plastic for recycling
const response = await fetch('/api/submissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer \${token}`
  },
  body: JSON.stringify({
    plasticType: 'PET',
    weight: 0.5,
    location: 'Lagos, Nigeria',
    image: 'base64-encoded-image',
    qrCode: 'BATCH-1234'
  })
});

const submission = await response.json();
```

## 🎨 Frontend Components

### Key Components

- **`WalletProvider`**: Celo wallet connection management
- **`QrScanner`**: Camera-based QR code scanning
- **`PlasticSubmissionForm`**: Multi-step submission form
- **`TokenBalance`**: Real-time token balance display
- **`ImpactMetrics`**: Environmental impact visualization
- **`3DVisualizations`**: Three.js-powered 3D components

### Component Usage

```tsx
import { QrScanner } from '@/components/qr-scanner/qr-scanner'
import { TokenBalance } from '@/components/token-balance'

function MyComponent() {
  const handleQrScan = (data: string) => {
    console.log('QR Code scanned:', data)
  }

  return (
    <div>
      <TokenBalance />
      <QrScanner onScanSuccess={handleQrScan} />
    </div>
  )
}
```

## 💡 Usage Examples

### For Consumers

1. **Connect Wallet**: Link your Celo wallet to start earning
2. **Submit Plastic**: Take photos and submit plastic waste
3. **Earn Tokens**: Receive RePlas tokens for verified submissions
4. **Track Impact**: Monitor your environmental contribution
5. **Redeem Rewards**: Exchange tokens for eco-friendly products

### For Producers

1. **Generate QR Codes**: Create trackable codes for products
2. **Monitor Lifecycle**: Track products from creation to recycling
3. **Verify Completion**: Confirm recycling of your products
4. **Access Analytics**: View sustainability metrics

### For Recyclers

1. **Verify Submissions**: Confirm plastic waste submissions
2. **Process Materials**: Handle recycling operations
3. **Earn Fees**: Receive tokens for processing services
4. **Manage Operations**: Track recycling center performance

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our coding standards
4. **Add tests**: Ensure your code is well-tested
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes

### Coding Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the configured linting rules
- **Prettier**: Format code consistently
- **Testing**: Write unit tests for new features
- **Documentation**: Update docs for API changes

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new QR code generation feature
fix: resolve wallet connection issue
docs: update API documentation
style: format code with prettier
refactor: improve token reward logic
test: add unit tests for AI service
chore: update dependencies
```

## 🐛 Troubleshooting

### Common Issues

#### White/Blank Images
```bash
# Run the image fixer script
npx ts-node scripts/fix-images.ts

# Check image paths in debug mode
npm run dev
# Visit http://localhost:3000/debug
```

#### Wallet Connection Issues
```javascript
// Check if Celo Extension Wallet is installed
if (typeof window.celo === 'undefined') {
  console.log('Please install Celo Extension Wallet')
}

// Verify network configuration
const networkId = await window.celo.request({ method: 'net_version' })
console.log('Network ID:', networkId) // Should be 44787 for Alfajores
```

#### Smart Contract Deployment Failures
```bash
# Check account balance
npx hardhat run scripts/check-balance.js --network alfajores

# Get testnet tokens
# Visit https://celo.org/developers/faucet

# Verify contract addresses
npx hardhat run scripts/verify-contracts.js --network alfajores
```

#### Database Connection Issues
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
"
```

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/replas-platform/issues)
- **Discord**: [Join our community](https://discord.gg/replas)
- **Documentation**: [Read the full docs](https://docs.replas.org)
- **Email**: support@replas.org

## 📊 Performance & Monitoring

### Metrics Tracked

- **User Engagement**: Daily/monthly active users
- **Plastic Submissions**: Volume and verification rates
- **Token Distribution**: Rewards distributed and redeemed
- **Environmental Impact**: CO₂ offset and waste diverted
- **Smart Contract Usage**: Transaction volume and gas costs

### Monitoring Tools

- **Frontend**: Vercel Analytics + Sentry
- **Backend**: New Relic + CloudWatch
- **Blockchain**: Celo Explorer + Custom dashboards
- **Database**: MongoDB Atlas monitoring

## 🔒 Security

### Security Measures

- **Smart Contract Audits**: Regular security audits
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: API rate limiting and DDoS protection
- **Encryption**: Data encryption at rest and in transit
- **Access Control**: Role-based permissions

### Reporting Security Issues

Please report security vulnerabilities to security@replas.org. Do not open public issues for security concerns.

## 📈 Roadmap

### Phase 1 (Current) - MVP Launch
- ✅ Basic plastic submission and verification
- ✅ Token rewards system
- ✅ QR code tracking
- ✅ AI-powered verification

### Phase 2 - Enhanced Features
- 🔄 Mobile app development
- 🔄 Advanced analytics dashboard
- 🔄 Multi-language support
- 🔄 Integration with more recycling centers

### Phase 3 - Scale & Expansion
- 📅 Cross-chain compatibility
- 📅 Carbon credit marketplace
- 📅 Corporate partnerships
- 📅 Government integrations

### Phase 4 - Global Impact
- 📅 International expansion
- 📅 Policy advocacy tools
- 📅 Research partnerships
- 📅 Educational programs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Celo Foundation**: For blockchain infrastructure and grants
- **Google**: For Gemini AI API access
- **MongoDB**: For database hosting credits
- **Vercel**: For frontend hosting and deployment
- **Open Source Community**: For amazing tools and libraries

## 📞 Contact


---

<div align="center">

**Made with 💚 for a sustainable future**

[⭐ Star this repo](https://github.com/your-username/replas-platform) • [🐛 Report Bug](https://github.com/your-username/replas-platform/issues) • [💡 Request Feature](https://github.com/your-username/replas-platform/issues)

</div>
```

This comprehensive README.md provides:

1. **Clear project overview** with mission and problem statement
2. **Detailed feature list** for different user roles
3. **Complete technology stack** information
4. **Step-by-step installation** instructions
5. **Environment variable** setup guide
6. **Smart contract deployment** procedures
7. **API documentation** with examples
8. **Component usage** guidelines
9. **Contributing guidelines** with coding standards
10. **Troubleshooting section** for common issues
11. **Security and monitoring** information
12. **Roadmap and future plans**
13. **Professional formatting** with badges and diagrams

The README is structured to help developers quickly understand the project, get it running locally, and contribute effectively to the codebase.
