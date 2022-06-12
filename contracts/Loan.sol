// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";
import "./ERC721Receiver.sol";
import "./NFTContract.sol";


// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable, ERC721Receiver {
    uint256 public loanCounter = 0;
    uint256 public loanAmount;
    string public executionResult; //Borrar en producción
    NFTContract private _nftContract;
    address private _nftContractAddress;
    uint8 public interestPercentage;
    mapping (uint256 => Loan) public loans;
    mapping (uint256 => uint256) public loanByToken; // Puntero al útlimo loan de un token. Cuando se complete el Loan (y se devuelve el token), se debería borrar de acá.
    mapping (address => uint256) public loanByAddress; // Punteros al último loan de cada address. Cuando se complete el Loan (y se devuelva el token), se debería borrar de acá.

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

    constructor(address _nftContractAddress_) payable {
        owner = msg.sender;
        _nftContractAddress = _nftContractAddress_;
        _nftContract = NFTContract(_nftContractAddress_);
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
    function setLoanAmount(uint256 _tokenId, uint256 _loanAmount) external {
        uint256 _loanId = loanByToken[_tokenId];
        require(loans[_loanId].requester != address(0), "Loan: loan with that loanId doesn't exist");
        loans[_loanId].loanAmount = _loanAmount;
    }

    function getLoanStatus() external view returns(string memory) {
    }

    function withdrawLoanAmount() external {

    }

    function withdrawNFT() external { //Se puede usar para retirar el token cuando está finalizado el Loan, o 
    
    // Si recibe uint256 loanId implica que puede haber un loan Paid, sin haber sido retirado su token. (Cambiar el nombre del mapping por activeLoanByAddress)
    // Si no recibe loanId, es porque asume que hay un solo Loan por address sin haber sido retirado su token.
   
    }

    function setInterest(uint8 _interestPercentage) external isContractOwner() {
        interestPercentage = _interestPercentage;
    }

    function payment() external payable {
        uint256 loanId = loanByAddress[msg.sender];
        require(loanId != 0 && loans[loanId].dueDate >= block.timestamp && loans[loanId].status == LoanStatus.Approved, "Loan: sender doesn't have an ongoing loan");
        if(loans[loanId].currentDebt > msg.value){
            loans[loanId].currentDebt -= msg.value;
        }
        else {
            loans[loanId].currentDebt = 0;
            loans[loanId].status = LoanStatus.Paid;
        }
    }

    function getDebt() external view returns(uint256) {
       uint256 loanId = loanByAddress[msg.sender];
       require(loanId != 0 , "Loan: sender doesn't have an ongoing loan");
       return loans[loanId].currentDebt;
    }

    function getLoanInformation(uint256 _loan_id) external view returns(Loan memory) {

    }

    //Debería de recibir el id del loan para setear el deadline
    function setDeadline(uint256 _maxTime, uint256 _loanId) external isContractOwner(){
        require(loans[_loanId].requester != address(0), "Loan: loan with that loanId doesn't exist");
        loans[_loanId].dueDate = _maxTime;
    }

    function getDeadline() external view returns(uint256) {
        uint256 loanId = loanByAddress[msg.sender];
       require(loanId != 0 , "Loan: sender doesn't have an ongoing loan");
       return loans[loanId].dueDate;   
    }

    function takeOwnership(uint256 _tokenId) external isContractOwner() {
        require(loanByToken[_tokenId] != 0, "The token doesn't belong to any loan");

        uint256 loanId = loanByToken[_tokenId];
        Loan storage foundLoan = loans[loanId];
        require(foundLoan.status == LoanStatus.Approved,"The loan wasn't approved. You can't request ownership");
        require(foundLoan.dueDate < block.timestamp,"The loan's due date hasn't been reached yet");
        // Si estas validaciones se cumplen, llama al método del NFTContract transfer token, y transfiere el token a msg.sender (el owner)

        //Forma 1 de llamar        
        // _nftContract.safeTransfer(msg.sender, _tokenId);

        bytes memory methodToCall = abi.encodeWithSignature("safeTransfer(address,uint256)", msg.sender, _tokenId);
        _nftContractAddress.call(methodToCall);        
    }

    function withdraw(uint256 _amount) external {

    }

    receive() external payable {

    }
}