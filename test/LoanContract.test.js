const { ethers }    = require("hardhat")
const fs            = require('fs')
const path          = require('path')
const { expect }    = require("chai")

// Contract instance variable
let provider, signer, deployedContractInstance

// Constant
const contractName = "Loan"

describe(contractName || " Contract test", () => {
    before(async() => {
        console.log("------------------------------------------------------------------------------------")
        console.log("--", contractName, "Contract Test Start")
        console.log("------------------------------------------------------------------------------------") 

        // Get provider and Signer
        provider = ethers.provider
        signer = (await ethers.getSigners())[0]

        // Deploy contract
        const contractPath          = "contracts/" + contractName + ".sol:" + contractName
        const contractFactory       = await ethers.getContractFactory(contractPath, signer)
        deployedContractInstance    = await contractFactory.deploy('ORT LOAN', 'ORT', 100)

    })

    it("Check get deadline fails", async() => {
        let failed = false
        try {
            await deployedContractInstance.getDeadline();
        } catch (error) {
            if (error.message.includes("Loan: sender doesn't have an ongoing loan")) failed = true
        }
        expect(failed).to.be.true
    })
})