import { ethers } from "hardhat";

async function main() {
    console.log("🚀 开始部署 JCDAO 合约...\n");

    const [deployer] = await ethers.getSigners();
    console.log("📍 部署者地址:", deployer.address);
    console.log("💰 账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

    // 部署 JCDMembership (SBT)
    console.log("📝 正在部署 JCDMembership (SBT)...");
    const JCDMembership = await ethers.getContractFactory("JCDMembership");
    const membership = await JCDMembership.deploy(
        "JCD Membership",                    // name
        "JCDM",                               // symbol
        "https://jcdao.xyz/metadata/"         // baseURI (可稍后更新)
    );
    await membership.waitForDeployment();
    const membershipAddress = await membership.getAddress();
    console.log("✅ JCDMembership 部署成功:", membershipAddress);

    // 部署 JCDToken (治理代币)
    console.log("\n📝 正在部署 JCDToken ($JCD)...");
    const JCDToken = await ethers.getContractFactory("JCDToken");
    const token = await JCDToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("✅ JCDToken 部署成功:", tokenAddress);

    // 输出部署摘要
    console.log("\n" + "=".repeat(50));
    console.log("📋 部署摘要");
    console.log("=".repeat(50));
    console.log(`JCDMembership (SBT): ${membershipAddress}`);
    console.log(`JCDToken ($JCD):     ${tokenAddress}`);
    console.log("=".repeat(50));

    // (可选) 给部署者 Mint 一个 SBT 用于测试
    console.log("\n🎫 正在为部署者铸造测试 SBT...");
    try {
        const mintTx = await membership.mint(deployer.address);
        await mintTx.wait();
        console.log("✅ SBT 铸造成功！部署者现已获得会员资格");
        console.log(`   Token ID: 0`);
        console.log(`   持有者: ${deployer.address}`);
    } catch (error: any) {
        console.log("⚠️  SBT 铸造跳过:", error.message || "未知错误");
    }

    // 验证部署结果
    console.log("\n🔍 验证部署结果...");
    const deployerBalance = await token.balanceOf(deployer.address);
    const totalSupply = await token.totalSupply();
    const hasMembership = await membership.hasMembership(deployer.address);

    console.log(`   $JCD 总供应量: ${ethers.formatEther(totalSupply)}`);
    console.log(`   部署者 $JCD 余额: ${ethers.formatEther(deployerBalance)}`);
    console.log(`   部署者是否为会员: ${hasMembership ? "✓ 是" : "✗ 否"}`);

    // 输出验证命令
    console.log("\n📌 合约验证命令:");
    console.log(`npx hardhat verify --network <network> ${membershipAddress} "JCD Membership" "JCDM" "https://jcdao.xyz/metadata/"`);
    console.log(`npx hardhat verify --network <network> ${tokenAddress}`);

    console.log("\n🎉 部署完成！");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ 部署失败:", error);
        process.exit(1);
    });
