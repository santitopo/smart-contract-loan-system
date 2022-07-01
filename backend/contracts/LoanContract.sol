// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Owneable.sol";
import "./ERC721Receiver.sol";

contract LoanContract is Owneable, ERC721Receiver {
    uint256 public loanCounter = 0;
    address private _nftContractAddress;
    uint8 public interestPercentage;
    mapping (uint256 => Loan) public loans;
    // Puntero al útlimo loan de un token. Cuando se complete el Loan (y se devuelve el token), se debería borrar de acá.
    mapping (uint256 => uint256) public loanByToken; 
    // Punteros al último loan de cada address. Cuando se complete el Loan (y se devuelva el token), se debería borrar de acá.
    mapping (address => uint256) public loanByAddress; 

    struct Loan {
        uint256 tokenId;
        address requester;
        uint256 currentDebt;
        uint256 dueDate;
        uint256 loanAmount;
        LoanStatus status;
    }

    enum LoanStatus { Pending, Approved, Paid }

    event Withdraw(address indexed _addr, uint256 _amount);
    event Received(address indexed _addr, uint256 _amount);
    event Payment(address indexed _addr, uint256 _paymentAmount, uint256 _remainingDebt);

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
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Loan status is not Pending so you cannot set its amount");
        require(loan.loanAmount == 0, "Loan amount was already set");
        loans[_loanId].loanAmount = _loanAmount;
    }

    // _maxTime is the amount of seconds that the client has to pay, so dueDate is now + _maxTime
    function setDeadline(uint256 _loanId, uint256 _maxTime) external isContractOwner(){
        require(loans[_loanId].requester != address(0), "Loan: loan with that loanId doesn't exist");
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Loan status is not Pending so you cannot set its deadline");
        require(loan.dueDate == 0, "Loan deadline was already set");
        loans[_loanId].dueDate = block.timestamp + _maxTime;
    }

    function withdrawLoanAmount() external {
        // Checks
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId > 0, "No active loan for address");
        Loan memory activeLoan = loans[loanId];
        require(activeLoan.status == LoanStatus.Pending, "The Loan is not pending");
        require(activeLoan.loanAmount > 0, "The amount is not set");
        require(activeLoan.dueDate > 0, "The dueDate is not set");
        require(address(this).balance >= activeLoan.loanAmount, "Not enough balance in contract");

        bytes memory methodToCall = abi.encodeWithSignature("ownerOf(uint256)", activeLoan.tokenId);
        (bool _success, bytes memory _returnData) = _nftContractAddress.call(methodToCall);
        require(_success, "Cannot retrieve owner from NFTContract");
        address ownerAddress = abi.decode(_returnData, (address));
        require(ownerAddress == address(this), "Token was not transferred to LoanContract");

        

        // Effects
        loans[loanId].status = LoanStatus.Approved;
        loans[loanId].currentDebt = activeLoan.loanAmount * (100 + interestPercentage) / 100;
        loanByToken[activeLoan.tokenId] = loanId;
        
        // Interacts
        uint256 lAmount = activeLoan.loanAmount;
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
        return loans[loanId].currentDebt;
    }

    function payment() external payable {
        // Checks
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0, "No active loan for sender");

        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Approved, "Loan: sender doesn't have an ongoing loan");
        require(loan.dueDate > block.timestamp, "Loan: loan has expired");

        // Effects
        if (loan.currentDebt > msg.value) {
            loan.currentDebt -= msg.value;
        } else {
            loan.currentDebt = 0;
            loan.status = LoanStatus.Paid;
        }
        emit Payment(msg.sender, msg.value, loan.currentDebt);
    }

    function withdrawNFT() external {
        // Checks
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0 , "Loan: sender has no ongoing loan");
        Loan memory activeLoan = loans[loanId];
        require(activeLoan.status == LoanStatus.Paid, "Cannot withdraw NFT unless loan is paid");

        // Effects
        delete loanByAddress[msg.sender];
        delete loanByToken[activeLoan.tokenId];
        
        // Interacts
        bytes memory methodToCall = abi.encodeWithSignature("safeTransfer(address,uint256)", msg.sender, loans[loanId].tokenId);
        (bool _success,) = _nftContractAddress.call(methodToCall);
        require(_success, "Failed to transfer NFT back to client");
    }

    function withdraw(uint256 _amount) external isContractOwner() {
        require(_amount <= address(this).balance, "Cannot withdraw more than available balance");
        payable(msg.sender).transfer(_amount);
    }

    function takeOwnership(uint256 _tokenId) external isContractOwner() {
        uint256 loanId = loanByToken[_tokenId];
        require(loanId != 0, "The token doesn't belong to any loan");
        
        Loan memory foundLoan = loans[loanId];
        require(foundLoan.status == LoanStatus.Approved, "The loan isn't approved. You can't request ownership");
        require(block.timestamp >= foundLoan.dueDate, "The loan's due date hasn't been reached yet");

        // Si estas validaciones se cumplen, llama al método del NFTContract transfer token, y transfiere el token desde LoanContract a msg.sender (el owner de LoanContract)
        bytes memory methodToCall = abi.encodeWithSignature("safeTransfer(address,uint256)", msg.sender, _tokenId);
        (bool _success,) = _nftContractAddress.call(methodToCall);
        delete loanByAddress[foundLoan.requester];
        delete loanByToken[_tokenId];
        loans[loanId].status = LoanStatus.Paid;

        require(_success, "Failed to transfer NFT of expired loan to LoanContract owner");
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}