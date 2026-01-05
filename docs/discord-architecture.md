# JCDAO Discord 服务器架构设计 / Server Architecture / サーバー構成

> 本文档为 JCDAO 社区提供完整的 Discord 服务器频道结构与机器人配置建议。

---

## 📌 概述 / Overview / 概要

| 语言 | 说明 |
|------|------|
| 🇨🇳 中文 | JCDAO 作为日本华人开发者 DAO，需要一个安全、高效、分层清晰的 Discord 社区 |
| 🇺🇸 English | JCDAO needs a secure, efficient, and well-structured Discord community for Chinese developers in Japan |
| 🇯🇵 日本語 | JCDAOは日本の中国人開発者DAOとして、安全で効率的、かつ明確な階層構造のDiscordコミュニティが必要です |

---

## 🏗️ 频道结构 / Channel Structure / チャンネル構成

### 1️⃣ 公共区域 / Public Zone / パブリックゾーン
> 对所有人开放，无需验证

| 频道名 | 用途 (CN) | Purpose (EN) | 目的 (JP) |
|--------|----------|--------------|-----------|
| `#👋-welcome` | 欢迎新成员，机器人自动发送引导消息 | Welcome new members with automated guidance | 新メンバーへの歓迎と自動ガイダンス |
| `#📜-rules` | 社区规则与行为准则（只读） | Community rules and code of conduct (read-only) | コミュニティルールと行動規範（読み取り専用） |
| `#🔗-verify` | Guild.xyz 身份验证入口 | Guild.xyz identity verification portal | Guild.xyzでの本人確認ポータル |
| `#📢-announcements` | 官方公告（只读） | Official announcements (read-only) | 公式アナウンス（読み取り専用） |
| `#💬-general-chat` | 公开闲聊，任何人可参与 | Public chat open to everyone | 誰でも参加できるオープンチャット |
| `#❓-help` | 新手帮助与常见问题 | Newcomer help and FAQ | 初心者ヘルプとFAQ |

---

### 2️⃣ 会员专属区 / Member-Only Zone / メンバー専用ゾーン
> 要求：持有 JCDMembership SBT

| 频道名 | 用途 (CN) | Purpose (EN) | 目的 (JP) |
|--------|----------|--------------|-----------|
| `#🏠-member-lounge` | 核心会员交流区 | Core member discussion area | コアメンバーの交流エリア |
| `#💡-ideas` | 项目创意与提案讨论 | Project ideas and proposal discussions | プロジェクトアイデアと提案の議論 |
| `#🤝-collaborations` | 寻找合作伙伴与协作机会 | Find partners and collaboration opportunities | パートナーシップとコラボレーション |
| `#📷-showcase` | 展示个人作品与成就 | Showcase personal work and achievements | 個人作品と成果のショーケース |
| `#🎙️-member-voice` | 会员语音频道 | Member voice channel | メンバーボイスチャンネル |

---

### 3️⃣ 治理区域 / Governance Zone / ガバナンスゾーン
> 要求：持有 $JCD Token (≥100 JCD)

| 频道名 | 用途 (CN) | Purpose (EN) | 目的 (JP) |
|--------|----------|--------------|-----------|
| `#📊-governance-discussion` | Snapshot 提案讨论 | Snapshot proposal discussions | Snapshot提案の議論 |
| `#🗳️-voting-alerts` | Snapshot 投票通知（机器人自动推送） | Snapshot voting alerts (bot automated) | Snapshot投票アラート（Bot自動通知） |
| `#📋-proposals` | 提案草稿与反馈 | Proposal drafts and feedback | 提案草案とフィードバック |
| `#💰-treasury` | 财务报告与 Safe 多签更新 | Treasury reports and Safe multisig updates | 財務報告とSafeマルチシグ更新 |

---

### 4️⃣ 开发者区域 / Developer Zone / デベロッパーゾーン
> 要求：持有 SBT + 开发者角色

