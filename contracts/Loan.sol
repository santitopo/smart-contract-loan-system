// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";
import "./ERC721Receiver.sol";
import "./NFTContract.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable, ERC721Receiver {
    uint256 public loanCounter = 0;
    uint256 public loanAmount;
    NFTContract private _nftContract;
    uint256 public interestPercentage;
    mapping (uint256 => Loan) public loans;
    mapping (address => uint256) public loanByAddress; // Punteros al último loan de cada address. Cuando se complete el Loan y se devuelva el token, se debería borrar de acá.

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

    constructor(address _nftContractAddress) payable {
        owner = msg.sender;
        _nftContract = NFTContract(_nftContractAddress);
    }

    function requestLoan(uint256 _tokenId) external {
        require(loanByAddress[msg.sender] == 0 , "Loan: sender already has an ongoing loan");
        require(_nftContract.ownerOf(_tokenId) == msg.sender, "Loan: You are not the owner of token ");

        loanCounter += 1;
        Loan storage newLoan = loans[loanCounter];
        newLoan.tokenId = _tokenId;
        newLoan.requester = msg.sender;
        newLoan.status = LoanStatus.Pending;
        loanByAddress[msg.sender] = loanCounter;
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
        require(loanByAddress[msg.sender] != 0 , "Loan: sender has no ongoing loan");
        uint256 loanId = loanByAddress[msg.sender];
        Loan memory loan = loans[loanId];
        _nftContract.safeTransfer(msg.sender, loan.tokenId);
    }

    function setInterest(uint8 _interestPercentage) external {
    }

    function payment() external payable {

    }

    function getDebt() external view returns(uint256) {

    }

    function getLoanInformation(uint256 _loan_id) external view returns(Loan memory) {
        return loans[_loan_id];
    }

    //Debería de recibir el id del loan para setear el deadline
    function setDeadline(uint256 _maxTime) external {
        require(loanByAddress[msg.sender] != 0 , "Loan: sender has no ongoing loan");
        uint256 loanId = loanByAddress[msg.sender];
        Loan memory loan = loans[loanId];
        loan.dueDate = _maxTime;
    }

    function getDeadline() external view returns(uint256 _maxTime) {
        require(loanByAddress[msg.sender] != 0 , "Loan: sender has no ongoing loan");
        uint256 loanId = loanByAddress[msg.sender];
        Loan memory loan = loans[loanId];
        return loan.dueDate;
    }

    function takeOwnership(uint256 _tokenId) external {
        // recibe _tokenId. Busca su Loan en el mapping de tokens a Loans
        // se fija que no esté pagado y que el tiempo ya se haya cumplido
        // Si es así, llama al método del NFTContract transfer token, y transfiere el token a msg.sender (el owner)
        // 
    }

    function withdraw(uint256 _amount) external {

    }

    receive() external payable {

    }
}