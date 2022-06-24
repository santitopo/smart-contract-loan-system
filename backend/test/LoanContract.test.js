const { ethers }    = require("hardhat")
const fs            = require('fs')
const path          = require('path')
const { expect }    = require("chai")

// Contract instance variable
let provider, signer, deployedLoanContractInstance

let deployedContractNFTInstance

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
        signer = (await ethers.getSigners())[0]

        // Deploy contract NftContract
        const nftContractPath          = "contracts/" + nftContractName + ".sol:" + nftContractName
        const nftContractFactory      = await ethers.getContractFactory(nftContractPath, signer)
        deployedContractNFTInstance    = await nftContractFactory.deploy('ORT NFT', 'ORT', 100)

        // Deploy contract LoanContract
        const loanContractPath          = "contracts/" + loanContractName + ".sol:" + loanContractName
        const loanContractFactory       = await ethers.getContractFactory(loanContractPath, signer)
        deployedLoanContractInstance    = await loanContractFactory.deploy(deployedContractNFTInstance.address)
    })

    it("Check get deadline fails", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getDeadline();
        } catch (error) {
            if (error.message.includes("Loan: sender doesn't have an ongoing loan")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check set deadline inexistant loan id", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.setDeadline(1, 10);
        } catch (error) {
            if (error.message.includes("Loan: loan with that loanId doesn't exist")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check use not owned token", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.requestLoan(1);
        } catch (error) {
            if (error.message.includes("Loan: You are not the owner of token")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot set loan amount in non existant Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.setLoanAmount(1,50);
        } catch (error) {
            if (error.message.includes("Loan: loan with that loanId doesn't exist")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdraw NFT without Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.withdrawNFT();
        } catch (error) {
            if (error.message.includes("Loan: sender has no ongoing loan")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot getDebt without a Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getDebt();
        } catch (error) {
            if (error.message.includes("Loan: sender doesn't have an ongoing loan")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot take ownership of token that is not in any Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.takeOwnership(1);
        } catch (error) {
            if (error.message.includes("The token doesn't belong to any loan")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot getLoanStatus without a Loan", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.getLoanStatus();
        } catch (error) {
            if (error.message.includes("The address has no loans")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check cannot withdrawLoanAmount if amount is not set", async() => {
        let failed = false
        try {
            await deployedLoanContractInstance.withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("The amount is not set")) failed = true
        }
        expect(failed).to.be.true
    })
    
    it("Check cannot withdrawLoanAmount if dueDate is not set", async() => {
        let failed = false
        const _tokenId = await deployedContractNFTInstance.safeMint('Name', 'Desc', 'image_uri');
        const _loanId = deployedLoanContractInstance.loanByToken(_tokenId);
        await deployedLoanContractInstance.setLoanAmount(_loanId, 40);
        try {
            await deployedLoanContractInstance.withdrawLoanAmount();
        } catch (error) {
            console.log("error", error.message);
            if (error.message.includes("The dueDate is not set")) failed = true
        }
        expect(failed).to.be.true
    })
    

    it("Check cannot withdrawLoanAmount if not is the owner of the token", async() => {
        let failed = false
        const _tokenId = await deployedContractNFTInstance.safeMint('Name', 'Desc', 'image_uri');
        await deployedLoanContractInstance.requestLoan(_tokenId);
        const _loanId = deployedLoanContractInstance.loanByToken(_tokenId);
        await deployedLoanContractInstance.setLoanAmount(_loanId, 40);
        await deployedLoanContractInstance.setDeadline(_loanId, 30);
        try {
            await deployedLoanContractInstance.withdrawLoanAmount();
        } catch (error) {
            if (error.message.includes("Loan: You are not the owner of token")) failed = true
        }
        expect(failed).to.be.true
    })
})