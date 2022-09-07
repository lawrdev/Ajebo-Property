import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import { CustomButton } from '../customs/Buttons'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Sent! Kindly check your email')
        } catch (error) {
            toast.error('Email is not linked to an account')
        }
    }

    return (
        <div className="pageContainer px-6">
            <header>
                <p className="font-bold text-lg mb-4">Forgot Password</p>
            </header>

            <main>
                <p className="mb-2">Please provide us with the email address linked to your account</p>
                <form onSubmit={onSubmit}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        defaultValue={email}
                        onChange={onChange}
                        type="email"
                        label="Email address"
                        variant="standard" />
                    <CustomButton
                        disableElevation
                        endIcon={<DoubleArrowIcon />}
                        type="submit"
                        variant="contained"
                        size='large'
                        className="mt-3 font-bold"
                    >
                        Send reset link</CustomButton>
                </form>
                <div className="orDividerContainer my-3 w-full overflow-hidden">
                    <span className="orDivider">or</span>
                </div>

                <Link to='/sign-in' className="text-center">
                    Sign in
                </Link>

            </main>

        </div>
    );
}

export default ForgotPassword;