const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Contract to deploy
const nftContract = "NFTContract";
let contractAddress;
const loanContract = "LoanContract";

async function main(contractToDeploy) {
  // Get provider
  //const provider = ethers.provider;

  // Get provider for testnet
  const accessPoint_URL = process.env.GANACHE_ACCESSPOINT_URL;
  const provider = new ethers.providers.JsonRpcProvider(accessPoint_URL);

  // Get signer
  const [signer] = await ethers.getSigners();

  // Get Contracts to deploy
  const contractPath =
    "contracts/" + contractToDeploy + ".sol:" + contractToDeploy;
  const contractFactory = await ethers.getContractFactory(contractPath, signer);
  const deployedContract = contractAddress
    ? await contractFactory.deploy(contractAddress)
    : await contractFactory.deploy("ORT-NFT", "ORT", 100);
  //console.log(deployedContract);

  // Check transaction result. 1 it is the number of transction to wait
  tx_hash = deployedContract.deployTransaction.hash;
  const confirmations_number = 1;
  tx_result = await provider.waitForTransaction(tx_hash, confirmations_number);
  if (tx_result.confirmations < 0 || tx_result === undefined) {
    throw new Error(
      contractToDeploy ||
        " Contract ERROR: Deploy transaction is undefined or has 0 confirmations."
    );
  }

  // Get contract read only instance
  const contractABIPath =
    path.resolve(process.cwd(), "artifacts/contracts/", contractToDeploy) +
    ".sol/" +
    contractToDeploy +
    ".json";
  const contractArtifact = JSON.parse(fs.readFileSync(contractABIPath, "utf8"));
  const deployedContractInstance = new ethers.Contract(
    deployedContract.address,
    contractArtifact.abi,
    provider
  );

  // Check getBalance function
  const contractBalance = await deployedContractInstance.getBalance();

  console.log("");
  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("-- Deployed contract:\t", contractToDeploy);
  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("-- Contract address:\t", deployedContractInstance.address);
  contractAddress = deployedContractInstance.address;
  console.log("-- Contract Balance:\t", parseInt(contractBalance));
  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("-- Signer address:\t", signer.address);
  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("-- Deploy successfully");
  console.log(
    "---------------------------------------------------------------------------------------"
  );
}

main(nftContract)
  .then(() => main(loanContract))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
