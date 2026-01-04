// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JCDToken
 * @dev JCDAO 治理代币 ($JCD)
 * @notice 用于 Snapshot 投票的 ERC20 代币，支持 ERC20Votes 和 ERC20Permit
 */
contract JCDToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    // 最大供应量：1亿 $JCD
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    // 事件：代币铸造
    event TokensMinted(address indexed to, uint256 amount);

    // 错误：超过最大供应量
    error ExceedsMaxSupply();

    constructor()
        ERC20("JCD Token", "JCD")
        ERC20Permit("JCD Token")
        Ownable(msg.sender)
    {
        // 初始铸造：100万枚给部署者
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    /**
     * @dev 铸造代币（仅限 Owner）
     * @param to 接收者地址
     * @param amount 铸造数量
     */
    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert ExceedsMaxSupply();
        }
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev 销毁自己持有的代币
     * @param amount 销毁数量
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // ========== 以下为 Solidity 多重继承的必要重写 ==========

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
