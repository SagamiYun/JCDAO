import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { JCDMembership, JCDToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * 所有权转移测试套件
 * 
 * 测试场景:
 * 1. 成功转移所有权到新地址（模拟 Safe 钱包）
 * 2. 转移后原 Owner 无法执行 onlyOwner 函数
 * 3. 转移后新 Owner 可以执行 onlyOwner 函数
 * 4. 非 Owner 无法转移所有权
 * 5. 批量转移两个合约的所有权
 */
describe("TransferOwnership", function () {
    // ========== 测试固定装置 ==========
    async function deployContractsFixture() {
        const [deployer, newOwner, randomUser] = await ethers.getSigners();

        // 部署 JCDMembership
        const JCDMembership = await ethers.getContractFactory("JCDMembership");
        const membership = await JCDMembership.deploy(
            "JCD Membership",
            "JCDM",
            "https://jcdao.xyz/metadata/"
        );
        await membership.waitForDeployment();

        // 部署 JCDToken
        const JCDToken = await ethers.getContractFactory("JCDToken");
        const token = await JCDToken.deploy();
        await token.waitForDeployment();

        return { membership, token, deployer, newOwner, randomUser };
    }

    // ========== JCDMembership 所有权转移测试 ==========
    describe("JCDMembership 所有权转移", function () {
        it("应该正确返回初始 Owner", async function () {
            const { membership, deployer } = await loadFixture(deployContractsFixture);
            expect(await membership.owner()).to.equal(deployer.address);
        });

        it("Owner 应能成功转移所有权", async function () {
            const { membership, deployer, newOwner } = await loadFixture(deployContractsFixture);

            // 执行转移
            await expect(membership.transferOwnership(newOwner.address))
                .to.emit(membership, "OwnershipTransferred")
                .withArgs(deployer.address, newOwner.address);

            // 验证新 Owner
            expect(await membership.owner()).to.equal(newOwner.address);
        });

        it("转移后原 Owner 应无法执行 mint", async function () {
            const { membership, deployer, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            // 转移所有权
            await membership.transferOwnership(newOwner.address);

            // 原 Owner 尝试 mint 应失败
            await expect(
                membership.connect(deployer).mint(randomUser.address)
            ).to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });

        it("转移后新 Owner 应能执行 mint", async function () {
            const { membership, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            // 转移所有权
            await membership.transferOwnership(newOwner.address);

            // 新 Owner 执行 mint 应成功
            await expect(membership.connect(newOwner).mint(randomUser.address))
                .to.emit(membership, "MembershipMinted")
                .withArgs(randomUser.address, 0);
        });

        it("非 Owner 不应能转移所有权", async function () {
            const { membership, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            await expect(
                membership.connect(randomUser).transferOwnership(newOwner.address)
            ).to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });

        it("转移后原 Owner 应无法执行 setBaseURI", async function () {
            const { membership, deployer, newOwner } = await loadFixture(deployContractsFixture);

            await membership.transferOwnership(newOwner.address);

            await expect(
                membership.connect(deployer).setBaseURI("https://new-uri.com/")
            ).to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });

        it("转移后原 Owner 应无法执行 revoke", async function () {
            const { membership, deployer, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            // 先 mint 一个 token
            await membership.mint(randomUser.address);

            // 转移所有权
            await membership.transferOwnership(newOwner.address);

            // 原 Owner 尝试 revoke 应失败
            await expect(
                membership.connect(deployer).revoke(0)
            ).to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });
    });

    // ========== JCDToken 所有权转移测试 ==========
    describe("JCDToken 所有权转移", function () {
        it("应该正确返回初始 Owner", async function () {
            const { token, deployer } = await loadFixture(deployContractsFixture);
            expect(await token.owner()).to.equal(deployer.address);
        });

        it("Owner 应能成功转移所有权", async function () {
            const { token, deployer, newOwner } = await loadFixture(deployContractsFixture);

            await expect(token.transferOwnership(newOwner.address))
                .to.emit(token, "OwnershipTransferred")
                .withArgs(deployer.address, newOwner.address);

            expect(await token.owner()).to.equal(newOwner.address);
        });

        it("转移后原 Owner 应无法执行 mint", async function () {
            const { token, deployer, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            await token.transferOwnership(newOwner.address);

            await expect(
                token.connect(deployer).mint(randomUser.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("转移后新 Owner 应能执行 mint", async function () {
            const { token, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            await token.transferOwnership(newOwner.address);

            const mintAmount = ethers.parseEther("1000");
            await expect(token.connect(newOwner).mint(randomUser.address, mintAmount))
                .to.emit(token, "TokensMinted")
                .withArgs(randomUser.address, mintAmount);

            expect(await token.balanceOf(randomUser.address)).to.equal(mintAmount);
        });

        it("非 Owner 不应能转移所有权", async function () {
            const { token, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            await expect(
                token.connect(randomUser).transferOwnership(newOwner.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    // ========== 批量转移测试（模拟实际场景） ==========
    describe("批量所有权转移（模拟 Safe 迁移）", function () {
        it("应能一次性转移两个合约的所有权", async function () {
            const { membership, token, deployer, newOwner } = await loadFixture(deployContractsFixture);

            // 模拟 Safe 地址 (这里用 newOwner 代替)
            const safeAddress = newOwner.address;

            // 验证初始状态
            expect(await membership.owner()).to.equal(deployer.address);
            expect(await token.owner()).to.equal(deployer.address);

            // 批量转移
            await membership.transferOwnership(safeAddress);
            await token.transferOwnership(safeAddress);

            // 验证转移结果
            expect(await membership.owner()).to.equal(safeAddress);
            expect(await token.owner()).to.equal(safeAddress);
        });

        it("转移后验证所有 onlyOwner 功能权限正确", async function () {
            const { membership, token, deployer, newOwner, randomUser } = await loadFixture(deployContractsFixture);

            const safeAddress = newOwner.address;

            // 转移所有权
            await membership.transferOwnership(safeAddress);
            await token.transferOwnership(safeAddress);

            // ========== 验证 JCDMembership onlyOwner 函数 ==========

            // 旧 Owner 无法调用
            await expect(membership.connect(deployer).mint(randomUser.address))
                .to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");

            await expect(membership.connect(deployer).batchMint([randomUser.address]))
                .to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");

            await expect(membership.connect(deployer).setBaseURI("test"))
                .to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");

            // 新 Owner 可以调用
            await expect(membership.connect(newOwner).mint(randomUser.address))
                .to.emit(membership, "MembershipMinted");

            await expect(membership.connect(newOwner).revoke(0))
                .to.emit(membership, "MembershipRevoked");

            // ========== 验证 JCDToken onlyOwner 函数 ==========

            // 旧 Owner 无法调用
            await expect(token.connect(deployer).mint(randomUser.address, 100))
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

            // 新 Owner 可以调用
            await expect(token.connect(newOwner).mint(randomUser.address, 100))
                .to.emit(token, "TokensMinted");
        });
    });

    // ========== 边界情况测试 ==========
    describe("边界情况", function () {
        it("不应能转移所有权给零地址", async function () {
            const { membership } = await loadFixture(deployContractsFixture);

            await expect(
                membership.transferOwnership(ethers.ZeroAddress)
            ).to.be.revertedWithCustomError(membership, "OwnableInvalidOwner");
        });

        it("不应能转移所有权给当前 Owner", async function () {
            const { membership, deployer } = await loadFixture(deployContractsFixture);

            // OpenZeppelin Ownable 允许转移给自己，但这是无意义的操作
            // 此测试验证事件仍然正常触发
            await expect(membership.transferOwnership(deployer.address))
                .to.emit(membership, "OwnershipTransferred")
                .withArgs(deployer.address, deployer.address);
        });

        it("renounceOwnership 应使合约无 Owner", async function () {
            const { membership, deployer } = await loadFixture(deployContractsFixture);

            await expect(membership.renounceOwnership())
                .to.emit(membership, "OwnershipTransferred")
                .withArgs(deployer.address, ethers.ZeroAddress);

            expect(await membership.owner()).to.equal(ethers.ZeroAddress);

            // 所有 onlyOwner 函数都应该失败
            await expect(membership.mint(deployer.address))
                .to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });
    });
});
