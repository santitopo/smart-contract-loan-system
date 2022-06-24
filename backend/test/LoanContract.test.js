const { ethers }    = require("hardhat")
const fs            = require('fs')
const path          = require('path')
const { expect }    = require("chai")

// Contract instance variables
let provider, contractOwner, client1, client2, deployedLoanContractInstance, deployedContractNFTInstance, mintedTokenId, requestedLoanId
const loanAmount = 500
const mintPrice = 150

// Constant
const loanContractName = "LoanContract"
const nftContractName = "NFTContract"

describe(loanContractName || " Contract test", () => {
    before(async() => {
        console.log("------------------------------------------------------------------------------------")
        console.log("--", loanContractName, "Contract Test Start")
        console.log("------------------------------------------------------------------------------------") 

        // Get provider and Signer
        provider = ethers.provider
        contractOwner = (await ethers.getSigners())[0]
        client1 = (await ethers.getSigners())[1]
        client2 = (await ethers.getSigners())[2]

        // Deploy contract NftContract
        const nftContractPath          = "contracts/" + nftContractName + ".sol:" + nftContractName
        const nftContractFactory      = await ethers.getContractFactory(nftContractPath, contractOwner)
        deployedContractNFTInstance    = await nftContractFactory.deploy('ORT NFT', 'ORT', 100)

        // Deploy contract LoanContract
        const loanContractPath          = "contracts/" + loanContractName + ".sol:" + loanContractName
        const loanContractFactory       = await ethers.getContractFactory(loanContractPath, contractOwner)
        deployedLoanContractInstance    = await loanContractFactory.deploy(deployedContractNFTInstance.address, {value: 1000})
        // Set mint price
        await deployedContractNFTInstance.setPrice(mintPrice)

        await deployedContractNFTInstance.connect(client1).safeMint('Name', 'Desc', 'image_uri', {value: mintPrice});
        mintedTokenId = await deployedContractNFTInstance.identifier() - 1

        console.log(`Client1 ${client1.address} minted token ${mintedTokenId} and has balance ${await provider.getBalance(client1.address)}`)
    })

    it("Check get deadline fails", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getDeadline();
        } catch (error) {
            if (error.message.includes("Loan: sender doesn't have an ongoing loan"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check set deadline inexistant loan id", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.setDeadline(1, 10);
        } catch (error) {
            if (error.message.includes("Loan: loan with that loanId doesn't exist"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check use not owned token", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.requestLoan(1);
        } catch (error) {
            if (error.message.includes("You are not the owner of token"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot set loan amount in non existant Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.setLoanAmount(1,50);
        } catch (error) {
            if (error.message.includes("Loan: loan with that loanId doesn't exist"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdraw NFT without Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.withdrawNFT();
        } catch (error) {
            if (error.message.includes("Loan: sender has no ongoing loan"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot getDebt without a Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getDebt();
        } catch (error) {
            if (error.message.includes("Loan: sender doesn't have an ongoing loan"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot take ownership of token that is not in any Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.takeOwnership(1);
        } catch (error) {
            if (error.message.includes("The token doesn't belong to any loan"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot getLoanStatus without a Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getLoanStatus();
        } catch (error) {
            if (error.message.includes("The address has no loans"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdrawLoanAmount if no pending Loan for address", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.connect(client1).withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("No pending loan for address")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdrawLoanAmount if amount is not set", async() => {
        await deployedLoanContractInstance.connect(client1).requestLoan(mintedTokenId)
        requestedLoanId = await deployedLoanContractInstance.loanCounter()
        let failed = false
        try {
            await deployedLoanContractInstance.connect(client1).withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("The amount is not set")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })
    
    it("Check cannot withdrawLoanAmount if dueDate is not set", async() => {
        await deployedLoanContractInstance.connect(contractOwner).setLoanAmount(requestedLoanId, loanAmount);
        let failed = false
        try {
            await deployedLoanContractInstance.connect(client1).withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("The dueDate is not set")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdrawLoanAmount if token was not transferred", async() => {
        const maxTimeInSeconds = (new Date()).getSeconds() + 60
        await deployedLoanContractInstance.connect(contractOwner).setDeadline(requestedLoanId, maxTimeInSeconds);
        let failed = false
        try {
            await deployedLoanContractInstance.connect(client1).withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("Token was not transferred to LoanContract")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check withdrawLoanAmount sends the money properly", async() => {
        await deployedContractNFTInstance.connect(client1).safeTransfer(deployedLoanContractInstance.address, mintedTokenId)
        const previousBalance = BigInt(await provider.getBalance(client1.address))
        const tx = await deployedLoanContractInstance.connect(client1).withdrawLoanAmount();
        const receipt = await tx.wait();
        const transactionGasSpent = BigInt(receipt.cumulativeGasUsed * receipt.effectiveGasPrice)
        const balanceAfterWithdraw = BigInt(await provider.getBalance(client1.address))
        const balanceIfTransactionCostsWereZero = balanceAfterWithdraw + transactionGasSpent
        
        //console.log(receipt.events);
        expect(balanceIfTransactionCostsWereZero).to.be.equals(BigInt(previousBalance) + BigInt(loanAmount))
    })
})