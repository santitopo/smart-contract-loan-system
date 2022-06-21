import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src="/static/logo-big.svg" sx={{ width: 380, height: 175, ...sx }} />;
}
