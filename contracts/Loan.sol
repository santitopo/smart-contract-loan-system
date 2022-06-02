// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Owneable.sol";
import "./ERC721Receiver.sol";

// Podemos llamarle así al contrato asi podemos tener la entidad Loan?
contract LoanContract is Owneable, ERC721Receiver {
    uint256 public identifier = 1;
    uint256 public loanAmount;
    address public nftContact;
    mapping(uint256 => Loan) public loans;

    struct Loan {
        // Como nos aseguramos que el NFT haya sido transferido antes de actualizar?
        uint256 tokenId;
        address requester;
        // Que sería "balance del deudor"?
        uint256 currentDebt;
        uint256 dueDate;
        uint256 loanAmount;
        uint256 interestPercentage;
        LoanStatus status;
    }

    enum LoanStatus { Pending, Approved, Rejected, Paid }

    constructor(address _nftContact) payable {
        owner = msg.sender;
        nftContact = _nftContact;
    }

    function requestLoan(uint256 token_id) external {
        //Posible flujo

        // Paso 1: Validar contra el nftContract que el msg.sender sea el dueño de ese NFT
        //          y si lo es, crear el Loan en estado Pending.
        // Paso 2: El owner agrega el interés, monto prestado, y fecha de vencimiento al loan.
        // Paso 3: Si el usuario quiere aceptar el loan, puede hacerlo transfiriéndo el NFT a la address de el LoanContract 
        // Paso 4: El owner luego aprueba entonces el préstamo con un método approveLoan(id) y se le transfiere el dinero a la address que lo solicitó
    }

    //Debería de recibir el id del loan para setear el amount
    function setLoanAmount(uint256 _loanAmount) external {
        loanAmount = _loanAmount;
    }

    //No recibe id porque asume que es el único Loan que tiene disponible esta address
    function getLoanStatus() external view returns(string memory) {

    }

    //No recibe id porque asume que es el único Loan que tiene disponible esta address
    function withdrawLoanAmount() external {

    }

    // No debería recibir tokenId para saber cual quiere retirar?
    function withdrawNFT() external {

    }

    //Debería de recibir el id del loan para setear el interest
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