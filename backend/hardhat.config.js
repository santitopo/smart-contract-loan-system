require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      chainId: 1337,
      url: process.env.GANACHE_ACCESSPOINT_URL,
      from: process.env.GANACHE_ACCOUNT,
      accounts: [process.env.GANACHE_PRIVATE_KEY],
    },
    rinkeby: {
      chainId: 4,
      url: process.env.RINKEBY_ACCESSPOINT_URL,
      from: process.env.RINKEBY_ACCOUNT,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
