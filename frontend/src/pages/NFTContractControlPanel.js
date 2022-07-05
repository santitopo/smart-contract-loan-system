import * as React from 'react';
import CustomAppBar from '../components/CustomAppBar';
import ContractControlPanel, {
  READ,
  WRITE
} from '../components/ContractControlPanel';
import { useWallet } from '../providers/WalletProvider';

const nftContracttMethods = [
  { name: 'name', type: READ, params: [] },
  { name: 'symbol', type: READ, params: [] },
  { name: 'totalSupply', type: READ, params: [] },
  { name: 'balanceOf', type: READ, params: [{ name: 'address', value: '' }] },
  { name: 'ownerOf', type: READ, params: [{ name: '_tokenId', value: '' }] },
  { name: 'tokenURI', type: READ, params: [{ name: '_tokenId', value: '' }] },
  { name: 'identifier', type: READ, params: [] },
  {
    name: 'safeMint',
    type: WRITE,
    params: [
      { name: '_name', value: '' },
      { name: '_description', value: '' },
      { name: '_imageURI', value: '' }
    ],
    showWei: true,
    wei: 0
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

export default function NFTContractControlPanel({ setIsOpened }) {
  const { nftContract, nftContractAddr } = useWallet();
  return (
    <>
      <CustomAppBar
        setIsOpened={setIsOpened}
        title={'NFT Contract Control Panel'}
      />

      <ContractControlPanel
        contract={nftContract}
        contractAddr={nftContractAddr}
        contracttMethods={nftContracttMethods}
      />
    </>
  );
}
