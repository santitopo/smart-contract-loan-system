import { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import NFTContractAbi from '../abis/NFTContractAbi';
import LoanContractAbi from '../abis/LoanContractAbi';

const WalletContext = createContext();

async function connect(setUserAddress) {
  if (!window.ethereum) {
    alert('Get MetaMask!');
    return;
  }

  //Connection request
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  setUserAddress(accounts[0]);
}

async function checkIfWalletIsConnected(setUserAddress) {
  if (!window.ethereum) {
    alert('Get MetaMask!');
    return;
  }
  const accounts = await window.ethereum.request({
    method: 'eth_accounts'
  });

  if (accounts.length > 0) {
    //The connected account is the first one in this array.
    const account = accounts[0];
    setUserAddress(account);
    return;
  }
}

const nftContractAddr = '0x8Acc8e8C1859fD7884cc2269760Ec19211372074';
const loanContractAddr = '0xeC2d8a12aA8A1b20651D828fF635D507e6Eb73c3';

export default ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [loanContract, setLoanContract] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  useEffect(() => {
    if (!userAddress) {
      setNFTContract(null);
      setLoanContract(null);
      return;
    }
    const web3 = new Web3(Web3.givenProvider);
    setNFTContract(
      new web3.eth.Contract(NFTContractAbi, nftContractAddr, {
        from: userAddress
      })
    );
    setLoanContract(
      new web3.eth.Contract(LoanContractAbi, loanContractAddr, {
        from: userAddress
      })
    );
  }, [userAddress]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet: () => connect(setUserAddress),
        disconnectWallet: () => setUserAddress(null),
        userAddress,
        nftContract,
        loanContract
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
