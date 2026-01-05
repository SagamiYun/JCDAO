# Phase 3 & 4 配置文件测试验证指南

本文档提供完整的测试链和验证方法，确保配置文件正确可用。

---

## 1. 配置文件验证

### 1.1 验证 JSON 语法

```bash
# 在项目根目录执行
cd e:\Project\Blockchain\JCDAO

# 验证 JSON 文件格式
node -e "console.log(JSON.parse(require('fs').readFileSync('./config/guild-config.json', 'utf-8')))"
node -e "console.log(JSON.parse(require('fs').readFileSync('./config/snapshot-strategy.json', 'utf-8')))"
```

**预期结果**: 两个命令都应输出解析后的 JSON 对象，无报错。

### 1.2 验证必填字段

```bash
# 检查 Guild 配置的关键字段
node -e "
const config = JSON.parse(require('fs').readFileSync('./config/guild-config.json', 'utf-8'));
console.log('✓ Guild Name:', config.guildName);
console.log('✓ Network ChainId:', config.network.chainId);
console.log('✓ Roles Count:', config.roles.length);
console.log('✓ JCDMembership Address:', config.contracts.JCDMembership.address);
console.log('✓ JCDToken Address:', config.contracts.JCDToken.address);
"

# 检查 Snapshot 配置的关键字段
node -e "
const config = JSON.parse(require('fs').readFileSync('./config/snapshot-strategy.json', 'utf-8'));
console.log('✓ Strategy Name:', config.strategy.name);
console.log('✓ Network:', config.strategy.network);
console.log('✓ Token Address:', config.strategy.params.address);
console.log('✓ Symbol:', config.strategy.params.symbol);
console.log('✓ Decimals:', config.strategy.params.decimals);
"
```

---

## 2. 前端常量验证

### 2.1 TypeScript 编译检查

```bash
cd e:\Project\Blockchain\JCDAO\frontend

# 检查 TypeScript 编译是否通过
npx tsc --noEmit
```

### 2.2 导入验证

在任意组件中测试导入:

```typescript
// 在 frontend/src/app/page.tsx 或其他文件中临时添加
import { 
  SNAPSHOT_SPACE_URL, 
  GUILD_URL, 
  POLYGON_AMOY_CHAIN_ID 
} from '@/lib/constants';

console.log('Snapshot URL:', SNAPSHOT_SPACE_URL);
console.log('Guild URL:', GUILD_URL);
console.log('Chain ID:', POLYGON_AMOY_CHAIN_ID);
```

### 2.3 运行开发服务器验证

```bash
cd e:\Project\Blockchain\JCDAO\frontend
npm run dev

# 打开 http://localhost:3000
# 查看浏览器控制台是否有导入错误
```

---

## 3. Guild.xyz 配置验证流程

### 3.1 前置准备

1. **部署合约**: 确保 JCDMembership 和 JCDToken 已部署到 Polygon Amoy
2. **获取地址**: 从部署日志或 `.env` 获取合约地址
3. **更新配置**: 将 `<YOUR_DEPLOYED_*>` 占位符替换为实际地址

### 3.2 Guild.xyz 手动测试步骤

```
1. 访问 https://guild.xyz
2. 连接持有 SBT 和 $JCD 的测试钱包
3. 创建 Guild 并按照 guild-config.json 中的 "guildXyzSteps" 操作
4. 测试 "Join Guild" 功能
5. 验证 Discord 身份组是否正确分配
```

### 3.3 验证点检查清单

- [x] Guild 创建成功

---
后续步骤需要部署到Polygon才可实现

- [ ] SBT 持有者可获得 Member 身份组
- [ ] 100+ $JCD 持有者可获得 Contributor 身份组
- [ ] 10,000+ $JCD 持有者可获得 Whale 身份组
- [ ] Discord 频道权限正确配置

---

## 4. Snapshot 配置验证流程

### 4.1 测试账户准备

```
# 确保测试账户持有 $JCD 代币
# 部署时 deployer 账户会收到 1,000,000 $JCD
```

### 4.2 策略测试 (Snapshot Playground)

1. 访问 https://snapshot.org/#/playground
2. 选择 "erc20-balance-of" 策略
3. 输入以下参数:
   - Network: `80002`
   - Params:
     ```json
     {
       "address": "<YOUR_DEPLOYED_JCD_TOKEN_ADDRESS>",
       "symbol": "JCD",
       "decimals": 18
     }
     ```
4. 点击 "Test" 测试策略
5. 输入你的钱包地址，查看返回的投票权重

### 4.3 创建测试提案

```
1. 创建 Snapshot Space (需要 ENS 域名)
2. 使用 snapshot-strategy.json 中的 "proposalTemplate" 创建提案
3. 用持有 $JCD 的账户进行投票测试
4. 验证投票权重计算是否正确
```

### 4.4 验证点检查清单

- [ ] 策略在 Playground 中测试通过
- [ ] Space 创建成功
- [ ] 可以创建提案
- [ ] 投票权重 = $JCD 余额
- [ ] 投票结果正确计算

---

## 5. 端到端集成测试

### 5.1 完整流程测试

```
用户旅程测试:
1. 新用户连接钱包 → 显示 "非会员" 状态
2. 管理员铸造 SBT → 刷新后显示 "会员" 状态
3. 会员访问 Dashboard → 看到 $JCD 余额
4. 点击 "Vote" 按钮 → 跳转到 Snapshot Space
5. 点击 "Join Guild" → 跳转到 Guild.xyz
6. 加入 Guild → Discord 自动分配身份组
```

### 5.2 Dashboard 按钮测试

在 Dashboard 组件中添加测试按钮:

```tsx
// frontend/src/components/Dashboard.tsx
import { SNAPSHOT_SPACE_URL, GUILD_URL } from '@/lib/constants';

// 在组件中添加:
<a href={SNAPSHOT_SPACE_URL} target="_blank" rel="noopener noreferrer">
  投票 (Snapshot)
</a>
<a href={GUILD_URL} target="_blank" rel="noopener noreferrer">
  加入 Guild
</a>
```

---

## 6. 常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| Guild.xyz 检测不到 SBT | 合约地址错误 | 检查 chainId 和地址 |
| Snapshot 投票权重为 0 | 代币未委托 | 调用 `delegate()` 自委托 |
| Discord 身份组未分配 | Bot 权限不足 | 检查 Discord Bot 设置 |
| 策略测试失败 | 网络选择错误 | 确认选择 Polygon Amoy (80002) |

---

## 7. 配置文件更新检查表

使用实际部署地址更新配置文件:

```bash
# 查看部署后的合约地址
cat e:\Project\Blockchain\JCDAO\.env

# 更新配置文件中的占位符:
# 1. config/guild-config.json
#    - <YOUR_DEPLOYED_JCD_MEMBERSHIP_ADDRESS>
#    - <YOUR_DEPLOYED_JCD_TOKEN_ADDRESS>
#
# 2. config/snapshot-strategy.json
#    - <YOUR_DEPLOYED_JCD_TOKEN_ADDRESS>
#    - <YOUR_ADMIN_ADDRESS>
```

---

## 验证完成标准 ✅

- [x] 所有 JSON 文件语法正确
- [ ] 前端 TypeScript 编译无错误（有预存类型问题，与 Phase 3/4 无关）
- [x] 常量可正确导入使用
- [x] Guild.xyz 配置可用于创建 Guild
- [ ] Snapshot 策略在 Playground 测试通过（需要部署到 Polygon）
- [x] Dashboard 中 Guild 链接正常工作

