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

### Phase 1: Smart Contract Development (The Foundation) ✅
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

### Phase 2: Frontend Dashboard (The Interface) ✅
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
    - [x] **Guild 入口按钮**: Dashboard 添加 "加入 Guild" 按钮，链接到 https://guild.xyz/jcdao

### Phase 3: Identity & Access Control (Guild.xyz) ✅
**Goal**: Link on-chain assets (SBT) to off-chain community (Discord).

- [x] **Discord Server Setup**
    - Create a new Discord Server for JCDAO.
    - Create roles: `Visitor`, `Member` (SBT Holder), `Core` (Multisig Signer).
    - Create channels: `#public-chat`, `#member-only` (Private), `#governance` (Private).

- [x] **Guild.xyz Configuration**
    - [x] 生成配置文件 `config/guild-config.json`（合约地址、Discord 身份组建议）
    - [x] Guild 创建成功
    - [x] 配置 NFT/Token 验证规则（JCDMembership SBT 验证）
    - [x] Test the "Join Guild" flow on the frontend Dashboard ✅

### Phase 4: Governance Setup (Snapshot) 🔄
**Goal**: Enable gas-less voting for token holders.

- [ ] **ENS Setup (Testnet/Mainnet)**
    - *Note*: Snapshot requires an ENS domain (e.g., `jcdao.eth`) to create a Space.
    - For Mainnet production: Buy an ENS domain.

- [/] **Snapshot Space Creation**
    - [x] 生成策略配置文件 `config/snapshot-strategy.json`（erc20-balance-of 策略）
    - [ ] Create a space on snapshot.org
    - [ ] 在 Snapshot Playground 测试策略

- [/] **Frontend Integration**
    - [x] 添加 `SNAPSHOT_SPACE_URL` 和 `GUILD_URL` 常量到 `constants.ts`
    - [ ] Add a "Vote" button in the Dashboard（待 Snapshot Space 创建后添加）

### Phase 5: Asset Safety (Safe Multisig) ⚠️
**Goal**: Secure the treasury.

> ⚠️ **限制**: Safe 目前不支持 Polygon Amoy 测试网。
> 支持的测试网: Sepolia, Base Sepolia, Gnosis Chiado, Monad Testnet
> **建议**: 在 Polygon Mainnet 部署时再配置 Safe 多签。

- [ ] **Create Safe Wallet** (待 Polygon Mainnet 部署)
    - Go to https://app.safe.global/ (Select Polygon network).
    - Create a new Safe.
    - **Signers**: Add your wallet + 1-2 other team wallets.
    - **Threshold**: Set to 2/3 (requires 2 signatures to execute tx).

- [/] **Transfer Ownership**
    - [x] 编写 `scripts/transfer-ownership.ts` 脚本
    - [x] 编写 `test/TransferOwnership.test.ts` 测试（47 passing）
    - [ ] 配置 Safe 地址和合约地址后运行脚本（待 Mainnet 部署）
    - *Why*: So only the DAO (via multisig) can mint/change rules, not one person.

### Phase 6: Operational Documentation ✅
- [x] Write `docs/discord-architecture.md`: Discord 服务器架构与机器人配置
- [x] Write `docs/user-manual.md`: 如何加入 JCDAO (中英日三语)
- [x] 生成 `config/TESTING.md`: Phase 3/4 测试验证指南
- [ ] Write `docs/governance.md`: How to propose a vote?

---

## 4. 已部署合约地址 (Polygon Amoy)

| 合约 | 地址 | 验证 |
|------|------|------|
| JCDMembership (SBT) | `0x224DF0e3a4A5848189c623501f9feCB3D1279126` | [PolygonScan](https://amoy.polygonscan.com/address/0x224DF0e3a4A5848189c623501f9feCB3D1279126) |
| JCDToken ($JCD) | `0x0A660E03302F3f9313Fb460C24Fe89cDF57B3582` | [PolygonScan](https://amoy.polygonscan.com/address/0x0A660E03302F3f9313Fb460C24Fe89cDF57B3582) |

---

## 5. 项目文件结构

```
JCDAO/
├── contracts/           # Solidity 智能合约
│   ├── JCDMembership.sol
│   └── JCDToken.sol
├── scripts/             # 部署和管理脚本
│   ├── deploy.ts
│   ├── extract-abi.js
│   └── transfer-ownership.ts
├── test/                # 智能合约测试
│   ├── JCDMembership.test.ts
│   ├── JCDToken.test.ts
│   └── TransferOwnership.test.ts
├── config/              # Phase 3/4 配置文件
│   ├── guild-config.json
│   ├── snapshot-strategy.json
│   └── TESTING.md
├── docs/                # 操作文档
│   ├── discord-architecture.md
│   └── user-manual.md
└── frontend/            # Next.js 前端
    └── src/
        ├── components/Dashboard.tsx
        └── lib/constants.ts
```

---

## 6. 下一步行动

| 优先级 | 任务 | 状态 |
|--------|------|------|
| ~~P0~~ | ~~部署合约到 Polygon Amoy~~ | ✅ 已完成 |
| ~~P1~~ | ~~配置 Guild.xyz NFT/Token 验证~~ | ✅ 已完成 |
| P1 | 测试 Snapshot 策略 | 待完成 |
| P2 | 添加 Snapshot 投票按钮 | 待 Space 创建 |
| P3 | 部署到 Polygon Mainnet + 配置 Safe | 待测试通过 |