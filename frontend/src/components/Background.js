import { Box } from '@mui/material';

const Background = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: 'rgb(55 47 71)',
        textAlign: 'center'
      }}
    >
      {children}
    </Box>
  );
};

export default Background;
