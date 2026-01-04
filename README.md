# JCDAO (Japan-Chinese Developer DAO)

Smart contracts and frontend for the JCDAO community.

## Project Structure

- `contracts/`: Solidity smart contracts (JCDToken, JCDMembership).
- `scripts/`: Deployment and utility scripts.
- `test/`: Hardhat tests.
- `frontend/`: Next.js web application.

## Prerequisites

- Node.js v18+
- npm or yarn
- A wallet with Polygon Amoy testnet tokens (POL).

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    cd frontend && npm install
    ```

2.  **Environment Configuration**
    - Copy `.env.example` to `.env` in the root directory and fill in your `PRIVATE_KEY` and `POLYGON_AMOY_RPC_URL`.
    - Copy `frontend/.env.example` to `frontend/.env.local` (if not already created).

## Smart Contracts

### Compile
```bash
npx hardhat compile
```

### Test
```bash
npx hardhat test
```

### Deploy (Polygon Amoy)
```bash
npm run deploy:amoy
```
This command will:
1. Deploy contracts to Amoy.
2. Verify contracts on PolygonScan (if API key provided).
3. Print the deployed addresses.

## Frontend

### Update Contract Integration
After deployment, run the ABI extraction script to update the frontend with the new ABIs:
```bash
node scripts/extract-abi.js
```
Then update `frontend/.env.local` with the new contract addresses.

### Run Locally
```bash
cd frontend
npm run dev
```

## Deployment (Vercel)

The frontend is ready for deployment on Vercel.
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set the `Root Directory` to `frontend`.
4. Add the Environment Variables from `frontend/.env.local` to Vercel Project Settings.
