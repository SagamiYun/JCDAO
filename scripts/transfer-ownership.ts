import { ethers } from "hardhat";
import { JCDMembership, JCDToken } from "../typechain-types";

/**
 * ⚠️ 重要提示 - 运行前请仔细阅读：
 * ===========================================
 * 
 * 1. 确保 Safe 钱包已创建:
 *    - 前往 https://app.safe.global/
 *    - 选择 Polygon Amoy 网络
 *    - 创建多签钱包并添加签名者
 *    - 记录 Safe 钱包地址
 * 
 * 2. 关于两步验证 (Two-Step Ownership Transfer):
 *    - OpenZeppelin 的 Ownable 使用单步转移 (transferOwnership)
 *    - 若使用 Ownable2Step，需要新 Owner 调用 acceptOwnership()
 *    - 本项目合约使用标准 Ownable，转移后立即生效
 * 
 * 3. ⚠️ 此操作不可逆！
 *    - 一旦转移所有权，只有 Safe 多签钱包才能执行 onlyOwner 函数
 *    - 包括：mint、batchMint、revoke、setBaseURI (JCDMembership)
 *    - 包括：mint (JCDToken)
 * 
 * 4. 运行命令:
 *    npx hardhat run scripts/transfer-ownership.ts --network polygonAmoy
 * 
 * ===========================================
 */

// ============================================================
// ⚠️ 配置区域 - 请在运行前修改以下参数
// ============================================================

// 你的 Safe 多签钱包地址 (必须修改!)
const SAFE_ADDRESS = "0x0000000000000000000000000000000000000000";

// 已部署的合约地址 (从 deploy.ts 输出获取)
const JCDMEMBERSHIP_ADDRESS = "0x0000000000000000000000000000000000000000";
const JCDTOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

// ============================================================

async function main() {
    console.log("🔐 开始所有权转移流程...\n");

    // ========== 参数验证 ==========
    if (SAFE_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("❌ 请先在脚本中设置 SAFE_ADDRESS！");
    }
    if (JCDMEMBERSHIP_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("❌ 请先在脚本中设置 JCDMEMBERSHIP_ADDRESS！");
    }
    if (JCDTOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
        throw new Error("❌ 请先在脚本中设置 JCDTOKEN_ADDRESS！");
    }

    const [currentOwner] = await ethers.getSigners();
    console.log("📍 当前所有者地址:", currentOwner.address);
    console.log("🎯 目标 Safe 地址:", SAFE_ADDRESS);
    console.log("");

    // ========== 获取合约实例 ==========
    console.log("📝 获取合约实例...");

    const membership = await ethers.getContractAt("JCDMembership", JCDMEMBERSHIP_ADDRESS) as unknown as JCDMembership;
    const token = await ethers.getContractAt("JCDToken", JCDTOKEN_ADDRESS) as unknown as JCDToken;

    // ========== 验证当前所有权 ==========
    console.log("\n🔍 验证当前所有权状态...");

    const membershipOwner = await membership.owner();
    const tokenOwner = await token.owner();

    console.log(`   JCDMembership 当前 Owner: ${membershipOwner}`);
    console.log(`   JCDToken 当前 Owner: ${tokenOwner}`);

    // 检查调用者是否为当前所有者
    if (membershipOwner.toLowerCase() !== currentOwner.address.toLowerCase()) {
        throw new Error(`❌ 当前账户 (${currentOwner.address}) 不是 JCDMembership 的 Owner！`);
    }
    if (tokenOwner.toLowerCase() !== currentOwner.address.toLowerCase()) {
        throw new Error(`❌ 当前账户 (${currentOwner.address}) 不是 JCDToken 的 Owner！`);
    }

    console.log("✅ 所有权验证通过\n");

    // ========== 转移 JCDMembership 所有权 ==========
    console.log("🔄 正在转移 JCDMembership 所有权...");
    try {
        const tx1 = await membership.transferOwnership(SAFE_ADDRESS);
        console.log(`   交易哈希: ${tx1.hash}`);
        console.log("   ⏳ 等待确认...");
        await tx1.wait();
        console.log("   ✅ JCDMembership 所有权转移成功！\n");
    } catch (error: any) {
        console.error("   ❌ JCDMembership 所有权转移失败:", error.message);
        throw error;
    }

    // ========== 转移 JCDToken 所有权 ==========
    console.log("🔄 正在转移 JCDToken 所有权...");
    try {
        const tx2 = await token.transferOwnership(SAFE_ADDRESS);
        console.log(`   交易哈希: ${tx2.hash}`);
        console.log("   ⏳ 等待确认...");
        await tx2.wait();
        console.log("   ✅ JCDToken 所有权转移成功！\n");
    } catch (error: any) {
        console.error("   ❌ JCDToken 所有权转移失败:", error.message);
        throw error;
    }

    // ========== 验证转移结果 ==========
    console.log("🔍 验证转移结果...");

    const newMembershipOwner = await membership.owner();
    const newTokenOwner = await token.owner();

    console.log(`   JCDMembership 新 Owner: ${newMembershipOwner}`);
    console.log(`   JCDToken 新 Owner: ${newTokenOwner}`);

    const membershipTransferred = newMembershipOwner.toLowerCase() === SAFE_ADDRESS.toLowerCase();
    const tokenTransferred = newTokenOwner.toLowerCase() === SAFE_ADDRESS.toLowerCase();

    console.log("");
    console.log("=".repeat(60));
    console.log("📋 所有权转移摘要");
    console.log("=".repeat(60));
    console.log(`JCDMembership: ${membershipTransferred ? "✅ 成功" : "❌ 失败"}`);
    console.log(`   旧 Owner: ${membershipOwner}`);
    console.log(`   新 Owner: ${newMembershipOwner}`);
    console.log("");
    console.log(`JCDToken: ${tokenTransferred ? "✅ 成功" : "❌ 失败"}`);
    console.log(`   旧 Owner: ${tokenOwner}`);
    console.log(`   新 Owner: ${newTokenOwner}`);
    console.log("=".repeat(60));

    if (membershipTransferred && tokenTransferred) {
        console.log("\n🎉 所有合约所有权已成功转移至 Safe 多签钱包！");
        console.log("\n⚠️ 提醒:");
        console.log("   1. 从现在起，所有 onlyOwner 操作都需要通过 Safe 多签执行");
        console.log("   2. 请确保 Safe 签名者都能访问钱包");
        console.log("   3. 建议立即在 Safe 中测试一个简单操作以验证权限");
    } else {
        console.log("\n⚠️ 警告: 部分转移可能未完成，请手动检查！");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ 所有权转移失败:", error);
        process.exit(1);
    });
