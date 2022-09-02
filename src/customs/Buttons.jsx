import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {COLORS} from '../App'


export const CustomButton = styled(Button)(({ theme }) => ({
    color: '#fff',
    textTransform: 'none',
    backgroundColor: COLORS.PRIMARY,
    '&:hover': {
      backgroundColor: COLORS.PRIMARY_DARK,
    },
}));