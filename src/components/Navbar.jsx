import {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase.config'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import ExploreIcon from '@mui/icons-material/Explore'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Avatar from '@mui/material/Avatar';
import { AvatarNavbar } from './AccountMenu';


const Navbar = () => {

    const auth = getAuth()
    const [profilePic, setProfilePic] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getUser = async () => {

            // OUT ONAUTHSTATECHANGE
            
            if (auth.currentUser) {
                const docRef = doc(db, 'users', auth.currentUser.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setProfilePic(docSnap.data().profilePic)
                }
                console.log(docSnap.data())
            }
            
        }
        getUser()
    }, [])

    useEffect(() => {
        checkTab()
    }, [])

    const [value, setValue] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()
    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
          return true
        }
    }
    const checkTab = () => {
        if(pathMatchRoute('/')) {
            setValue(0)
        }else if(pathMatchRoute('/deals')) {
            setValue(1)
        }else if(pathMatchRoute('/profile')) {
            setValue(2)
        }
    }

    return (
        <div style={{ 
            position: 'relative', 
            zIndex: '11000', 
        }}>
            <Paper sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0,
                }} 
                elevation={1}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    style={{ backgroundColor: '#f2f4f8'}}
                >
                    <BottomNavigationAction
                        className='bg-gray-900'
                        label="Explore"
                        icon={<ExploreIcon />}
                        onClick={() => navigate('/')}
                    />
                    <BottomNavigationAction
                        label="Deals"
                        icon={<LocalOfferIcon />}
                        onClick={() => navigate('/deals')}
                    />
                    <BottomNavigationAction
                        label="Profile"
                        icon={auth.currentUser ? (
                           <div>
                            <AvatarNavbar />
                        </div> 
                        ) : <AccountCircleIcon />}
                        onClick={() => navigate('/profile')}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
}
 
export default Navbar;