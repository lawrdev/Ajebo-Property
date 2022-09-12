import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop';

export default function CirProgress(props) {
    return (
        <div>
            <Backdrop
                sx={{ color: '#e74c3c', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            // onClick={handleClose}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" {...props} />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" component="div" color="#fff">
                            {`${Math.round(props.value)}%`}
                        </Typography>
                    </Box>
                </Box>
            </Backdrop>


        </div>
    );
}

CirProgress.propTypes = {
    value: PropTypes.number.isRequired,
};