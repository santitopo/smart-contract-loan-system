// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

abstract contract Owneable {
    address owner;
    
    modifier isContractOwner() {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }
}