| 频道名 | 用途 (CN) | Purpose (EN) | 目的 (JP) |
|--------|----------|--------------|-----------|
| `#💻-dev-general` | 技术讨论通用频道 | General technical discussions | 技術的な議論の一般チャンネル |
| `#🔧-smart-contracts` | 智能合约开发讨论 | Smart contract development | スマートコントラクト開発 |
| `#🌐-frontend` | 前端开发与 UX 设计 | Frontend development and UX | フロントエンド開発とUX |
| `#🐛-bug-reports` | Bug 追踪与修复进度 | Bug tracking and fix progress | バグトラッキングと修正進捗 |
| `#📦-deployments` | 部署日志与版本发布 | Deployment logs and release notes | デプロイログとリリースノート |
| `#🔒-security` | 安全审计与漏洞报告（敏感） | Security audits and vulnerability reports (sensitive) | セキュリティ監査と脆弱性報告（機密） |

---

## 🤖 推荐机器人 / Recommended Bots / 推奨Bot

### 1. Guild.xyz Bot ⭐ 核心必备

| 项目 | 详情 |
|------|------|
| **功能** | 🔗 连接链上资产与 Discord 角色 |
| **Functionality** | Links on-chain assets to Discord roles |
| **機能** | オンチェーン資産とDiscordロールを連携 |

#### 权限设置 / Permission Settings / 権限設定

```
✅ 需要的权限:
  - Manage Roles (管理身份组)
  - Read Messages (读取消息)
  - Send Messages (发送消息)
  - Use Application Commands (使用应用命令)

⛔ 禁止的权限:
  - Administrator (管理员权限 - 绝对禁止!)
  - Manage Server (管理服务器)
  - Kick/Ban Members (踢人/封禁)
```

#### 安全建议 / Security Tips / セキュリティのヒント
| 🇨🇳 中文 | 🇺🇸 English | 🇯🇵 日本語 |
|---------|-------------|-----------|
| 仅给予 Guild 管理**低于**管理员的角色权限 | Only grant Guild roles **below** admin level | Guildには管理者**以下**のロール権限のみを付与 |
| 在角色层级中，将 Guild Bot 放在普通成员之上，但在 Moderator 之下 | In role hierarchy, place Guild Bot above regular members but below Moderator | ロール階層で、Guild Botを一般メンバーの上、モデレーターの下に配置 |

---

### 2. Wick Bot 🛡️ 安全防护

| 项目 | 详情 |
|------|------|
| **功能** | 🛡️ 防 Raid、反垃圾信息、防机器人炸群 |
| **Functionality** | Anti-raid, anti-spam, bot attack protection |
| **機能** | レイド対策、スパム対策、Bot攻撃防御 |

#### 权限设置 / Permission Settings / 権限設定

```
✅ 需要的权限:
  - Kick Members (踢出成员)
  - Ban Members (封禁成员)
  - Manage Messages (管理消息 - 删除垃圾信息)
  - Manage Roles (管理身份组 - 隔离可疑用户)
  - View Audit Log (查看审计日志)

⚠️ 配置建议:
  - 开启验证墙 (Verification Wall)
  - 设置账号年龄限制 (Account Age Filter): ≥7 天
  - 启用反批量加入 (Anti Mass Join): 10人/分钟触发
  - 禁止新账号发送链接
```

#### 推荐配置 / Recommended Config / 推奨設定

| 设置项 | 推荐值 | 原因 |
|--------|--------|------|
| Account Age | ≥ 7 days | 阻止新注册的机器人账号 |
| Mass Join | 10/min | 防止批量机器人加入 |
| Anti-Spam | Level 3 | 中等敏感度，平衡用户体验 |
| Anti-Link | New Members Only | 新成员禁止发链接 |

---

### 3. Carl-bot 🔧 多功能管理

| 项目 | 详情 |
|------|------|
| **功能** | 📝 自定义欢迎消息、反应角色、日志记录 |
| **Functionality** | Custom welcome messages, reaction roles, logging |
| **機能** | カスタム歓迎メッセージ、リアクションロール、ログ記録 |

#### 权限设置 / Permission Settings / 権限設定

```
✅ 需要的权限:
  - Manage Roles (管理身份组)
  - Manage Messages (管理消息)
  - Add Reactions (添加反应)
  - Read Message History (读取消息历史)
  - Embed Links (嵌入链接)

⚠️ 安全提示:
  - 仅在需要的频道启用 Carl-bot
  - 不要授予全服务器管理员权限
```

