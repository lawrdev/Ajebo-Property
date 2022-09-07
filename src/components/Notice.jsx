import { useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Notice() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton
                onClick={handleOpen}
                aria-label="add an alarm">
                <Badge
                    variant='dot'
                    overlap="circular"
                    color="primary" >
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Disclaimer
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            This project was created using random listings from <a href='https://www.airbnb.com' alt='airbnb' className="inline hover:underline text-sm font-bold">Airbnb</a>. All listings are fake!
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
