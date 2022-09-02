import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function BackBtn() {
  return (
    <div>
        <Button variant="text"
            onClick={() => { window.history.go(-1) }}
            size='small'
            color='black'
            sx={{ textTransform: 'none' }}
            startIcon={<ArrowBackIosIcon />}
            className='mb-3'>
            Back
        </Button>
    </div>
  )
}

export default BackBtn