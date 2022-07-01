const { ethers }    = require("hardhat")
const fs            = require('fs')
const path          = require('path')
const { expect }    = require("chai")

// Contract instance variable
let provider, signer, deployedContractInstance

// Constant
const contractName = "NFTContract"

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
        deployedContractInstance    = await contractFactory.deploy('ORT NFT', 'ORT', 100)

    })

    it("Check Owner account", async() => {
        const owner = await deployedContractInstance.owner()
        expect(owner).to.be.equals(signer.address)
    })

    it("Mint with 1 ether returns correctly", async() => {
        const value = ethers.utils.parseEther("1")
        deployedContractInstance.setPrice(value)
        await deployedContractInstance.safeMint('Name', 'Desc', 'image_uri', {value: value})
    })

    it("Mint with less than 1 ether fails", async() => {
        const value = ethers.utils.parseUnits("1", "wei")
        deployedContractInstance.setPrice(ethers.utils.parseEther("1"))
        let failed = false
        try {
            await deployedContractInstance.safeMint('Name', 'Desc', 'image_uri', {value: value})
        } catch (error) {
            if (error.message.includes("You need to pay the appropriate amout of wei to mint")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Check get token URI of non existant token", async() => {
        let failed = false
        try {
            await deployedContractInstance.tokenURI(50);
        } catch (error) {
            if (error.message.includes("Token does not exist")) failed = true
        }
        expect(failed).to.be.true
    })

    it("Withdraw without enough funds", async() => {
        let failed = false
        let BIG_INT = 5000000000000000000000000000000000n;
        try {
            await deployedContractInstance.withdraw(BIG_INT);
        } catch (error) {
            if (error.message.includes("Contract hasn't got enough funds")) failed = true
        }
        expect(failed).to.be.true
    })
})