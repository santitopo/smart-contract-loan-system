import * as React from 'react';
import Button from '@mui/material/Button';
import CustomAppBar from '../components/CustomAppBar';
import { nftContractABI } from '../abis/NFTContractAbi';
import Web3 from 'web3';

import { Container, Grid, TextField, Typography } from '@mui/material';

const READ = 'read';
const WRITE = 'write';

const NFTContracttMethods = [
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

function reducer(state, action) {
  switch (action.type) {
    case 'setValue': {
      const newState = { ...state };
      const params = state[action.payload.methodIndex].params.map(paramObj => ({
        ...paramObj
      }));
      const paramToUpdate = params[action.payload.paramIndex];
      paramToUpdate.value = action.payload.value;
      newState[action.payload.methodIndex].params = params;
      return newState;
    }
    case 'setReturned': {
      const newState = { ...state };
      newState[action.payload.methodIndex].returned = action.payload.returned;
      return newState;
    }
    default:
      return state;
  }
}

const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x8Acc8e8C1859fD7884cc2269760Ec19211372074';
const nftContract = new web3.eth.Contract(nftContractABI, contractAddr);

const isReadMethod = method => method.type === READ;

export default function NFTContractControlPanel({ setIsOpened }) {
  const [state, dispatch] = React.useReducer(reducer, NFTContracttMethods);
  const setValue = (methodIndex, paramIndex, value) =>
    dispatch({ type: 'setValue', payload: { methodIndex, paramIndex, value } });

  const setReturned = (methodIndex, returned) =>
    dispatch({ type: 'setReturned', payload: { methodIndex, returned } });

  const readFromContract = async (method, params, methodIndex) => {
    try {
      const rsp = await nftContract.methods[method](
        ...params.map(param => param.value)
      ).call();
      setReturned(methodIndex, rsp);
      console.log({ rsp });
    } catch (err) {
      err.message && setReturned(methodIndex, err.message);
      console.log(`Error! ${err}`);
    }
  };

  const sendToContract = async (method, params, methodIndex) => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    try {
      const gas = await nftContract.methods[method](
        ...params.map(param => param.value)
      ).estimateGas();
      const rsp = await nftContract.methods[method](
        ...params.map(param => param.value)
      ).send({
        from: account,
        gas
      });
      console.log({ rsp });
    } catch (err) {
      err.message && setReturned(methodIndex, err.message);
      console.log(`Error! ${err}`);
    }
  };

  return (
    <>
      <CustomAppBar title={'NFT Contract Control Panel'} />
      <Container style={{ paddingTop: 100 }} />
      <Grid container rowSpacing={3}>
        <Grid item>
          <Button
            style={{ backgroundColor: 'white' }}
            onClick={() => setIsOpened(p => !p)}
          >
            {'Open Menu'}
          </Button>
        </Grid>
        {NFTContracttMethods.map((method, methodIndex) => (
          <Grid key={method.name} item container xs={12}>
            <Grid item xs={1.5}>
              <Button
                onClick={() =>
                  isReadMethod(method)
                    ? readFromContract(
                        method.name,
                        state[methodIndex].params,
                        methodIndex
                      )
                    : sendToContract(
                        method.name,
                        state[methodIndex].params,
                        methodIndex
                      )
                }
                style={{ backgroundColor: 'white' }}
              >
                {method.name}
              </Button>
            </Grid>
            {method.params.map((param, paramIndex) => (
              <Grid key={`${param.name}-${paramIndex}`} item xs={2}>
                <TextField
                  label={param.name}
                  variant="filled"
                  color="primary"
                  focused
                  sx={{ input: { color: 'white' } }}
                  value={state[methodIndex].params[paramIndex].value}
                  onChange={event => {
                    setValue(methodIndex, paramIndex, event.target.value);
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={4}>
              {state[methodIndex].returned && (
                <Typography
                  color={'white'}
                >{`Response: ${state[methodIndex].returned}`}</Typography>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
