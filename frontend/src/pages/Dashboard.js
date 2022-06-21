import * as React from 'react';
import Button from '@mui/material/Button';

export default function TemporaryDrawer({setIsOpened}) {
return (
    <div>
        <React.Fragment>
          <Button onClick={()=>setIsOpened((p)=>!p)} >{'Open options'}</Button>
        </React.Fragment>
    </div>
  );
}
