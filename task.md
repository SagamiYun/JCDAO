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

- [x] **Setup Hardhat Environment**
    - Initialize Hardhat project with TypeScript.
    - Install `@openzeppelin/contracts`.
    - Configure `hardhat.config.ts` for Polygon Amoy.

- [x] **Develop `JCDMembership.sol` (SBT)**
    - [x] Inherit from ERC-721.
    - [x] Override `transferFrom`, `safeTransferFrom` to revert (make it non-transferable/Soulbound).
    - [x] Implement `safeMint(address to)` function (onlyOwner).
    - [x] Set up Base URI for metadata.

- [x] **Develop `JCDToken.sol` (Governance Token)**
    - [x] Inherit from ERC-20 and ERC20Permit.
    - [x] Inherit from `ERC20Votes` (Essential for Snapshot strategy).
    - [x] Implement fixed supply (1,000,000 tokens).

- [x] **Deployment Scripts**
    - [x] Write `deploy.ts` to deploy both contracts.
    - [x] Verify contracts on PolygonScan.
    - [x] Extract ABIs to frontend.

### Phase 2: Frontend Dashboard (The Interface)
Focus: A landing page for users to connect wallets and view their status.

- [x] **Scaffold Next.js App**
    - `npx create-next-app@latest` with TypeScript, Tailwind, ESLint.
    - Install `shadcn/ui` for basic components (Button, Card, Dialog).

- [x] **Web3 Providers Setup**
    - Configure `RainbowKit` and `WagmiConfig` in the root layout.
    - Set up the Polygon chain configuration.

- [x] **Feature: Landing Page**
    - Hero section explaining the DAO vision.
    - "Connect Wallet" button.

- [x] **Feature: Member Dashboard**
    - [x] **Token Gating Check**: Check if connected wallet holds `JCDMembership` SBT.
    - [x] **Display**: Show User's $JCD Balance and membership status.
    - [x] **Route Protection**: Auto-redirect members to `/dashboard`.

### Phase 3: Identity & Access Control (Guild.xyz)
**Goal**: Link on-chain assets (SBT) to off-chain community (Discord).

- [ ] **Discord Server Setup**
    - Create a new Discord Server for JCDAO.
    - Create roles: `Visitor`, `Member` (SBT Holder), `Core` (Multisig Signer).
    - Create channels: `#public-chat`, `#member-only` (Private), `#governance` (Private).

- [/] **Guild.xyz Configuration**
    - [x] 生成配置文件 `config/guild-config.json`（合约地址、Discord 身份组建议）
    - [ ] Connect Wallet (Owner) to Guild.xyz.
    - [ ] Create a "Guild" and link the Discord Server.
    - [ ] **Define Role Requirement (Member)**:
        - Condition: "Hold at least 1 NFT" from contract `[Your_Deployed_SBT_Address]`.
        - Chain: Polygon Amoy.
    - [ ] **Define Role Requirement (Whale/Contributor)**:
        - Condition: "Hold at least 100 $JCD" from contract `[Your_Deployed_Token_Address]`.
    - [ ] Test the "Join Guild" flow on the frontend Dashboard.

### Phase 4: Governance Setup (Snapshot)
**Goal**: Enable gas-less voting for token holders.

- [ ] **ENS Setup (Testnet/Mainnet)**
    - *Note*: Snapshot requires an ENS domain (e.g., `jcdao.eth`) to create a Space. On testnet, use `demo.eth` subdomains or just mock it if testing locally.
    - For Mainnet production: Buy an ENS domain.

- [/] **Snapshot Space Creation**
    - [x] 生成策略配置文件 `config/snapshot-strategy.json`（erc20-balance-of 策略）
    - [ ] Create a space on snapshot.org.
    - [ ] **Strategy**: Select `erc20-balance-of` (or `erc20-votes` if using checkpoints).
    - [ ] Network: Polygon Amoy (80002).
    - [ ] Address: `[Your_Deployed_Token_Address]`.
    - [ ] Symbol: JCD.

- [/] **Frontend Integration**
    - [x] 添加 `SNAPSHOT_SPACE_URL` 和 `GUILD_URL` 常量到 `constants.ts`
    - [ ] Add a "Vote" button in the Dashboard linking to the Snapshot Space URL.

### Phase 5: Asset Safety (Safe Multisig)
**Goal**: Secure the treasury.

- [ ] **Create Safe Wallet**
    - Go to https://app.safe.global/ (Select Polygon Amoy network).
    - Create a new Safe.
    - **Signers**: Add your wallet + 1-2 other test wallets you control (simulate team members).
    - **Threshold**: Set to 2/3 (requires 2 signatures to execute tx).

- [ ] **Transfer Ownership (Optional but Recommended)**
    - Transfer ownership of the Smart Contracts (SBT/Token) to the Safe Address.
    - *Why*: So only the DAO (via multisig) can mint/change rules, not one person.

### Phase 6: Operational Documentation
- [ ] Write `docs/onboarding.md`: How to get SBT?
- [ ] Write `docs/governance.md`: How to propose a vote?