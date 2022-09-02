import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField';

export const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#212121',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
    // border color
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#cccccc',
      },
    //   color on hover
      '&:hover fieldset': {
        borderColor: '#212121',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#212121',
      },
    },
});