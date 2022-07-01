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
    setUserAddress(accounts[0]);
    return;
  }
}

const nftContractAddr = '0x0acB1bd5dEA6D8BAE085a20fd852178fc917490b';
const loanContractAddr = '0x5A106B8adEB043b81c56Dae6dDdCdffC4eF82d9D';
export const web3Instance = new Web3(Web3.givenProvider);

export default ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [loanContract, setLoanContract] = useState(null);

  const handleAccountChanged = () => checkIfWalletIsConnected(setUserAddress);

  useEffect(() => {
    handleAccountChanged();
    ethereum.on('accountsChanged', handleAccountChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountChanged);
    };
  }, []);

  useEffect(() => {
    if (!userAddress) {
      setNFTContract(null);
      setLoanContract(null);
      return;
    }

    setNFTContract(
      new web3Instance.eth.Contract(NFTContractAbi, nftContractAddr, {
        from: userAddress
      })
    );
    setLoanContract(
      new web3Instance.eth.Contract(LoanContractAbi, loanContractAddr, {
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
        loanContractAddr,
        nftContract,
        nftContractAddr,
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
