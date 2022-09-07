import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase.config'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings'
import Skeleton from '@mui/material/Skeleton'

export default function AccountMenu({ isHome }) {

  const auth = getAuth()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'My Profile',
  })

  useEffect(() => {
    const auth = getAuth()
    const getUser = async () => {
      setLoading(true)
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)
          if (auth.currentUser) {
            const docRef = doc(db, 'users', auth.currentUser.uid)
            getDoc(docRef).then((docSnap) => {
              if (docSnap.exists()) {
                setUserInfo((prevState) => ({
                  ...prevState,
                  name: docSnap.data().name,
                  profilePic: docSnap.data().profilePic,
                }))
              }
            }).catch((err) => console.error(err))
          }

        } else {
          //console.log('user not found')
        }
      })

      setLoading(false)
    }
    getUser()
  }, [])

  const { name, profilePic } = userInfo
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  // logout
  const navigate = useNavigate()
  const onLogout = () => {
    auth.signOut()
    navigate('/sign-in')
  }

  if (loading) return (
    <Skeleton variant="circular" width={40} height={40} />
  )

  return (loggedIn ? (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {!isHome ? (
              <SettingsIcon
                alt='settings'
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar
                alt='account info'
                sx={{ width: 32, height: 32, backgroundColor: '#808080' }}
                src={profilePic ? profilePic : ''}
              />
            )}

          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar
            alt='profile'
            src={profilePic ? profilePic : null}
          />{name}
        </MenuItem>
        <MenuItem>
          <Link to={auth.currentUser && `/saved/${auth.currentUser.uid}`} className='text-inherit flex justify-center items-center gap-2'>
            <FavoriteIcon sx={{ width: 26, height: 26, color: '#707070' }} className='self-center' />Saved Listings
          </Link>
        </MenuItem>
        <Divider />
        {/* only show settings in home */}
        {!isHome ? (
          null
        ) : (
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Go to account Settings
          </MenuItem>
        )}
        <MenuItem>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          About this project
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>) : (
    null
  )
  );
}

AccountMenu.defaultProps = {
  isHome: true,
}
AccountMenu.propTypes = {
  isHome: PropTypes.bool,
}

export const AvatarNavbar = () => {

  const [profilePic, setProfilePic] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setLoggedIn(true)
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setProfilePic(docSnap.data().profilePic)
          }
        } else {
          setLoggedIn(false)
        }
      });
    }
    checkUser()
  }, [])

  return (<>{
    loggedIn ? (
      <Avatar
        sx={{ width: 24, height: 24, backgroundColor: '#808080' }}
        src={profilePic ? profilePic : ''}
      />
    ) : (
      <Avatar
        sx={{ width: 24, height: 24, backgroundColor: '#808080' }}
      />
    )
  }

  </>

  )
}
