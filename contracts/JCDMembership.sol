// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JCDMembership
 * @dev Soulbound Token (SBT) 实现，用作 JCDAO 成员资格凭证
 * @notice 该代币不可转让，一旦铸造将永久绑定到接收者地址
 */
contract JCDMembership is ERC721, Ownable {
    // 下一个要铸造的 Token ID
    uint256 private _nextTokenId;

    // 元数据的基础 URI
    string private _baseTokenURI;

    // 记录每个地址是否已持有成员资格
    mapping(address => bool) public hasMembership;

    // 事件：成员资格铸造
    event MembershipMinted(address indexed to, uint256 tokenId);

    // 事件：成员资格销毁
    event MembershipRevoked(address indexed from, uint256 tokenId);

    // 错误：转账被禁止（Soulbound）
    error TransferNotAllowed();

    // 错误：已拥有成员资格
    error AlreadyHasMembership();

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev 铸造成员资格 SBT
     * @param to 接收者地址
     */
    function mint(address to) external onlyOwner {
        if (hasMembership[to]) {
            revert AlreadyHasMembership();
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        hasMembership[to] = true;

        emit MembershipMinted(to, tokenId);
    }

    /**
     * @dev 批量铸造成员资格 SBT
     * @param recipients 接收者地址数组
     */
    function batchMint(address[] calldata recipients) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            if (!hasMembership[recipients[i]]) {
                uint256 tokenId = _nextTokenId++;
                _safeMint(recipients[i], tokenId);
                hasMembership[recipients[i]] = true;
                emit MembershipMinted(recipients[i], tokenId);
            }
        }
    }

    /**
     * @dev 撤销成员资格（销毁 SBT）
     * @param tokenId 要销毁的 Token ID
     */
    function revoke(uint256 tokenId) external onlyOwner {
        address owner = ownerOf(tokenId);
        _burn(tokenId);
        hasMembership[owner] = false;

        emit MembershipRevoked(owner, tokenId);
    }

    /**
     * @dev 设置基础 URI
     * @param baseURI 新的基础 URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev 重写 _baseURI 以返回自定义基础 URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev 获取当前已铸造的 Token 总数
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ========== Soulbound: 禁止转账 ==========

    /**
     * @dev 重写 transferFrom 使其无法转账
     */
    function transferFrom(address, address, uint256) public pure override {
        revert TransferNotAllowed();
    }

    /**
     * @dev 重写 safeTransferFrom 使其无法转账
     */
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert TransferNotAllowed();
    }

    /**
     * @dev 重写 approve 使其无法授权转账
     */
    function approve(address, uint256) public pure override {
        revert TransferNotAllowed();
    }

    /**
     * @dev 重写 setApprovalForAll 使其无法批量授权
     */
    function setApprovalForAll(address, bool) public pure override {
        revert TransferNotAllowed();
    }
}
