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

        // Deploy contract Loan
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
            await deployedLoanContractInstance.setDeadline(10,1);
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
            if (error.message.includes("Loan: You are not the owner of token ")) failed = true
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
})