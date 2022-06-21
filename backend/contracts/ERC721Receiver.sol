// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface IERC721Receiver {
    function onERC721Received(address, uint256) external pure returns (bytes4);
}

abstract contract ERC721Receiver is IERC721Receiver {
    function onERC721Received(address, uint256) external pure override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,uint256)"));
    }
}