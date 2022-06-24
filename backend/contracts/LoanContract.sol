// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Owneable.sol";
import "./ERC721Receiver.sol";
import "./NFTContract.sol";


// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable, ERC721Receiver {
    uint256 public loanCounter = 0;
    uint256 public loanAmount;
    address private _nftContractAddress;
    uint8 public interestPercentage;
    mapping (uint256 => Loan) public loans;
    mapping (uint256 => uint256) public loanByToken; // Puntero al útlimo loan de un token. Cuando se complete el Loan (y se devuelve el token), se debería borrar de acá.
    mapping (address => uint256) public loanByAddress; // Punteros al último loan de cada address. Cuando se complete el Loan (y se devuelva el token), se debería borrar de acá.

    struct Loan {
        uint256 tokenId;
        address requester;
        uint256 currentDebt;
        uint256 dueDate;
        uint256 loanAmount;
        LoanStatus status;
    }

    enum LoanStatus { Pending, Approved, Rejected, Paid }

    event Withdraw(address indexed _addr, uint256 _amount);
    event Received(address indexed _addr, uint256 _amount);

    constructor(address _nftContractAddress_) payable {
        owner = msg.sender;
        _nftContractAddress = _nftContractAddress_;
    }

    function setInterest(uint8 _interestPercentage) external isContractOwner() {
        interestPercentage = _interestPercentage;
    }

    function requestLoan(uint256 _tokenId) external {
        require(loanByAddress[msg.sender] == 0 , "Loan: sender already has an ongoing loan");
        bytes memory methodToCall = abi.encodeWithSignature("ownerOf(uint256)", _tokenId);
        (bool _success, bytes memory _returnData) = _nftContractAddress.call(methodToCall);
        require(_success, "Cannot retrieve owner from NFTContract");
        address ownerAddress = abi.decode(_returnData, (address));
        require(ownerAddress == msg.sender, "You are not the owner of token");

        loanCounter += 1;
        Loan storage newLoan = loans[loanCounter];
        newLoan.tokenId = _tokenId;
        newLoan.requester = msg.sender;
        newLoan.status = LoanStatus.Pending;
        loanByAddress[msg.sender] = loanCounter;
    }

    function getLoanStatus() external view returns (LoanStatus) {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId > 0, "The address has no loans");
        
        return loans[loanId].status;
    }

    function getLoanInformation(uint256 _loanId) external view isContractOwner() returns(Loan memory loan) {
        require(_loanId > 0, "Invalid loan ID");
        loan = loans[_loanId];
        require(loan.tokenId > 0, "Loan does not exist");
    }

    function setLoanAmount(uint256 _loanId, uint256 _loanAmount) external {
        require(loans[_loanId].requester != address(0), "Loan: loan with that loanId doesn't exist");
        loans[_loanId].loanAmount = _loanAmount;
    }

    function setDeadline(uint256 _loanId, uint256 _maxTime) external isContractOwner(){
        require(loans[_loanId].requester != address(0), "Loan: loan with that loanId doesn't exist");
        loans[_loanId].dueDate = _maxTime;
    }

    function withdrawLoanAmount() external {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId > 0, "No pending loan for address");
        require(loans[loanId].status == LoanStatus.Pending, "The Loan is not pending");
        require(loans[loanId].loanAmount > 0, "The amount is not set");
        require(loans[loanId].dueDate > 0, "The dueDate is not set");

        bytes memory methodToCall = abi.encodeWithSignature("ownerOf(uint256)", loans[loanId].tokenId);
        (bool _success, bytes memory _returnData) = _nftContractAddress.call(methodToCall);
        require(_success, "Cannot retrieve owner from NFTContract");
        address ownerAddress = abi.decode(_returnData, (address));
        require(ownerAddress == address(this), "Token was not transferred to LoanContract");

        loans[loanId].status = LoanStatus.Approved;
        uint256 lAmount = loans[loanId].loanAmount;
        payable(msg.sender).transfer(lAmount);
        emit Withdraw(msg.sender, lAmount);
    }

    function getDeadline() external view returns(uint256) {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0 , "Loan: sender doesn't have an ongoing loan");
        return loans[loanId].dueDate;
    }

    function getDebt() external view returns(uint256) {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0 , "Loan: sender doesn't have an ongoing loan");
        return loans[loanId].currentDebt * (100 + interestPercentage);
    }

    function payment() external payable {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0, "No active loan for sender");

        Loan storage loan = loans[loanId];
        require(loan.dueDate >= block.timestamp && loan.status == LoanStatus.Approved, "Loan: sender doesn't have an ongoing loan");

        uint256 effectivePayment = msg.value / (100 + interestPercentage);
        if (loan.currentDebt > effectivePayment) {
            loan.currentDebt -= effectivePayment;
        }
        else {
            loan.currentDebt = 0;
            delete loanByAddress[msg.sender];
            loan.status = LoanStatus.Paid;
        }
    }

    function withdrawNFT() external {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0 , "Loan: sender has no ongoing loan");
        Loan memory activeLoan = loans[loanId];
        require(activeLoan.status == LoanStatus.Paid, "Cannot withdraw NFT unless loan is paid");

        delete loanByAddress[msg.sender];
        delete loanByToken[activeLoan.tokenId];
        
        bytes memory methodToCall = abi.encodeWithSignature("safeTransfer(address,uint256)", msg.sender, loans[loanId].tokenId);
        (bool _success,) = _nftContractAddress.call(methodToCall);
        require(_success, "Failed to transfer NFT back to client");
    }

    function withdraw(uint256 _amount) external isContractOwner() {
        payable(msg.sender).transfer(_amount);
    }

    function takeOwnership(uint256 _tokenId) external isContractOwner() {
        uint256 loanId = loanByToken[_tokenId];
        require(loanId != 0, "The token doesn't belong to any loan");
        
        Loan storage foundLoan = loans[loanId];
        require(foundLoan.status == LoanStatus.Approved, "The loan isn't approved. You can't request ownership");
        require(foundLoan.dueDate < block.timestamp, "The loan's due date hasn't been reached yet");

        // Si estas validaciones se cumplen, llama al método del NFTContract transfer token, y transfiere el token desde LoanContract a msg.sender (el owner de LoanContract)
        bytes memory methodToCall = abi.encodeWithSignature("safeTransfer(address,uint256)", msg.sender, _tokenId);
        (bool _success,) = _nftContractAddress.call(methodToCall);
        delete loanByAddress[foundLoan.requester];
        delete loanByToken[_tokenId];
        foundLoan.status = LoanStatus.Paid;

        require(_success, "Failed to transfer NFT of expired loan to LoanContract owner");
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}