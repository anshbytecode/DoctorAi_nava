# Web3 Integration Guide

## Overview

DoctorAI now includes Web3 features for decentralized storage and blockchain integration.

## Features

### 1. Wallet Connection
- Connect MetaMask or other Web3 wallets
- View connected wallet address
- Sign messages for authentication

### 2. IPFS Storage (Decentralized)
- Upload images to IPFS (InterPlanetary File System)
- Decentralized, permanent storage
- Images stored on blockchain networks

### 3. Web3 Badges & Achievements
- Unlock achievements for health milestones
- Store achievements on blockchain
- Showcase your health journey

## Setup

### 1. Install MetaMask

1. Visit [MetaMask.io](https://metamask.io/)
2. Install the browser extension
3. Create or import a wallet
4. Switch to a test network (Sepolia, Mumbai, etc.) for testing

### 2. Configure IPFS (Optional)

For production IPFS storage, you can use:

**Option A: Pinata (Recommended)**
1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Get your API keys
3. Add to `.env`:
```
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key
```

**Option B: NFT.Storage**
1. Sign up at [NFT.Storage](https://nft.storage)
2. Get your API token
3. Add to `.env`:
```
VITE_NFT_STORAGE_TOKEN=your_token
```

**Option C: Web3.Storage**
1. Sign up at [Web3.Storage](https://web3.storage)
2. Get your API token
3. Add to `.env`:
```
VITE_WEB3_STORAGE_TOKEN=your_token
```

### 3. Test Network Setup

For testing, use test networks:
- **Sepolia** (Ethereum testnet)
- **Mumbai** (Polygon testnet)
- **BSC Testnet** (Binance Smart Chain)

## Usage

### Connecting Wallet

1. Click "Connect Web3" in the header or profile
2. Select your wallet (MetaMask)
3. Approve the connection
4. Your wallet address will be displayed

### Uploading Images with Web3

1. Connect your wallet first
2. Go to Profile or Health Records
3. Click "Upload Image"
4. Select an image
5. If Web3 is connected, image will be uploaded to IPFS
6. Otherwise, it will be stored locally

### Viewing Web3 Badges

1. Go to Dashboard
2. Scroll to "Web3 Achievements" section
3. View unlocked badges
4. Complete requirements to unlock more

## Benefits of Web3 Integration

1. **Decentralized Storage**: Images stored on IPFS, not centralized servers
2. **Permanent Records**: Health data can be stored on blockchain
3. **Ownership**: You own your data
4. **Interoperability**: Access from any Web3-enabled app
5. **Privacy**: Encrypted, decentralized storage

## Security Notes

- Never share your wallet private keys
- Use test networks for development
- Verify all transactions before signing
- Keep your MetaMask seed phrase secure

## Troubleshooting

### Wallet Not Connecting
- Make sure MetaMask is installed
- Check if MetaMask is unlocked
- Refresh the page and try again

### IPFS Upload Failing
- Check your API keys in `.env`
- Verify network connection
- Falls back to local storage automatically

### Transaction Errors
- Ensure you have test ETH/tokens
- Check network compatibility
- Verify gas fees are sufficient

## Future Enhancements

- NFT health certificates
- Blockchain-based health records
- Decentralized identity (DID)
- Smart contract integrations
- Token rewards for health milestones

