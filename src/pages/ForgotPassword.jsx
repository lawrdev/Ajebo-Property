import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import { CustomButton } from '../customs/Buttons'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { motion } from "framer-motion"


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

    const pageAnimate = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                delay: .1, duration: 0.4
            }
        },
        exit: {
            x: '-100vw',
            opacity: 0,
            transition: { ease: 'easeInOut', duration: 0.2 }
        }
    }

    return (
        <motion.div className="pageContainer px-6"
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <header>
                <p className="font-bold text-lg mb-4">Forgot Password</p>
            </header>

            <main className='pt-6'>
                <p className='font-semibold text-gray-500'>Please provide us with the email address linked to your account</p>
                <form onSubmit={onSubmit} className='mt-4'>
                    <TextField
                        required
                        fullWidth
                        color='black'
                        id="email"
                        defaultValue={email}
                        onChange={onChange}
                        type="email"
                        label="Email address"
                        variant="outlined" />
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
                <div className="orDividerContainer my-10 w-full overflow-hidden">
                    <span className="orDivider">or</span>
                </div>

                <Link to='/sign-in' className="text-center">
                    Sign in
                </Link>

            </main>

        </motion.div>
    );
}

export default ForgotPassword;