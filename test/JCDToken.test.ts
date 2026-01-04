import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { JCDToken } from "../typechain-types";

describe("JCDToken (治理代币)", function () {
    // 定义 Fixture：部署合约的共享设置
    async function deployTokenFixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        const JCDToken = await ethers.getContractFactory("JCDToken");
        const token = await JCDToken.deploy();

        return { token, owner, user1, user2, user3 };
    }

    describe("部署", function () {
        it("应该设置正确的名称和符号", async function () {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.name()).to.equal("JCD Token");
            expect(await token.symbol()).to.equal("JCD");
        });

        it("应该设置正确的 Owner", async function () {
            const { token, owner } = await loadFixture(deployTokenFixture);
            expect(await token.owner()).to.equal(owner.address);
        });

        it("应该给部署者铸造初始 100万代币", async function () {
            const { token, owner } = await loadFixture(deployTokenFixture);
            const initialSupply = ethers.parseEther("1000000"); // 100万
            expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
            expect(await token.totalSupply()).to.equal(initialSupply);
        });

        it("MAX_SUPPLY 应该为 1 亿", async function () {
            const { token } = await loadFixture(deployTokenFixture);
            const maxSupply = ethers.parseEther("100000000");
            expect(await token.MAX_SUPPLY()).to.equal(maxSupply);
        });
    });

    describe("铸造 (Minting)", function () {
        it("Owner 可以铸造代币", async function () {
            const { token, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000");

            await expect(token.mint(user1.address, amount))
                .to.emit(token, "TokensMinted")
                .withArgs(user1.address, amount);

            expect(await token.balanceOf(user1.address)).to.equal(amount);
        });

        it("非 Owner 不能铸造代币", async function () {
            const { token, user1, user2 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000");

            await expect(token.connect(user1).mint(user2.address, amount))
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("铸造超过 MAX_SUPPLY 应该失败", async function () {
            const { token, user1 } = await loadFixture(deployTokenFixture);
            // 当前已有 100万，MAX 是 1亿，尝试铸造 9950万 (超过剩余的 9900万)
            const amount = ethers.parseEther("99500000");

            await expect(token.mint(user1.address, amount))
                .to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
        });

        it("可以铸造到 MAX_SUPPLY 刚好", async function () {
            const { token, user1 } = await loadFixture(deployTokenFixture);
            // 剩余 9900万
            const amount = ethers.parseEther("99000000");

            await token.mint(user1.address, amount);
            expect(await token.totalSupply()).to.equal(ethers.parseEther("100000000"));
        });
    });

    describe("转账 (Transfer)", function () {
        it("用户可以自由转账", async function () {
            const { token, owner, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000");

            await token.transfer(user1.address, amount);
            expect(await token.balanceOf(user1.address)).to.equal(amount);
        });

        it("可以使用 approve 和 transferFrom", async function () {
            const { token, owner, user1, user2 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000");

            await token.approve(user1.address, amount);
            await token.connect(user1).transferFrom(owner.address, user2.address, amount);

            expect(await token.balanceOf(user2.address)).to.equal(amount);
        });
    });

    describe("销毁 (Burn)", function () {
        it("用户可以销毁自己的代币", async function () {
            const { token, owner } = await loadFixture(deployTokenFixture);
            const burnAmount = ethers.parseEther("1000000");
            const initialBalance = await token.balanceOf(owner.address);

            await token.burn(burnAmount);

            expect(await token.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
        });
    });

    describe("投票功能 (ERC20Votes)", function () {
        it("转账后应该更新投票权重", async function () {
            const { token, owner, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000000");

            // 用户需要先委托投票权给自己
            await token.connect(user1).delegate(user1.address);

            // Owner 转账给用户
            await token.transfer(user1.address, amount);

            // 检查投票权重
            expect(await token.getVotes(user1.address)).to.equal(amount);
        });

        it("用户可以委托投票权给他人", async function () {
            const { token, owner, user1, user2 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000000");

            await token.transfer(user1.address, amount);

            // user1 委托给 user2
            await token.connect(user1).delegate(user2.address);

            expect(await token.getVotes(user2.address)).to.equal(amount);
            expect(await token.getVotes(user1.address)).to.equal(0);
        });

        it("可以查询历史投票权重", async function () {
            const { token, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000000");

            await token.connect(user1).delegate(user1.address);
            await token.transfer(user1.address, amount);

            const blockNumber = await ethers.provider.getBlockNumber();

            // 等待下一个区块
            await time.advanceBlock();

            expect(await token.getPastVotes(user1.address, blockNumber)).to.equal(amount);
        });
    });

    describe("ERC20Permit", function () {
        it("应该支持离线签名授权", async function () {
            const { token, owner, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("1000");
            const deadline = Math.floor(Date.now() / 1000) + 3600;

            const nonce = await token.nonces(owner.address);
            const name = await token.name();
            const chainId = (await ethers.provider.getNetwork()).chainId;

            // 构建 EIP-712 签名数据
            const domain = {
                name: name,
                version: "1",
                chainId: chainId,
                verifyingContract: await token.getAddress(),
            };

            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            };

            const value = {
                owner: owner.address,
                spender: user1.address,
                value: amount,
                nonce: nonce,
                deadline: deadline,
            };

            const signature = await owner.signTypedData(domain, types, value);
            const { v, r, s } = ethers.Signature.from(signature);

            // 使用 permit
            await token.permit(owner.address, user1.address, amount, deadline, v, r, s);

            expect(await token.allowance(owner.address, user1.address)).to.equal(amount);
        });
    });
});
