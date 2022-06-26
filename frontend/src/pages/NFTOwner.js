import * as React from 'react';
import Button from '@mui/material/Button';
import CustomAppBar from '../components/CustomAppBar';

import Background from '../components/Background';

export default function NFTOwner({ setIsOpened }) {
  return (
    <Background>
      <CustomAppBar setIsOpened={setIsOpened} title={'NFT Owner feature'} />
      <Button
        style={{ top: '50%', backgroundColor: 'white' }}
        onClick={() => setIsOpened(p => !p)}
      >
        {'Open Menu'}
      </Button>
    </Background>
  );
}
