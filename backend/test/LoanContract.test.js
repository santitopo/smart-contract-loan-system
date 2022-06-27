const { ethers }    = require("hardhat")
const fs            = require('fs')
const path          = require('path')
const { expect }    = require("chai")
const {getEvent, eventContainsArgument}  = require('./testUtils')

// Contract instance variables
let provider, contractOwner, client1, client2, deployedLoanContractInstance, deployedContractNFTInstance, mintedTokenId, mintedTokenId2, requestedLoanId, requestedLoanId2
const loanAmount = 500
const interestPercentage = 5
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
        
        // Set conditions
        await deployedContractNFTInstance.setPrice(mintPrice)
        await deployedLoanContractInstance.setInterest(interestPercentage)

        // Mint tokens
        await deployedContractNFTInstance.connect(client1).safeMint('Name', 'Desc', 'image_uri', {value: mintPrice});
        mintedTokenId = await deployedContractNFTInstance.identifier() - 1
        await deployedContractNFTInstance.connect(client2).safeMint('Name 2', 'Desc 2', 'image_uri_2', {value: mintPrice});
        mintedTokenId2 = await deployedContractNFTInstance.identifier() - 1

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

    it("Check requestLoan - cannot use not owned token", async() => {
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
            if (error.message.includes("No active loan for address")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check getLoanStatus - Request loan and get status - returns PENDING", async() => {
        await deployedLoanContractInstance.connect(client1).requestLoan(mintedTokenId)
        requestedLoanId = await deployedLoanContractInstance.loanCounter()
        const status = await deployedLoanContractInstance.connect(client1).getLoanStatus()
        
        expect(status).to.be.equals(0)
    })

    it("Check cannot withdrawLoanAmount if amount is not set", async() => {
        
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
        const maxTimeInSeconds = 60
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

    it("Check getLoanStatus - returns APPROVED", async() => {
        const status = await deployedLoanContractInstance.connect(client1).getLoanStatus()
        
        expect(status).to.be.equals(1)
    })

    it("Check getDebt - returns correct debt plus interests", async() => {
        const debt = await deployedLoanContractInstance.connect(client1).getDebt()
        
        const expectedDebt = loanAmount * (100 + interestPercentage) / 100
        expect(BigInt(debt)).to.be.equals(BigInt(expectedDebt))
    })

    it("Check takeOwnership - Loan not expired yet then fails", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.takeOwnership(mintedTokenId);
        } catch (error) {
            if (error.message.includes("The loan's due date hasn't been reached yet"))  {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
    })

    it("Check payment - Pay 105 then reduces debt properly", async() => {
        const paymentAmount = 105
        const tx = await deployedLoanContractInstance.connect(client1).payment({value: paymentAmount})
        const receipt = await tx.wait()
        const debt = await deployedLoanContractInstance.connect(client1).getDebt()
        
        const expectedDebt = ((400) * (100 + interestPercentage)) / 100
        expect(BigInt(debt)).to.be.equals(BigInt(expectedDebt))
        const paymentEvent = getEvent(receipt.events, 'Payment')
        expect(eventContainsArgument(paymentEvent, '_paymentAmount', BigInt(paymentAmount), (arg) => BigInt(arg))).to.be.true
        expect(eventContainsArgument(paymentEvent, '_remainingDebt', BigInt(expectedDebt), (arg) => BigInt(arg))).to.be.true
    })

    it("Check withdrawNFT - NOT Paid then fails", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.connect(client1).withdrawNFT()
        } catch (error) {
            if (error.message.includes("Cannot withdraw NFT unless loan is paid")) {
                failed = true
            }  else {
                console.log(error.message)
            }
        }
        expect(failed).to.be.true
        const nftOwner = await deployedContractNFTInstance.ownerOf(mintedTokenId)
        expect(nftOwner).to.be.equals(deployedLoanContractInstance.address)
    })

    it("Check payment - Pay remaining debt then PAID", async() => {
        const debt = BigInt(await deployedLoanContractInstance.connect(client1).getDebt())
        const tx = await deployedLoanContractInstance.connect(client1).payment({value: debt})
        const receipt = await tx.wait()

        const paymentEvent = getEvent(receipt.events, 'Payment')
        expect(eventContainsArgument(paymentEvent, '_paymentAmount', BigInt(420), (arg) => BigInt(arg))).to.be.true
        expect(eventContainsArgument(paymentEvent, '_remainingDebt', BigInt(0), (arg) => BigInt(arg))).to.be.true
    })

    it("Check withdrawNFT - Paid then NFT si received", async() => {
        await deployedLoanContractInstance.connect(client1).withdrawNFT()
        
        const nftOwner = await deployedContractNFTInstance.ownerOf(mintedTokenId)
        expect(nftOwner).to.be.equals(client1.address)
    })

    it("Check takeOwnership - Loan expired then NFT transferred to contract owner", async() => {
        // Set up new loan
        await deployedLoanContractInstance.connect(client2).requestLoan(mintedTokenId2)
        requestedLoanId2 = await deployedLoanContractInstance.loanCounter()
        await deployedLoanContractInstance.connect(contractOwner).setDeadline(requestedLoanId2, 100);
        await deployedLoanContractInstance.connect(contractOwner).setLoanAmount(requestedLoanId2, loanAmount);
        await deployedContractNFTInstance.connect(client2).safeTransfer(deployedLoanContractInstance.address, mintedTokenId2)
        await deployedLoanContractInstance.connect(client2).withdrawLoanAmount();
        //Make loan expire without being paid
        await provider.send("evm_increaseTime", [200])

        await deployedLoanContractInstance.takeOwnership(mintedTokenId2);
        
        const nftOwner = await deployedContractNFTInstance.ownerOf(mintedTokenId2);
        expect(nftOwner).to.be.equals(contractOwner.address)
    })
})

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}