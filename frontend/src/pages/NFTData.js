import { default as React, useState } from 'react';
import Button from '@mui/material/Button';
import CustomAppBar from '../components/CustomAppBar';
import Background from '../components/Background';
import { nftContractABI } from '../abis/NFTContractAbi'

import Web3 from 'web3';
import { color } from '@mui/system';
console.log(Web3.givenProvider)
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0x55F70d2c08Db542aa84f3f7e01DFE4B1Cd930dAc';
const nftContract = new web3.eth.Contract(nftContractABI, contractAddr);
    

export default function NFTData({ setIsOpened }) {
  const [price, setPrice] = useState(0);
  const [desiredPrice, setDesiredPrice] = useState('');

  const getPriceFromContract = async () => {
    nftContract.methods.getPrice().call()
    .then((rsp) => {
      console.log(`Response is ${rsp}`)
      setPrice(rsp);
    })
    .catch(err => console.log(`Error! ${err}`))
  }

  const setPriceToContract = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(`Account to use is: ${account}`);
    const gas = await nftContract.methods.setPrice(parseInt(desiredPrice)).estimateGas();
    const result = await nftContract.methods.setPrice(parseInt(desiredPrice)).send({
      from: account,
      gas 
    })
    console.log(result);
  }

  return (
    <Background>
      <CustomAppBar />
      <div>
      
      </div>
      <Button
        style={{ top: '50%', backgroundColor: 'white' }}
        onClick={() => setIsOpened(p => !p)}
      >
        {'Open Menu'}
      </Button>
      <br/>
      <br/>
      <br/>
      <br/>
      <span>Price is {price}!</span>
      <br/>
      <br/>
      <Button
        style={{ top: '50%', backgroundColor: 'white' }}
        onClick={() => getPriceFromContract()}
      >
        {'Get Price!'}
      </Button>
      <br/>
      <input value={desiredPrice} type="text" onChange={(event) => setDesiredPrice(event.target.value)}/>
      <Button
        style={{ top: '50%', backgroundColor: 'white' }}
        onClick={() => setPriceToContract()}
      >
        {'Set Price!'}
      </Button>
    </Background>
  );
}
