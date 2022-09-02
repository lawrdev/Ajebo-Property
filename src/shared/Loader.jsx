import {useState} from 'react'
import PropTypes from 'prop-types'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader({ show }) {
    const [open, setOpen] = useState(show);

    // const handleClose = () => {
    //   setOpen(false);
    // };
  
    return (
      <div>
        
        <Backdrop
          sx={{ color: '#e74c3c', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

Loader.propTypes = {
    show: PropTypes.bool,
}
Loader.defaultProps = { show: false}