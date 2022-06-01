// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";

// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable {
    uint256 public identifier = 1;
    uint256 public loanAmount;
    uint256 public maxTimeInSeconds;
    mapping(uint256 => Loan) public loans;

    struct Loan {
        // Como nos aseguramos que el NFT haya sido transferido antes de actualizar?
        uint256 tokenId;
        address requester;
        // Que sería "balance del deudor"?
        uint256 currentDebt;
        uint256 dueDate;
        uint256 totalAmount;
    }

    enum LoanStatus { Pending, Approved, Rejected, Paid }

    constructor() payable {
        owner = msg.sender;
    }

    function requestLoan(uint256 token_id) external {

    }

    function setLoanAmount(uint256 _loanAmount) external {
        loanAmount = _loanAmount;
    }

    function getLoanStatus() external view returns(string memory) {

    }

    function withdrawLoanAmount() external {

    }

    // No debería recibir tokenId para saber cual quiere retirar?
    function withdrawNFT() external {

    }

    function setInterest(uint8 _interestPercentage) external {

    }

    function payment() external payable {

    }

    function getDebt() external view returns(uint256) {

    }

    function getLoanInformation(uint256 _loan_id) external view returns(Loan memory) {

    }

    function setDeadline(uint256 _maxTime) external {
        maxTimeInSeconds = _maxTime;
    }

    function getDeadline() external view returns(uint256 _maxTime) {

    }

    function takeOwnership(uint256 _token_id) external {

    }

    function withdraw(uint256 _amount) external {

    }

    fallback() external payable {

    }
}