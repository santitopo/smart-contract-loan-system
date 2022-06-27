import * as React from 'react';
import CustomAppBar from '../components/CustomAppBar';

import Web3 from 'web3';

import NFTContractAbi from '../abis/NFTContractAbi';
import ContractControlPanel, {
  READ,
  WRITE
} from '../components/ContractControlPanel';

const nftContracttMethods = [
  { name: 'name', type: READ, params: [] },
  { name: 'symbol', type: READ, params: [] },
  { name: 'totalSupply', type: READ, params: [] },
  { name: 'balanceOf', type: READ, params: [{ name: 'address', value: '' }] },
  { name: 'ownerOf', type: READ, params: [{ name: '_tokenId', value: '' }] },
  { name: 'tokenURI', type: READ, params: [{ name: '_tokenId', value: '' }] },
  {
    name: 'safeMint',
    type: WRITE,
    params: [
      { name: '_name', value: '' },
      { name: '_description', value: '' },
      { name: '_imageURI', value: '' }
    ]
  },
  {
    name: 'safeTransfer',
    type: WRITE,
    params: [
      { name: '_to', value: '' },
      { name: '_tokenId', value: '' }
    ]
  },
  { name: 'getPrice', type: READ, params: [] },
  { name: 'setPrice', type: WRITE, params: [{ name: 'price', value: 0 }] },
  {
    name: 'getMetadata',
    type: READ,
    params: [{ name: '_tokenId', value: '' }]
  },
  { name: 'getBalance', type: READ, params: [] },
  { name: 'withdraw', type: WRITE, params: [{ name: 'amount', value: 0 }] }
];

const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x8Acc8e8C1859fD7884cc2269760Ec19211372074';
const nftContract = new web3.eth.Contract(NFTContractAbi, contractAddr);

export default function NFTContractControlPanel({ setIsOpened }) {
  return (
    <>
      <CustomAppBar
        setIsOpened={setIsOpened}
        title={'NFT Contract Control Panel'}
      />

      <ContractControlPanel
        contract={nftContract}
        contracttMethods={nftContracttMethods}
      />
    </>
  );
}
