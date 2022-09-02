import {useLocation, useNavigate} from 'react-router-dom'
import {
    getAuth, signInWithPopup, GoogleAuthProvider
} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
// import GoogleIcon from '@mui/icons-material/Google'
import { ReactComponent as GoogleIcon } from '../assets/svg/googleIcon.svg'
import IconButton from '@mui/material/IconButton';

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
            if(!docSnapshot.exists()) {
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
        <div className="w-fit mx-auto flex flex-col justify-center items-center my-3">
            <p className="mt-1 mb-2 text-sm">
                Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with
            </p>
            <IconButton 
            fullWidth
            variant="text"
            aria-label="google"
            onClick={onGoogleClick}
            className="w-12 h-12 app-bg">
                <GoogleIcon alt='google' width='100%' height='100%'/>
            </IconButton>
        </div>
    )
}
 
export default OAuth;