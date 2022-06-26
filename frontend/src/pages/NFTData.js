import { default as React, useState } from 'react';
import Button from '@mui/material/Button';
import CustomAppBar from '../components/CustomAppBar';
import Background from '../components/Background';
import { nftContractABI } from '../abis/NFTContractAbi';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Web3 from 'web3';
import { color } from '@mui/system';
import { Box, Container, Grid } from '@mui/material';
console.log(Web3.givenProvider);
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x8Acc8e8C1859fD7884cc2269760Ec19211372074';
const nftContract = new web3.eth.Contract(nftContractABI, contractAddr);

export default function NFTData({ setIsOpened }) {
  const [price, setPrice] = useState(0);
  const [desiredPrice, setDesiredPrice] = useState('');

  const getPriceFromContract = async () => {
    nftContract.methods
      .getPrice()
      .call()
      .then(rsp => {
        console.log(`Response is ${rsp}`);
        setPrice(rsp);
      })
      .catch(err => console.log(`Error! ${err}`));
  };

  const setPriceToContract = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(`Account to use is: ${account}`);
    const gas = await nftContract.methods
      .setPrice(parseInt(desiredPrice))
      .estimateGas();
    const result = await nftContract.methods
      .setPrice(parseInt(desiredPrice))
      .send({
        from: account,
        gas
      });
    console.log(result);
  };

  return (
    <Background>
      <CustomAppBar />
      <Container style={{ paddingTop: 200 }} />
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Button
            style={{ backgroundColor: 'white', margin: 20 }}
            onClick={() => setIsOpened(p => !p)}
          >
            {'Open Menu'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Container style={{ paddingTop: 40 }}>
            <Button
              style={{ backgroundColor: 'white' }}
              onClick={() => getPriceFromContract()}
            >
              {'Get Price!'}
            </Button>
            <Typography color={'white'}>Price is {price}!</Typography>
          </Container>
        </Grid>

        <Grid item xs={12}>
          <Container style={{ paddingTop: 40 }}>
            <TextField
              id="outlined-basic"
              label="Desired Price"
              variant="filled"
              type="number"
              color="primary"
              focused
              sx={{ input: { color: 'white' } }}
              value={desiredPrice}
              onChange={event => setDesiredPrice(event.target.value)}
            />
            <Button
              style={{ backgroundColor: 'white' }}
              onClick={() => setPriceToContract()}
            >
              {'Set Price!'}
            </Button>
          </Container>
        </Grid>
      </Grid>
    </Background>
  );
}
