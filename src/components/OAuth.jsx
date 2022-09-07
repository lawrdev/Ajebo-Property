import { useLocation, useNavigate } from 'react-router-dom'
import {
    getAuth, signInWithPopup, GoogleAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
// import GoogleIcon from '@mui/icons-material/Google'
import { ReactComponent as GoogleIcon } from '../assets/svg/googleIcon.svg'
import Button from '@mui/material/Button'

const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()

            const result = await signInWithPopup(auth, provider)
            toast.info('Please wait...', {
                autoClose: 2000
            })
            const user = result.user

            // check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnapshot = await getDoc(docRef)

            // if user doesn't exist, create user
            if (!docSnapshot.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                    photoURL: user.photoURL
                })
            }
            // after signin
            navigate('/profile')
        } catch (error) {
            toast.error('Could not authorize with Google')
        }
    }

    return (
        <div className=" my-3">
            <p className="mt-1 mb-2 text-sm text-center">
                Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with
            </p>
            <div>
                <Button
                    sx={{ textTransform: 'none' }}
                    fullWidth
                    variant="outlined"
                    onClick={onGoogleClick}
                    startIcon={<GoogleIcon alt='google' height='20px' width='24px' />}>
                    <span className='text-gray-900'>oogle</span>
                </Button>
            </div>
        </div>
    )
}

export default OAuth;