#### 使用场景 / Use Cases / 使用シーン

| 功能 | 配置示例 |
|------|----------|
| 欢迎消息 | 新成员加入时发送 DM 教程链接 |
| 反应角色 | 通过点击 Emoji 自选语言偏好 |
| 日志频道 | 所有成员进出记录到 `#mod-logs` |

---

### 4. Collab.Land Bot 🔐 备选验证

| 项目 | 详情 |
|------|------|
| **功能** | 🔐 Token-Gated 社区验证 (Guild.xyz 备选方案) |
| **Functionality** | Token-gated community verification (Guild.xyz alternative) |
| **機能** | トークンゲート認証（Guild.xyzの代替案） |

#### 权限设置 / Permission Settings / 権限設定

```
✅ 需要的权限:
  - Manage Roles (管理身份组)
  - Send Messages (发送消息)
  - Read Messages (读取消息)

⛔ 严格禁止:
  - 不要给予 Kick/Ban 权限
  - 不要给予 Administrator 权限
```

#### 何时使用 / When to Use / 使用タイミング
| 场景 | 推荐 |
|------|------|
| 主验证系统 | Guild.xyz |
| 备份/额外验证 | Collab.Land |
| 多链验证需求 | 两者并用 |

---

## ⚠️ 安全最佳实践 / Security Best Practices / セキュリティベストプラクティス

### 防止机器人炸群 / Preventing Bot Raids / Bot攻撃の防止

```
🔒 关键设置:

1. 角色层级 (Role Hierarchy):
   ┌─────────────────────────┐
   │ 🔴 Owner               │ ← 最高权限
   ├─────────────────────────┤
   │ 🟠 Admin               │
   ├─────────────────────────┤
   │ 🟡 Moderator           │
   ├─────────────────────────┤
   │ 🟢 Wick Bot            │ ← 安全机器人需要高权限
   ├─────────────────────────┤
   │ 🔵 Guild Bot           │ ← 验证机器人
   ├─────────────────────────┤
   │ 🟣 Carl-bot            │ ← 工具机器人
   ├─────────────────────────┤
   │ ⚪ Member Roles        │
   ├─────────────────────────┤
   │ ⬜ @everyone           │ ← 最低权限
   └─────────────────────────┘

2. 两步验证 (2FA for Moderation):
   - 强制所有 Moderator+ 开启 2FA
   - 服务器设置 → 审核级别 → 最高

3. 频道权限锁定:
   - `#announcements` → 仅管理员可发言
   - `#rules` → 只读
   - 新成员默认无法发图片/链接
```

### 机器人邀请安全 / Bot Invitation Security / Bot招待のセキュリティ

| ✅ 安全做法 | ⛔ 危险做法 |
|------------|-----------|
| 只从官方网站邀请机器人 | 从不明链接邀请机器人 |
| 仔细审查请求的权限 | 盲目授予管理员权限 |
| 定期审计机器人权限 | 从不检查机器人设置 |
| 使用只读 Webhook 发公告 | 让机器人有删频道权限 |

---

## 🔄 维护检查清单 / Maintenance Checklist / メンテナンスチェックリスト

### 每周任务 / Weekly Tasks / 週次タスク
- [ ] 检查 Wick Bot 拦截日志
- [ ] 审核新成员验证情况
- [ ] 确认 Guild.xyz 角色同步正常

### 每月任务 / Monthly Tasks / 月次タスク
- [ ] 审计所有机器人权限
- [ ] 更新社区规则（如需要）
- [ ] 检查备份管理员账号安全
- [ ] 审查 Moderator 团队权限

---

## 📚 相关资源 / Resources / 参考リソース

| 资源 | 链接 |
|------|------|
| Guild.xyz 文档 | https://docs.guild.xyz |
| Wick Bot 文档 | https://docs.wickbot.com |
| Carl-bot 文档 | https://docs.carl.gg |
| Discord 安全最佳实践 | https://discord.com/safety |
| Collab.Land 文档 | https://docs.collab.land |

---

> 💡 **提示 / Tip / ヒント**: 在正式开放服务器前，建议使用小号进行完整的验证流程测试，确保所有权限配置正确！
