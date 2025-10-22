// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Vulnerable Contract: Missing Access Control
 * This contract is intentionally vulnerable for testing purposes
 */
contract VulnerableWallet {
    address public owner;
    uint256 public balance;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        balance += msg.value;
    }

    // VULNERABLE: No access control on critical function
    function withdraw(uint256 amount) public {
        require(balance >= amount, "Insufficient balance");
        balance -= amount;
        payable(msg.sender).transfer(amount);
    }

    // VULNERABLE: Anyone can change owner
    function transferOwnership(address newOwner) public {
        owner = newOwner;
    }
}
