import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    getAuth, signInWithEmailAndPassword
} from 'firebase/auth'
import { toast } from 'react-toastify'
import BrandName from '../shared/BrandName'
import { IoEyeSharp } from 'react-icons/io5'
import { CustomTextField } from '../customs/Inputs'
import { CustomButton } from '../customs/Buttons'
import { Button } from '@mui/material'
import OAuth from '../components/OAuth'
import { motion } from "framer-motion"

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            // next we check if there is a user, then navigate then to the explore page
            if (userCredential.user) {
                navigate('/profile')
            }

        } catch (error) {
            toast.error(`The login details you entered isn't connected to an account`)
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
        <motion.div className="app-bg"
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <header className='mb-4 pt-4'>
                <BrandName size="28px" />
            </header>
            <div className="mx-auto max-w-sm pb-5">
                <div className=" bg-white rounded-lg border border-gray-200 shadow-md px-3 mt-3">
                    <p className="text-sm font-semibold text-center my-4">Welcome back!
                    </p>
                    <form onSubmit={onSubmit}>
                        <CustomTextField
                            required
                            fullWidth
                            type="email"
                            defaultValue={email}
                            onChange={onChange}
                            id="email"
                            label="Email address"
                            variant="outlined"
                            className="border-gray-300 text-md text-gray-400" />

                        <div className="relative mt-3">
                            <CustomTextField
                                required
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                defaultValue={password}
                                onChange={onChange}
                                autoComplete="current-password"
                                id='password'
                                label="Password" variant="outlined"
                                className="order-gray-300 text-md text-gray-400" />

                            <div
                                className="absolute right-0 top-0 translate-y-1/2 mr-2 mt-1 z-20">
                                <IoEyeSharp
                                    title='show password'
                                    size='1.35em'
                                    className={
                                        !showPassword ? 'opacity-30' : ''
                                    }
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            </div>

                        </div>
                        <Link to='/forgot-password' className='ml-auto text-xs mt-1 w-fit'>
                            Forgotten password?
                        </Link>
                        <CustomButton
                            fullWidth
                            disableElevation
                            type="submit"
                            variant="contained"
                            size='large'
                            className="mt-4 font-bold"
                        >
                            Log In</CustomButton>
                    </form>

                    {/* Google OAuth */}
                    <OAuth />

                    <div className="orDividerContainer mt-12 mb-3 w-full overflow-hidden">
                        <span className="orDivider">or</span>
                    </div>
                    <div className="text-center mb-8 mt-2">
                        <Button
                            color="secondary"
                            disableElevation
                            variant="contained"
                            onClick={() => navigate('/sign-up')}
                            sx={{ textTransform: 'none' }}
                        >
                            Create a new account
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default SignIn;