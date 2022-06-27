import * as React from 'react';
import CustomAppBar from '../components/CustomAppBar';
import ContractControlPanel, {
  READ,
  WRITE
} from '../components/ContractControlPanel';
import { useWallet } from '../providers/WalletProvider';

const loanContracttMethods = [
  { name: 'loanAmount', type: READ, params: [] },
  { name: 'interestPercentage', type: READ, params: [] },
  { name: 'loans', type: READ, params: [{ name: '_loanId', value: '' }] },
  {
    name: 'loanByToken',
    type: READ,
    params: [{ name: '_tokenId', value: '' }]
  },
  {
    name: 'loanByAddress',
    type: READ,
    params: [{ name: 'address', value: '' }]
  },

  {
    name: 'requestLoan',
    type: WRITE,
    params: [{ name: '_tokenId', value: '' }]
  },
  {
    name: 'setLoanAmount',
    type: WRITE,
    params: [
      { name: '_tokenId', value: '' },
      { name: '_loanAmount', value: '' }
    ]
  },
  { name: 'getLoanStatus', type: READ, params: [] },
  { name: 'withdrawLoanAmount', type: WRITE, params: [] },
  { name: 'withdrawNFT', type: WRITE, params: [] },
  {
    name: 'setInterest',
    type: WRITE,
    params: [{ name: '_interestPercentage', value: '' }]
  },
  { name: 'payment', type: WRITE, params: [] },
  { name: 'getDebt', type: READ, params: [] },
  {
    name: 'getLoanInformation',
    type: READ,
    params: [{ name: '_loan_id', value: '' }]
  },
  {
    name: 'setDeadline',
    type: WRITE,
    params: [
      { name: '_maxTime', value: '' },
      { name: '_loanId', value: '' }
    ]
  },
  { name: 'getDeadline', type: WRITE, params: [] },
  {
    name: 'takeOwnership',
    type: WRITE,
    params: [{ name: '_tokenId', value: '' }]
  },
  { name: 'withdraw', type: WRITE, params: [{ name: '_amount', value: '' }] }
];

export default function LoanContractControlPanel({ setIsOpened }) {
  const { loanContract } = useWallet();
  return (
    <>
      <CustomAppBar
        setIsOpened={setIsOpened}
        title={'Loan Contract Control Panel'}
      />

      <ContractControlPanel
        contract={loanContract}
        contracttMethods={loanContracttMethods}
      />
    </>
  );
}
