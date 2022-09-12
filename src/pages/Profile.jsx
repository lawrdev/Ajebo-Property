import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    getAuth, onAuthStateChanged, updateProfile, updateEmail,
} from 'firebase/auth'
import {
    updateDoc,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from 'firebase/firestore'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import { db } from '../firebase.config'
import ListingItem, { ListingItemSkeleton } from '../components/ListingItem'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
// import { v4 as uuidv4 } from 'uuid'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import HomeIcon from '@mui/icons-material/Home'
import CircularProgress from '@mui/material/CircularProgress'
import AccountMenu from '../components/AccountMenu'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import { motion } from 'framer-motion';

const Profile = () => {
    const auth = getAuth()
    const [loading, setLoading] = useState(false)
    const [dpLoading, setDpLoading] = useState(false)
    const [listings, setListings] = useState(null)
    const [edit, setEdit] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profilePic: '',
    })
    const [uploadProgress, setUploadProgress] = useState(0)

    // destructure out name and email from formData
    const { name, email, profilePic } = formData
    // for cancelling edit
    const [formDataCopy, setFormDataCopy] = useState({})

    const navigate = useNavigate()

    // get user info
    useEffect(() => {
        setLoading(true)
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                const getUserInfo = async () => {
                    // GET USERS DOCUMENT
                    const docRef = doc(db, "users", uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setFormData((prevState) => ({
                            ...prevState,
                            name: docSnap.data().name,
                            email: docSnap.data().email,
                            profilePic: docSnap.data().profilePic,
                        }))
                    }
                    // get listings for particular user
                    const listingsRef = collection(db, 'listings')
                    const q = query(
                        listingsRef,
                        where('userRef', '==', uid),
                        orderBy('timestamp', 'desc')
                    )
                    const querySnap = await getDocs(q)
                    let listings = []
                    querySnap.forEach((doc) => {
                        return listings.push({
                            id: doc.id,
                            data: doc.data(),
                        })
                    })
                    setListings(listings)

                    setLoading(false);
                }
                getUserInfo()
            } else {
                setLoading(false)
                navigate('/sign-in')
            }
        })

        return unsub;
    }, [navigate])

    const onSubmit = () => {
        const hasNameChanged = auth.currentUser.displayName !== name
        const hasEmailChanged = auth.currentUser.email !== email

        const userRef = doc(db, 'users', auth.currentUser.uid)
        try {
            if (hasNameChanged) {
                updateProfile(auth.currentUser, { displayName: name })
                updateDoc(userRef, { name })
            }
            if (hasEmailChanged) {
                updateEmail(auth.currentUser, email)
                updateDoc(userRef, { email })
            }
            toast.success(`Success!`)

        } catch (error) {
            console.log(error)
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const editDetails = () => {
        onSubmit();
        setEdit(false);
    }

    const cancelEdit = () => {
        const { name, email } = formDataCopy
        formData.name = name
        formData.email = email
    }

    const onDelete = async (listingId) => {
        // TODO: custom popup
        if (window.confirm('Are you sure you want to delete?')) {
            // this just deletes it from firebase
            await deleteDoc(doc(db, 'listings', listingId))
            // to show updated doc i.e remove it from the UI too
            const updatedListings = listings.filter(
                (listing) => listing.id !== listingId
            )
            setListings(updatedListings)
            toast.success('Successfully deleted listing')
        }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    // Upload profile photo
    const handleProfilePic = (e) => {
        if (e.target.files) {
            let initialProfilePic = e.target.files; // an array

            // delete prev profile pic from storage
            if (profilePic) {
                const deleteImg = async () => {
                    const storage = getStorage()
                    // Create a reference to the file to delete
                    const imgRef = ref(storage, `images/dp/${auth.currentUser.uid}-profilepicture`)
                    // Delete the file
                    deleteObject(imgRef).then(() => {
                        // File deleted successfully
                    }).catch((error) => {
                        console.log(error)
                    });
                }
                deleteImg()
            }

            // store image in firebase and return a download url
            const storeImage = async (image) => {
                setDpLoading(true)
                return new Promise((resolve, reject) => {
                    // initialize storage
                    const storage = getStorage()
                    // create file name
                    const fileName = `${auth.currentUser.uid}-profilepicture`
                    // create a storage Ref
                    const storageRef = ref(storage, 'images/dp/' + fileName)
                    // create an Upload task
                    const uploadTask = uploadBytesResumable(storageRef, image)

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            // TODO : set spinner off when upload is 100%
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            setUploadProgress(progress)
                            console.log('Upload is ' + progress + '% done')
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused')
                                    break
                                case 'running':
                                    console.log('Upload is running')
                                    break
                                default:
                                    break
                            }

                        },
                        (error) => {
                            reject(error)
                        },
                        () => {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                // this will then return a download link for img we can use for profilePic
                                resolve(downloadURL)
                            })
                        }
                    )
                })
            }
            let profilePicUrl;
            const getUrl = async () => {
                profilePicUrl = await storeImage(initialProfilePic[0])
                    .catch(() => {
                        setLoading(false)
                        toast.error('Profile picture not updated')
                        return
                    })

                // saving to database   
                const formDataWithUrl = {
                    ...formData,
                    profilePic: profilePicUrl,
                }
                delete formDataWithUrl.initialProfilePic;

                // Update in firestore
                const docRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(docRef, formDataWithUrl);

                //set new profile picture
                setFormData((prevState) => ({
                    ...prevState,
                    profilePic: profilePicUrl
                }))
                setDpLoading(false)
            }
            getUrl()

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

    if (loading) return <ProfileSkeletun />

    return (
        <motion.div className='profile px-6'
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <div>
                <header className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>
                        My Profile</h2>
                    <div>
                        <AccountMenu isHome={false} />
                    </div>
                </header>

                <main>
                    <div className='my-8 w-fit mx-auto relative rounded-full'
                        style={{ width: 140, height: 140 }}>
                        {dpLoading ? (
                            <div className='w-full h-full bg-gray-700 bg-opacity-70 absolute z-10 top-0 bottom-0 right-0 left-0 rounded-full flex items-center justify-center'>
                                <CircularProgress
                                    color='secondary'
                                    variant="determinate"
                                    value={uploadProgress}
                                />
                            </div>
                        )
                            : null}
                        <Avatar
                            alt="avatar"
                            sx={{ width: 140, height: 140 }}
                            src={profilePic}
                        />
                        <div
                            className='absolute bottom-0 right-0 z-20 -translate-x-1/4 cursor-pointer bg-gray-600 active:scale-105 rounded-pill overflow-hidden'
                        >
                            <IconButton
                                color="primary"
                                aria-label="upload profile picture" component="label">
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    max={1}
                                    onChange={handleProfilePic}
                                />
                                <PhotoCamera color='white' />
                            </IconButton>
                        </div>
                    </div>
                    <Card variant='outlined'>
                        <CardContent>
                            <div className='flex justify-between items-center'>
                                <p className='font-semibold'>
                                    Personal Details</p>
                                <div
                                    onClick={() => {
                                        // edit && onSubmit();
                                        setEdit((prevState) => !prevState);
                                        setFormDataCopy({ ...formData });
                                    }}>
                                    <Button
                                        variant='text'
                                        size='small'
                                        sx={{
                                            textTransform: 'none',
                                            color: '#000',
                                            fontWeight: 'bold'
                                        }}
                                        startIcon={<EditIcon />}>
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            <div className='mt-3'>
                                <form onSubmit={editDetails}>
                                    <TextField
                                        fullWidth
                                        disabled={!edit}
                                        value={name}
                                        onChange={onChange}
                                        type='text'
                                        id='name'
                                        label='Full name'
                                        variant='standard' />

                                    <TextField
                                        sx={{
                                            mt: '1rem'
                                        }}
                                        fullWidth
                                        disabled={!edit}
                                        value={email}
                                        onChange={onChange}
                                        type='email'
                                        id='email'
                                        label='Email Address'
                                        variant='standard' />

                                    {edit ?
                                        <div className='mt-3 flex justify-end'>
                                            <Stack spacing={2} direction="row">
                                                <Button
                                                    disableElevation
                                                    sx={{ textTransform: 'none' }}
                                                    size='small'
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setEdit(false)
                                                        cancelEdit()
                                                    }}>
                                                    Cancel</Button>
                                                <Button
                                                    disableElevation
                                                    sx={{ textTransform: 'none' }}
                                                    size='small'
                                                    variant="contained"
                                                    type='submit'
                                                    onClick={editDetails}
                                                >
                                                    Submit</Button>
                                            </Stack>
                                        </div> : null}
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    {/* create listing */}
                    <div className=" mt-4 mb-10">
                        <Link
                            to='/create-listing'
                            className='createListing shadow-sm'>
                            <HomeIcon />
                            <p>
                                Rent or sell a property
                            </p>
                            <KeyboardArrowRightIcon />
                        </Link>
                    </div>

                    {!loading && listings?.length > 0 && (
                        <>
                            <Divider textAlign="left" role='presentation' className='text-sm font-semibold text-gray-400'>Your Listings</Divider>
                            <ul className='listingsList mt-4'>
                                {listings.map((listing) => (
                                    <ListingItem
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                        onDelete={() => onDelete(listing.id)}
                                        onEdit={() => onEdit(listing.id)}
                                    />
                                ))}
                            </ul>
                        </>
                    )}
                </main>

            </div>
        </motion.div>
    );
}


export function ProfileSkeletun() {

    const pageAnimate = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                delay: .1, duration: 1
            }
        },
        exit: {
            x: '-100vw',
            opacity: 0,
            transition: { ease: 'easeInOut' }
        }
    }

    return (<>
        <motion.div className='px-6'
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'>
            <div className="mt-6">
                <Stack spacing={3}>
                    <Stack className='flex-row justify-between items-center'>
                        <h2 className='font-bold text-lg'>
                            My Profile</h2>
                        <Skeleton variant="circular" width={38} height={38} />
                    </Stack>
                    <Stack className="flex-row justify-center py-2">
                        <Skeleton variant="circular" width={160} height={160} />
                    </Stack>
                    <Stack>
                        <Skeleton variant="rounded" width='100%' height={260} />
                    </Stack>
                    <div className=" my-4">
                        <Link
                            to='/create-listing'
                            className='createListing shadow-sm'>
                            <HomeIcon />
                            <p>
                                Rent or sell your home
                            </p>
                            <KeyboardArrowRightIcon />
                        </Link>
                    </div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
                </Stack>
            </div>
            <ListingItemSkeleton />
        </motion.div>
    </>)
}


export default Profile;