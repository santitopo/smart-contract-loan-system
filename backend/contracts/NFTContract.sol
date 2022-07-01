// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Owneable.sol";
import "./IERC721.sol";
import "./ERC721Receiver.sol";

contract NFTContract is Owneable, IERC721, ERC721Receiver {
    //Next token's identifier
    uint256 public identifier = 1; 
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 private _mintPrice;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => NFTMetaData) private _nfts;
    mapping(uint256 => address) public ownerOf;

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

    modifier isNFTOwner(uint256 _tokenId) {
        require(ownerOf[_tokenId] == msg.sender, "ERC721: sender is not the owner");
        _;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory uri) {
        NFTMetaData memory token = _nfts[_tokenId];
        require(token.tokenId != 0, "Token does not exist");
        return token.imageURI;
    }

    function safeTransfer(address _to, uint256 _tokenId) external isNFTOwner(_tokenId) {
        _transfer(_to, _tokenId);
        require(_checkOnERC721Received(_to, _tokenId), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function _transfer(address _to, uint256 _tokenId) private {
        require(_to != address(0), "ERC721: cannot transfer to the zero address");

        balanceOf[msg.sender] -= 1;
        balanceOf[_to] += 1;
        ownerOf[_tokenId] = _to;
    }

    function safeMint(string calldata _name, string calldata _description, string calldata _imageURI) external payable returns(uint256) {
        require(msg.value >= _mintPrice, "You need to pay the appropriate amout of wei to mint");
        require(totalSupply > identifier, "Cannot mint any more NFTs - Max supply reached");
        _mint(_name, _description, _imageURI);
        require(_checkOnERC721Received(msg.sender, identifier - 1), "ERC721: transfer to non ERC721Receiver implementer");
        return identifier - 1;
    }

    function _mint(string calldata _name, string calldata _description, string calldata _imageURI) private {
        uint256 currentIdentifier = identifier;
        identifier += 1;

        NFTMetaData storage newTokenMetadata = _nfts[currentIdentifier];
        newTokenMetadata.tokenId = currentIdentifier;
        newTokenMetadata.name = _name;
        newTokenMetadata.description = _description;
        newTokenMetadata.imageURI = _imageURI;
        newTokenMetadata.mintDate = block.timestamp;

        balanceOf[msg.sender] += 1;
        ownerOf[currentIdentifier] = msg.sender;
    }

    function setPrice(uint256 _price) external isContractOwner() {
        _mintPrice = _price;
    }

    function getPrice() external view returns(uint256) {
        return _mintPrice;
    }

    function getMetadata(uint256 _tokenId) external view isNFTOwner(_tokenId) returns(string memory, string memory, string memory, uint256) {
        NFTMetaData memory token = _nfts[_tokenId];
        require(token.tokenId != 0, "Token does not exist");
        return (token.name, token.description, token.imageURI, token.mintDate);
    }

    // From openzeppelin implementation
    function _checkOnERC721Received(
        address _to,
        uint256 _tokenId
    ) private view returns (bool) {
        if (_isContract(_to)) {
            try IERC721Receiver(_to).onERC721Received(msg.sender, _tokenId) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    function _isContract(address _contractAddress) private view returns(bool) {
        return _contractAddress.code.length > 0;
    }

    function withdraw(uint256 _amount) external isContractOwner() {
        require(address(this).balance >= _amount, "Contract hasn't got enough funds");
        payable(msg.sender).transfer(_amount);
    }
}