import React from 'react';
import Button from '@mui/material/Button';
import CustomAppBar from '../components/CustomAppBar';
import { Container, Grid, TextField, Typography } from '@mui/material';
import { web3Instance } from '../providers/WalletProvider';

export const READ = 'read';
export const WRITE = 'write';
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
    case 'setWei': {
      const newState = { ...state };
      newState[action.payload.methodIndex].wei = action.payload.wei;
      return newState;
    }
    default:
      return state;
  }
}

const isReadMethod = method => method.type === READ;
const ContractControlPanel = ({ contract, contractAddr, contracttMethods }) => {
  const [state, dispatch] = React.useReducer(reducer, contracttMethods);
  const [transferAmount, setTransferAmount] = React.useState(0);
  const setValue = (methodIndex, paramIndex, value) =>
    dispatch({ type: 'setValue', payload: { methodIndex, paramIndex, value } });

  const setReturned = (methodIndex, returned) =>
    dispatch({ type: 'setReturned', payload: { methodIndex, returned } });

  const setWei = (methodIndex, wei) => {
    dispatch({ type: 'setWei', payload: { methodIndex, wei } });
  };

  const readFromContract = async (method, params, methodIndex) => {
    if (!contract) {
      setReturned(methodIndex, 'No metamask connected');
      return;
    }
    try {
      const rsp = await contract.methods[method](
        ...params.map(param => param.value)
      ).call();
      setReturned(methodIndex, JSON.stringify(rsp));
      console.log({ rsp });
    } catch (err) {
      err.message && setReturned(methodIndex, err.message);
      console.log(`Error! ${err}`);
    }
  };

  const sendToContract = async (method, params, methodIndex, wei) => {
    if (!contract) {
      setReturned(methodIndex, 'No metamask connected');
      return;
    }
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    try {
      const gas = await contract.methods[method](
        ...params.map(param => param.value)
      ).estimateGas({
        value: wei
      });

      const rsp = await contract.methods[method](
        ...params.map(param => param.value)
      ).send({
        from: account,
        gas,
        value: wei
      });
      console.log({ rsp });
    } catch (err) {
      err.message && setReturned(methodIndex, err.message);
      console.log(`Error! ${err}`);
    }
  };

  const transfer = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    let gas;
    try {
      console.log('will transfer to', contractAddr);
      gas = await web3Instance.eth.estimateGas({
        to: contractAddr,
        value: transferAmount
        // data: '0x72656365697665'
      });
      console.log('the gas is', gas);
      web3Instance.eth.sendTransaction({
        from: account,
        to: contractAddr,
        value: transferAmount,
        //data: '0x72656365697665',
        gas
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Grid sx={{ paddingX: 3, paddingY: 10 }} container rowSpacing={3}>
        {contracttMethods.map((method, methodIndex) => (
          <Grid key={method.name} item container xs={12}>
            <Grid item xs={2}>
              <Button
                onClick={() => {
                  isReadMethod(method)
                    ? readFromContract(
                        method.name,
                        state[methodIndex].params,
                        methodIndex
                      )
                    : sendToContract(
                        method.name,
                        state[methodIndex].params,
                        methodIndex,
                        state[methodIndex].wei || 0
                      );
                }}
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
            {method.showWei && (
              <Grid key={`${method.name}-wei`} item xs={2}>
                <TextField
                  label={'wei'}
                  variant="filled"
                  color="primary"
                  focused
                  sx={{ input: { color: 'white' } }}
                  value={state[methodIndex].wei}
                  onChange={event => {
                    setWei(methodIndex, event.target.value);
                  }}
                />
              </Grid>
            )}
            <Grid item xs={4}>
              {state[methodIndex].returned && (
                <Typography
                  color={'white'}
                >{`Response: ${state[methodIndex].returned}`}</Typography>
              )}
            </Grid>
          </Grid>
        ))}
        <Grid item container xs={12}>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                transfer();
              }}
              style={{ backgroundColor: 'white' }}
            >
              {'Donate'}
            </Button>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label={'Amount'}
              variant="filled"
              color="primary"
              focused
              sx={{ input: { color: 'white' } }}
              value={transferAmount}
              onChange={event => {
                setTransferAmount(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ContractControlPanel;
