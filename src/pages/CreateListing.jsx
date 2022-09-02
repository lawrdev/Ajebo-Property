import React, {useState, useEffect } from 'react'
import {
    getAuth, onAuthStateChanged
} from 'firebase/auth'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Loader from '../shared/Loader'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Divider from '@mui/material/Divider'


const initialFormState = {
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    // create an address variable and latitude & longitude
    address: '',
    latitude: 0,
    longitude: 0,
  }

const CreateListing = () => {
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(initialFormState)
    // for discount toggle
    const [checked, setChecked] = useState(false)

    // destructure from fromData
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
      } = formData

      const auth = getAuth()
      const navigate = useNavigate()
      
    //   TODO: replace useEffect with our useAuthStatus hook< add 'id'
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if(user) {
                setFormData({
                    // now we use the initialFormState in our useState
                    ...initialFormState,
                    userRef: user.uid,
                })
            } else {
                navigate('/sign-in')
            }
        })

        return unsubscribe
      }, [auth, navigate])


    //   on change for form elements
      const onMutate = (e) => {
        let boolean;

        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        // for files
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }

        // for text/boolean/numbers
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
      }

    //   on submit of form
      const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price needs to be less than regular price')
            return
        }

        if(images.length > 10) {
            setLoading(false)
            toast.error('Max 10 images')
            return
        }

        let geolocation = {}
        let location

        if(geolocationEnabled) {
            const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${process.env.REACT_APP_GEOAPIFY_KEY}`)

            const data = await response.json()

            console.log(data)

            // set geolocation
            geolocation.lat = 
                data.results[0]?.lat ?? 0
            geolocation.lng = 
                data.results[0]?.lon ?? 0

            // set address, but first check for invalid location
            location =
                (data.results.length == 0)
                    ? undefined
                    : data.results[0]?.formatted

            // if location is unfined
            if (location === undefined || location.includes('undefined')) {
                setLoading(false)
                toast.error('Please enter a correct address')
                return
            }

        }else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            location = address
        }

        // store image in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                // initialize storage
                const storage = getStorage()
                // create file name
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                // create a storage Ref
                const storageRef = ref(storage, 'images/' + fileName)
                // create an Upload task
                const uploadTask = uploadBytesResumable(storageRef, image)
        
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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
                          resolve(downloadURL)
                        })
                    }
                )
            })
        }
        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
          ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        // saving listing in firebase
        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp: serverTimestamp(),
          }
      
            //  clean up of the formDataCopy
          formDataCopy.location = address //incase of '.formatted' issues
          delete formDataCopy.images
          delete formDataCopy.address
          !formDataCopy.offer && delete formDataCopy.discountedPrice

            // save to database
          const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

        setLoading(false)
        toast.success('You listing has been saved!')
        // navigate to new listing
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
      }

    //   Display Spinner if loading
    if(loading) return <Loader show={loading}/>

    // Input btns
    const ariaLabel = { 'aria-label': 'description' }
    const label = { inputProps: { 'aria-label': 'checkbox' } }

    return (
        <div className='profile px-6'>
            {/* BACK BTN FOR CEATE LISTING */}
            <Button variant="text"
                onClick={() => { window.history.go(-1) }}
                size='small'
                color='black'
                sx={{ textTransform: 'none' }}
                startIcon={<ArrowBackIosIcon />}
                className='mb-3'>
                Back
            </Button>
            <header className='flex font-bold text-lg mb-4'>
                <p className='pageHeader'>
                    Create a Listing</p>
            </header>

            <main>
                <div className='px-3 py-4 shadow-md rounded-lg bg-white'>
                    
                <form onSubmit={onSubmit}>
                    {/* TYPE of listing*/}
                    <div className='mb-4'>
                        <div className='flex gap-3 w-fit mt-2 mx-auto'>
                            <Button
                                disableElevation
                                color={type === 'sale' ? 'primary' : 'common'}
                                id='type'
                                value='sale'
                                type='button'
                                onClick={onMutate}
                                sx={{
                                    textTransform: 'none', fontWeight: 600,
                                    textDecoration: (type === 'sale' ? 'none' : 'underline')
                                }}
                                variant="contained"
                            >Sell</Button>
                            <Button
                                disableElevation
                                color={type === 'rent' ? 'primary' : 'common'}
                                id='type'
                                value='rent'
                                type='button'
                                onClick={onMutate}
                                sx={{
                                    textTransform: 'none', fontWeight: 600,
                                    textDecoration: (type === 'rent' ? 'none' : 'underline')
                                }}
                                variant="contained"
                            >Rent</Button>
                        </div>
                    </div>

                    <Divider textAlign="left" role='presentation' className='mb-3 text-sm font-semibold text-gray-400'>
                        Info</Divider>

                    {/* NAME of listing */}
                    <div className='formLabel mb-2.5'>
                        <TextField
                            required
                            fullWidth
                            color='common'
                            className='formInputdev'
                            maxLength='32'
                            minLength='10'
                            type='text'
                            id='name'
                            value={name}
                            onChange={onMutate}
                            label="Name for your listing"
                            variant="outlined"

                        />
                        {/* <label className='formLabel'>
                        Provide a name for your listing
                    </label>
                    <Input
                        required
                        fullWidth
                        className='formInputdev'
                        color='common'
                        maxLength='32'
                        minLength='10'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        placeholder='Four bedroom apartment'
                        inputProps={ariaLabel} /> */}
                    </div>
                    
                    {/* ADDRESS of listing */}
                    <div className='formLabel mb-2.5'>
                        <TextField
                            fullWidth
                            required
                            color='common'
                            type='text'
                            id='address'
                            value={address}
                            onChange={onMutate}
                            label="Address"
                            variant="outlined"
                            helperText={!geolocationEnabled ? false :'Please provide a valid address (including state, country)'}

                        />
                    </div>

                    {/* manually input geolocation */}
                    {!geolocationEnabled && (
                        <div className='mt-3'>
                            <p>
                                Manually input geolocation(Optional) 
                            </p>
                            <div className='flex'>
                                <div className='mr-5'>
                                    <label className='formLabel !mt-1'>
                                        Latitude</label>
                                    <input
                                        className='w-28  rounded-md p-2'
                                        style={{
                                            borderWidth: '1px',
                                            borderColor: '#ccc'
                                        }}
                                        type='number'
                                        id='latitude'
                                        value={latitude}
                                        onChange={onMutate}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='formLabel !mt-1'>
                                        Longitude</label>
                                    <input
                                        className='w-28 rounded-md p-2'
                                        style={{
                                            borderWidth: '1px',
                                            borderColor: '#ccc'
                                        }}
                                        type='number'
                                        id='longitude'
                                        value={longitude}
                                        onChange={onMutate}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PARKING & FURNISHED */}
                    <div className='flex flex-wrap items-center'>
                        <div className='mr-3'>
                            <p className='formLabel !m-0 bold block'>
                                Parking?
                            </p>
                        </div>
                        <div>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={parking ? true : false}
                                            id='parking'
                                            value={true}
                                            onChange={onMutate}
                                        />
                                    }
                                    label="Yes" />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={(!parking && parking !== null) ? true : false}
                                            id='parking'
                                            value={false}
                                            onChange={onMutate}
                                             />
                                    }
                                    label="No" />
                            </FormGroup>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center mb-2.5'>
                        <div className='mr-3'>
                            <p className='formLabel !m-0 bold block'>
                                Furnished?
                            </p>
                        </div>
                        <div>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={furnished ? true : false}
                                            id='furnished'
                                            value={true}
                                            onChange={onMutate}
                                        />
                                    }
                                    label="Yes" />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={(!furnished && furnished !== null) ? true : false}
                                            id='furnished'
                                            value={false}
                                            onChange={onMutate}
                                             />
                                    }
                                    label="No" />
                            </FormGroup>
                        </div>
                    </div>

                    {/* BEDROOMS & BATHROOMS of listing */}
                    <div className='flex flex-wrap items-center mb-4'>
                        <div className='mr-8'>
                            <label className='formLabel'>
                                Number of Bedrooms
                            </label>
                            <div>
                                <input
                                    className='w-40 tracking-wider font-bold text-lg rounded-md p-2 focusBlack'
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#ccc'
                                    }}
                                    type='number'
                                    id='bedrooms'
                                    value={bedrooms}
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className='formLabel mb-1'>
                                Number of Bathrooms
                            </label>
                            <div>
                                <input
                                    className='w-40 tracking-wider font-bold text-lg rounded-md p-2 focusBlack'
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#ccc'
                                    }}
                                    type='number'
                                    id='bathrooms'
                                    value={bathrooms}
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Divider textAlign="left" role='presentation' className='mb-3 pt-2 text-sm font-semibold text-gray-400'>
                        Pricing</Divider>

                    {/* REGULAR PRICE for listing */}
                    <div className='mb-1'>
                       <label className='formLabel'>
                            Regular Price
                        </label>
                    <div>
                        ₦<input
                            className='w-40 tracking-wider font-bold text-lg rounded-md p-2 focusBlack'
                            style={{
                                borderWidth: '1px',
                                borderColor: '#ccc'
                            }}
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='1000'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='inline-block'>/ Night</p>}
                    </div> 
                    </div>                
                    {/* include offer? */}
                    <div className='flex flex-wrap items-center'>
                        <div className='mr-2'>
                            <p>
                                Include a discount?
                            </p>
                        </div>
                        <div>
                            <Switch
                                checked={checked}
                                id='offer'
                                value={!checked}
                                inputProps={{ 'aria-label': 'discount' }}
                                onChange={(e) => {
                                    setChecked(e.target.checked)
                                }}
                                onClick={onMutate}
                            />
                        </div>
                    </div>
                    {/* DISCOUNTED PRICE */}
                    {offer && (
                        <>
                            <label className='font-medium my-2'>
                                Discounted Price
                            </label>
                            <div>
                                ₦<input
                                    className='w-40 tracking-wider font-bold text-lg rounded-md p-2 focusBlack'
                                    style={{
                                        borderWidth: '1px',
                                        borderColor: '#ccc'
                                    }}
                                    type='number'
                                    id='discountedPrice'
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min='1000'
                                    max='750000000'
                                    required={offer}
                                />
                                {type === 'rent' && <p className='inline-block'>/ Month</p>}
                            </div>
                        </>
                    )}

                    <Divider textAlign="left" role='presentation' className='mt-4 mb-3 text-sm font-semibold text-gray-400'>
                        Images</Divider>

                    {/* Image upload */}
                    <div className='mb-12'>
                        <label className='formLabel !mt-0'>
                            Upload clear images of the property
                        </label>
                        <p className='imagesInfo'>
                            The first image will be the cover (max 10).
                        </p>
                        <div className='fileInputDiv mt-3 p-1 max-w-sm'>
                            <input
                                className='formInputFile'
                                type='file'
                                id='images'
                                onChange={onMutate}
                                max='10'
                                accept='.jpg,.png,.jpeg'
                                multiple
                                required
                            />
                        </div>
                    </div>

                    <div className='max-w-md mx-auto mb-2'>
                    <Button 
                    fullWidth
                    disableElevation
                    type='submit'
                    variant="contained"
                    >
                         Create Listing
                    </Button>
                    </div>
                </form>
                </div>
            </main>
        </div>
    );
}
 
export default CreateListing;