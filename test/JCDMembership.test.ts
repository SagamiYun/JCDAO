import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { JCDMembership } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("JCDMembership (SBT)", function () {
    // 定义 Fixture：部署合约的共享设置
    async function deployMembershipFixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        const JCDMembership = await ethers.getContractFactory("JCDMembership");
        const membership = await JCDMembership.deploy(
            "JCD Membership",
            "JCDM",
            "https://jcdao.xyz/metadata/"
        );

        return { membership, owner, user1, user2, user3 };
    }

    describe("部署", function () {
        it("应该设置正确的名称和符号", async function () {
            const { membership } = await loadFixture(deployMembershipFixture);
            expect(await membership.name()).to.equal("JCD Membership");
            expect(await membership.symbol()).to.equal("JCDM");
        });

        it("应该设置正确的 Owner", async function () {
            const { membership, owner } = await loadFixture(deployMembershipFixture);
            expect(await membership.owner()).to.equal(owner.address);
        });

        it("初始 totalSupply 应该为 0", async function () {
            const { membership } = await loadFixture(deployMembershipFixture);
            expect(await membership.totalSupply()).to.equal(0);
        });
    });

    describe("铸造 (Minting)", function () {
        it("Owner 可以铸造 SBT", async function () {
            const { membership, owner, user1 } = await loadFixture(deployMembershipFixture);

            await expect(membership.mint(user1.address))
                .to.emit(membership, "MembershipMinted")
                .withArgs(user1.address, 0);

            expect(await membership.ownerOf(0)).to.equal(user1.address);
            expect(await membership.hasMembership(user1.address)).to.be.true;
            expect(await membership.totalSupply()).to.equal(1);
        });

        it("非 Owner 不能铸造 SBT", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await expect(membership.connect(user1).mint(user2.address))
                .to.be.revertedWithCustomError(membership, "OwnableUnauthorizedAccount");
        });

        it("同一地址不能铸造两次", async function () {
            const { membership, user1 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);
            await expect(membership.mint(user1.address))
                .to.be.revertedWithCustomError(membership, "AlreadyHasMembership");
        });

        it("可以批量铸造 SBT", async function () {
            const { membership, user1, user2, user3 } = await loadFixture(deployMembershipFixture);

            await membership.batchMint([user1.address, user2.address, user3.address]);

            expect(await membership.hasMembership(user1.address)).to.be.true;
            expect(await membership.hasMembership(user2.address)).to.be.true;
            expect(await membership.hasMembership(user3.address)).to.be.true;
            expect(await membership.totalSupply()).to.equal(3);
        });
    });

    describe("Soulbound (不可转让)", function () {
        it("transferFrom 应该回滚", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);

            await expect(membership.connect(user1).transferFrom(user1.address, user2.address, 0))
                .to.be.revertedWithCustomError(membership, "TransferNotAllowed");
        });

        it("safeTransferFrom 应该回滚", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);

            await expect(
                membership.connect(user1)["safeTransferFrom(address,address,uint256)"](user1.address, user2.address, 0)
            ).to.be.revertedWithCustomError(membership, "TransferNotAllowed");
        });

        it("safeTransferFrom (带 data 参数) 应该回滚", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);

            // 测试 4 参数版本的 safeTransferFrom，确保带 data 参数时也无法转移
            await expect(
                membership.connect(user1)["safeTransferFrom(address,address,uint256,bytes)"](
                    user1.address, user2.address, 0, "0x1234"
                )
            ).to.be.revertedWithCustomError(membership, "TransferNotAllowed");
        });

        it("approve 应该回滚", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);

            await expect(membership.connect(user1).approve(user2.address, 0))
                .to.be.revertedWithCustomError(membership, "TransferNotAllowed");
        });

        it("setApprovalForAll 应该回滚", async function () {
            const { membership, user1, user2 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);

            await expect(membership.connect(user1).setApprovalForAll(user2.address, true))
                .to.be.revertedWithCustomError(membership, "TransferNotAllowed");
        });
    });

    describe("撤销 (Revoke)", function () {
        it("Owner 可以撤销成员资格", async function () {
            const { membership, user1 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);
            expect(await membership.hasMembership(user1.address)).to.be.true;

            await expect(membership.revoke(0))
                .to.emit(membership, "MembershipRevoked")
                .withArgs(user1.address, 0);

            expect(await membership.hasMembership(user1.address)).to.be.false;
        });

        it("撤销后可以重新铸造", async function () {
            const { membership, user1 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);
            await membership.revoke(0);

            // 可以重新铸造
            await expect(membership.mint(user1.address))
                .to.emit(membership, "MembershipMinted")
                .withArgs(user1.address, 1); // Token ID 为 1
        });
    });

    describe("URI 管理", function () {
        it("Owner 可以更新 baseURI", async function () {
            const { membership, user1 } = await loadFixture(deployMembershipFixture);

            await membership.mint(user1.address);
            expect(await membership.tokenURI(0)).to.equal("https://jcdao.xyz/metadata/0");

            await membership.setBaseURI("https://newuri.xyz/");
            expect(await membership.tokenURI(0)).to.equal("https://newuri.xyz/0");
        });
    });
});
