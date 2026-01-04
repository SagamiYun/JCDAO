# Project: JCDAO (Japan-Chinese Developer DAO) Implementation Plan

## 1. Project Context
**Goal**: Build the technical infrastructure for a Web3 DAO serving Chinese developers in Japan.
**Core Mechanics**:
- **Membership**: Non-transferable Soulbound Tokens (SBT) as proof of membership.
- **Governance**: ERC-20 tokens ($JCD) for voting power.
- **Tools**: Snapshot for gas-less voting, Safe for treasury, Guild.xyz for role management.
- **Target Chain**: Polygon Amoy (Testnet) / Polygon POS (Mainnet).

## 2. Tech Stack
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin Contracts.
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Web3 Integration**: RainbowKit, Wagmi, Viem.
- **Environment**: Node.js >= 18.

## 3. Development Roadmap & Tasks

### Phase 1: Smart Contract Development (The Foundation)
Focus: Creating the assets for identity and governance.

- [ ] **Setup Hardhat Environment**
    - Initialize Hardhat project with TypeScript.
    - Install `@openzeppelin/contracts`.
    - Configure `hardhat.config.ts` for Polygon Amoy.

- [ ] **Develop `JCDMembership.sol` (SBT)**
    - [ ] Inherit from ERC-721.
    - [ ] **Crucial**: Override `transferFrom`, `safeTransferFrom` to revert (make it non-transferable/Soulbound).
    - [ ] Implement `mint(address to)` function (onlyOwner or via whitelist logic).
    - [ ] Set up Base URI for metadata.

- [ ] **Develop `JCDToken.sol` (Governance Token)**
    - [ ] Inherit from ERC-20 and ERC20Permit.
    - [ ] Inherit from `ERC20Votes` (Essential for Snapshot strategy).
    - [ ] Implement a fixed supply or mintable logic based on DAO rules.

- [ ] **Deployment Scripts**
    - [ ] Write `deploy.ts` to deploy both contracts.
    - [ ] Verify contracts on PolygonScan.

### Phase 2: Frontend Dashboard (The Interface)
Focus: A landing page for users to connect wallets and view their status.

- [ ] **Scaffold Next.js App**
    - `npx create-next-app@latest` with TypeScript, Tailwind, ESLint.
    - Install `shadcn/ui` for basic components (Button, Card, Dialog).

- [ ] **Web3 Providers Setup**
    - Configure `RainbowKit` and `WagmiConfig` in the root layout.
    - Set up the Polygon chain configuration.

- [ ] **Feature: Landing Page**
    - Hero section explaining the DAO vision.
    - "Connect Wallet" button.

- [ ] **Feature: Member Dashboard**
    - [ ] **Token Gating Check**: Check if connected wallet holds `JCDMembership` SBT.
    - [ ] **Display**: Show User's Member ID (Token ID) and $JCD Balance.
    - [ ] **Action**: Link to Discord (Guild.xyz) and Snapshot.

### Phase 3: Off-chain Configuration (Documentation & Configs)
Focus: Setting up the DAO tooling ecosystem.

- [ ] **Snapshot Configuration Strategy**
    - Define the `strategies` JSON for Snapshot (e.g., using `erc20-balance-of` or `erc20-votes`).
    - Document the Snapshot space setup process in `docs/snapshot-setup.md`.

- [ ] **Guild.xyz Requirements**
    - Define the requirements for Discord roles (e.g., "Must hold JCDMembership NFT").

## 4. Architecture & File Structure