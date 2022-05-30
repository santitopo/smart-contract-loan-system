// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";

contract NFTContract is Owneable {
    uint256 public identifier = 1;
    string public name;
    string public symbol;
    // Sería cantidad total de NFTs que se permitirá mintear?
    uint256 public totalSupply;
    uint256 public mintPrice;
    mapping(address => uint256) public balances;
    mapping(uint256 => NFTMetaData) public nfts;
    mapping(uint256 => address) public owners;

    struct NFTMetaData {
        uint256 tokenId;
        string name;
        string description;
        string imageURI;
        uint256 mintDate;
    }

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory uri) {

    }

    // Se podrían usar signed int no? Aunque si tenemos que respetar las firmas afecta.
    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return owners[_tokenId];
    }

    function safeTransfer(address _to, uint256 _tokenId) external {

    }

    function onERC721Received(address _from, uint256 _tokenId)  external pure returns(bytes4) {

    }

    // Payable y returns a la vez? Habíamos tenido problemas con la Calculadora porque al ser payable entra en la blockchain y no se espera que devuelva nada sino que use eventos.
    function safeMint(string calldata _name, string calldata _description, string calldata _imageURI) external payable returns(uint256 nft_id) {

    }

    function setPrice(uint256 _price) external isContractOwner() {
        mintPrice = _price;
    }

    function getPrince() external view returns(uint256) {
        return mintPrice;
    }

    function getMetadata(uint256 _token_id) external view returns(string memory _name, string memory _description, string memory _imageURI, uint256 _mintDate) {

    }
}