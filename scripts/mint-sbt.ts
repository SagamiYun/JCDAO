import { ethers } from "hardhat";

/**
 * SBT 铸造脚本 - 为新用户铸造 JCDMembership SBT
 * 
 * 使用方法:
 * 1. 单个铸造: npx hardhat run scripts/mint-sbt.ts --network polygonAmoy
 * 2. 修改下方 RECIPIENTS 数组来批量铸造
 * 
 * 注意: 只有合约 Owner 可以执行此脚本
 */

// ============================================================
// ⚙️ 配置区域 - 修改以下内容
// ============================================================

// 已部署的 JCDMembership 合约地址
const JCDMEMBERSHIP_ADDRESS = "0x224DF0e3a4A5848189c623501f9feCB3D1279126";

// 要铸造 SBT 的接收者地址列表
const RECIPIENTS: string[] = [
    // 示例地址，请替换为实际地址
    // "0x1234567890123456789012345678901234567890",
    // "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
];

// ============================================================

async function main() {
    console.log("🎫 JCDMembership SBT 铸造脚本\n");

    // 获取签名者（Owner）
    const [owner] = await ethers.getSigners();
    console.log("📍 执行者地址:", owner.address);

    // 获取合约实例
    const membership = await ethers.getContractAt("JCDMembership", JCDMEMBERSHIP_ADDRESS);

    // 验证调用者是否为 Owner
    const contractOwner = await membership.owner();
    if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error(`❌ 当前账户 (${owner.address}) 不是合约 Owner (${contractOwner})`);
    }
    console.log("✅ 身份验证通过: 你是合约 Owner\n");

    // 检查是否有待铸造的地址
    if (RECIPIENTS.length === 0) {
        console.log("⚠️  RECIPIENTS 数组为空！");
        console.log("请在脚本中添加要铸造 SBT 的地址后重新运行。");
        console.log("\n示例:");
        console.log('const RECIPIENTS = ["0x1234...", "0xabcd..."];');
        return;
    }

    console.log(`📝 准备为 ${RECIPIENTS.length} 个地址铸造 SBT...\n`);

    // 铸造统计
    let successCount = 0;
    let failCount = 0;
    const results: { address: string; status: string; tokenId?: string; error?: string }[] = [];

    for (let i = 0; i < RECIPIENTS.length; i++) {
        const recipient = RECIPIENTS[i];
        console.log(`[${i + 1}/${RECIPIENTS.length}] 处理地址: ${recipient}`);

        try {
            // 检查是否已持有 SBT
            const hasMembership = await membership.hasMembership(recipient);
            if (hasMembership) {
                console.log(`   ⏭️  已持有 SBT，跳过`);
                results.push({ address: recipient, status: "跳过 (已持有)" });
                continue;
            }

            // 铸造 SBT
            const tx = await membership.mint(recipient);
            console.log(`   📤 交易已发送: ${tx.hash}`);

            const receipt = await tx.wait();

            // 从事件中获取 Token ID
            const transferEvent = receipt?.logs.find((log: any) => {
                try {
                    const parsed = membership.interface.parseLog(log);
                    return parsed?.name === "Transfer";
                } catch {
                    return false;
                }
            });

            let tokenId = "unknown";
            if (transferEvent) {
                const parsed = membership.interface.parseLog(transferEvent);
                tokenId = parsed?.args?.tokenId?.toString() || "unknown";
            }

            console.log(`   ✅ 铸造成功! Token ID: ${tokenId}`);
            results.push({ address: recipient, status: "成功", tokenId });
            successCount++;

        } catch (error: any) {
            console.log(`   ❌ 铸造失败: ${error.message}`);
            results.push({ address: recipient, status: "失败", error: error.message });
            failCount++;
        }

        console.log("");
    }

    // 输出摘要
    console.log("=".repeat(60));
    console.log("📋 铸造摘要");
    console.log("=".repeat(60));
    console.log(`总计: ${RECIPIENTS.length} 个地址`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${failCount}`);
    console.log(`跳过: ${RECIPIENTS.length - successCount - failCount}`);
    console.log("=".repeat(60));

    // 详细结果
    console.log("\n📊 详细结果:");
    results.forEach((r, i) => {
        const status = r.status === "成功" ? "✅" : r.status === "失败" ? "❌" : "⏭️";
        console.log(`${i + 1}. ${r.address.slice(0, 10)}...${r.address.slice(-8)} - ${status} ${r.status}${r.tokenId ? ` (ID: ${r.tokenId})` : ""}`);
    });

    console.log("\n🎉 脚本执行完成!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ 脚本执行失败:", error);
        process.exit(1);
    });
