import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getAuth } from 'firebase/auth'
import {
    updateDoc,
    doc,
    getDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Loader from '../shared/Loader'

function SaveListing({ id }) {

    const auth = getAuth()
    const docRef = doc(db, 'users', auth.currentUser.uid)
    const [isMember, setIsMember] = useState(false)
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const getUserInfo = async () => {
            // GET USERS DOCUMENT
            const auth = getAuth()
            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setIsMember(true)
                if (docSnap.data().savedListings) {
                    // check if saved and show icon
                    docSnap.data().savedListings.forEach(save => {
                        if (save === id) {
                            setSaved(true)
                        }
                    })
                }
            }
            setLoading(false)
        }
        getUserInfo()

    }, [id])

    const toggle = () => {
        setSaved(!saved)
    }

    const onSave = async () => {
        const docSnap = await getDoc(docRef)

        if (!docSnap.data().savedListings) {
            await updateDoc(docRef, { savedListings: [id] })
        }
        if (docSnap.data().savedListings) {
            await updateDoc(docRef, { savedListings: arrayUnion(id) })
        }
    }

    const offSave = async () => {
        const docSnap = await getDoc(docRef)

        if (docSnap.data().savedListings) {
            await updateDoc(docRef, { savedListings: arrayRemove(id) })
        }
    }

    if (loading) return <Loader show={loading} />

    return isMember ? (<div>
        <div className='hover:scale-110'>
            <Tooltip title="Save this listing">
                <div
                    onClick={toggle}
                >
                    {saved ?
                        <IconButton
                            aria-label="unsave listing"
                            onClick={offSave}
                        >
                            <FavoriteOutlinedIcon /></IconButton>
                        :
                        <IconButton
                            aria-label="save listing"
                            onClick={onSave}>
                            <FavoriteBorderOutlinedIcon /></IconButton>}
                </div>
            </Tooltip>
        </div>

    </div >) : null

}

SaveListing.propTypes = {
    id: PropTypes.string
}
export default SaveListing