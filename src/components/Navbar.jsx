import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import ExploreIcon from '@mui/icons-material/Explore'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { AvatarNavbar } from './AccountMenu';


const Navbar = () => {

    const [value, setValue] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        // check which tab user is on
        const pathMatchRoute = (route) => {
            if (route === location.pathname) {
                return true
            }
        }
        const checkTab = () => {
            if (pathMatchRoute('/')) {
                setValue(0)
            } else if (pathMatchRoute('/deals')) {
                setValue(1)
            } else if (pathMatchRoute('/profile')) {
                setValue(2)
            }
        }
        checkTab()
    }, [location.pathname])

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
                    style={{ backgroundColor: '#f2f4f8' }}
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
                        icon={<AvatarNavbar />}
                        onClick={() => navigate('/profile')}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
}

export default Navbar;