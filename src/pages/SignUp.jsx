import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth"
import {
    setDoc,
    doc,
    serverTimestamp

} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import BrandName from '../shared/BrandName'
import { IoEyeSharp } from 'react-icons/io5'
import { CustomTextField } from '../customs/Inputs'
import { CustomButton } from '../customs/Buttons'
import { ReactComponent as LoadingSvg } from '../shared/LoadingSVG.svg'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import OAuth from '../components/OAuth'


const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const {name, email, password} = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
        }))
    }

    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const auth = getAuth()

            const userCredential = await createUserWithEmailAndPassword( auth, email, password)
            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name
            })
            const formDataCopy = {...formData}
            delete formDataCopy.password

            formDataCopy.timestamp = serverTimestamp()
            await setDoc(
                    doc(db, 'users', user.uid),
                    formDataCopy
                )
            setLoading(false)
            navigate('/')

        } catch(error){
            setLoading(false)
            toast.error(`something went wrong, please try again`)
        }
    }

    return (
    <>
    <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            // url(https://source.unsplash.com/random)'
            sx={{
                backgroundImage: 'url(https://a0.muscache.com/im/pictures/4821260d-d7b9-4a23-b12a-d41aa15afee5.jpg?im_w=960)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className="app-bg">
            <header className='mb-4 pt-4'>
                <BrandName size="28px" />
            </header>
            <div className="mx-auto max-w-sm pb-5">
                <div className=" bg-white rounded-lg border border-gray-200 shadow-md px-3 mt-3">
                    <h3 className="font-bold text-lg text-center mt-2">
                        Create a new account</h3>
                    <p className="text-sm text-center mb-3">
                        You're almost there!
                    </p>
                    <hr />
                    <form onSubmit={onSubmit}>
                        <CustomTextField
                            required
                            fullWidth
                            color="secondary"
                            type="text"
                            defaultValue={name}
                            onChange={onChange}
                            id="name"
                            label="Full name"
                            variant="outlined"
                            className="border-gray-300 text-md text-gray-400 mt-3" />
                        <CustomTextField
                            required
                            fullWidth
                            color="secondary"
                            type="email"
                            defaultValue={email}
                            onChange={onChange}
                            id="email"
                            label="Enter your email address" variant="outlined"
                            className="border-gray-300 text-md text-gray-400 mt-3" />

                        <div className="relative mt-3">
                            <CustomTextField
                                required
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                defaultValue={password}
                                onChange={onChange}
                                autoComplete="current-password"
                                id='password'
                                label="Password"
                                variant="outlined"
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
                        <CustomButton
                            fullWidth
                            disableElevation
                            type="submit"
                            variant="contained"
                            size='large'
                            className="mt-3 font-bold"
                        >
                            Sign Up
                            {loading ? <span
                                className="ml-4">
                                <LoadingSvg
                                    width='16px' height='16px' />
                            </span> : ''}
                        </CustomButton>
                    </form>

                    {/* Google OAuth */}
                    <OAuth />

                    <div className="text-center mb-8 mt-1 text-sm">
                        Already have an account?
                        <Link to='/sign-in' className='inline-block ml-2 text-sm'>
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </Grid>
    </Grid>
    </>
    );
}
 
export default SignUp;