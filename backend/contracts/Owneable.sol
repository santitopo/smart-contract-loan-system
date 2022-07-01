// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

abstract contract Owneable {
    address public owner;
    
    modifier isContractOwner() {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    function getBalance() external view returns(uint256) {
        return address(this).balance;
    }
}