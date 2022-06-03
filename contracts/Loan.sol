// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";
import "./ERC721Receiver.sol";

// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable, ERC721Receiver {
    uint256 public loanCounter = 1;
    uint256 public loanAmount;
    address public nftContract;     // El contrato que maneja los tokens
    uint256 public interestPercentage;
    mapping (uint256 => Loan) public loans;
    mapping (address => uint256) public loanByAddress; // Punteros a los últimos loans de cada address 

    struct Loan {
        uint256 tokenId;
        address requester;
        // Que sería "balance del deudor"?
        uint256 currentDebt;
        uint256 dueDate;
        uint256 loanAmount;
        LoanStatus status;
    }

    enum LoanStatus { Pending, Approved, Rejected, Paid }

    constructor(address _nftContract) payable {
        owner = msg.sender;
        nftContract = _nftContract;
    }

    function requestLoan(uint256 token_id) external {
    }

    //Debería de recibir el id del loan para setear el amount
    function setLoanAmount(uint256 _loanAmount) external {
        loanAmount = _loanAmount;
    }

    function getLoanStatus() external view returns(string memory) {
    }

    function withdrawLoanAmount() external {

    }

    function withdrawNFT() external { //Se puede usar para retirar el token cuando está finalizado el Loan, o 
    
    // Si recibe uint256 loanId implica que puede haber un loan Paid, sin haber sido retirado su token. (Cambiar el nombre del mapping por activeLoanByAddress)
    // Si no recibe loanId, es porque asume que hay un solo Loan por address sin haber sido retirado su token.
   
    }

    function setInterest(uint8 _interestPercentage) external {
    }

    function payment() external payable {

    }

    function getDebt() external view returns(uint256) {

    }

    function getLoanInformation(uint256 _loan_id) external view returns(Loan memory) {

    }

    //Debería de recibir el id del loan para setear el deadline
    function setDeadline(uint256 _maxTime) external {
    }

    function getDeadline() external view returns(uint256 _maxTime) {

    }

    function takeOwnership(uint256 _token_id) external {

    }

    function withdraw(uint256 _amount) external {

    }

    receive() external payable {

    }
}