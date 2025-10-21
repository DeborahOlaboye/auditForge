// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * Safe Contract Example
 * Demonstrates security best practices
 */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeBank is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "Must deposit some ether");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // SAFE: Uses nonReentrant modifier and checks-effects-interactions pattern
    function withdraw() external nonReentrant {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");

        // Update state BEFORE external call
        balances[msg.sender] = 0;

        // External call last
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        emit Withdrawal(msg.sender, balance);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
