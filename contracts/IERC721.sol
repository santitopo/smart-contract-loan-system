// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface IERC721 {
    function totalSupply() external view returns(uint256);
    function tokenURI(uint256 _tokenId) external view returns (string memory uri);
    function balanceOf(address _address) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransfer(address _to, uint256 _tokenId) external;
    function safeMint(string calldata _name, string calldata _description, string calldata _imageURI) external payable returns(uint256 nft_id);
    function getMetadata(uint256 _tokenId) external view returns(string memory _name, string memory _description, string memory _imageURI, uint256 _mintDate);
}