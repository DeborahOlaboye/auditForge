// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Vulnerable Contract: Reentrancy Attack
 * This contract is intentionally vulnerable for testing purposes
 */
contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: External call before state update
    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");

        // Vulnerable to reentrancy - state changed after external call
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0; // State update AFTER external call
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
