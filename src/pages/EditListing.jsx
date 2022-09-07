import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../shared/Spinner'
import BackBtn from '../shared/BackBtn'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

//! TODO: Apply Restriction on Geoapify API keys specific to this website after deployment

function EditListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null)
  // added images
  const [addedImages, setAddedImages] = useState([])

  let totalNumImages = (listing?.imageUrls.length + addedImages.length)

  const [checked, setChecked] = useState(false)
  // listing images user wants to delete
  const [imagesToRemove, setImagesToRemove] = useState([])

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
  });

  // Unpack FormData
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
    latitude,
    longitude,
  } = formData;

  const params = useParams()
  const auth = getAuth()
  const navigate = useNavigate()

  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You're not authorized to edit that listing");
      navigate('/');
    }
  });

  // Fetch listing to edit
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        // because we called address in our form field but location in our database
        setFormData({ ...docSnap.data(), address: docSnap.data().location });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    }
    fetchListing();
  }, [params.listingId, navigate]);


  // Sets userRef in formData userRef to logged in user's id
  useEffect(() => {
    const auth = getAuth()
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData(prevState => ({ ...prevState, userRef: user.uid }));
      } else {
        navigate('/sign-in');
      }
    })
    // prevent memory leak
    return unsub
  }, [navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Verify that discounted price is lower than regular
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted Price must be lower than Regular Price');
      return;
    }

    // // Verify Images are 10 or less
    if (totalNumImages > 10) {
      setLoading(false);
      toast.error('Images exceed 10');
    }

    // GEOCODING
    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${process.env.REACT_APP_GEOAPIFY_KEY}`)

      const data = await response.json()

      // Set geolocation if returned
      geolocation.lat =
        data.results[0]?.lat ?? 0
      geolocation.lng =
        data.results[0]?.lon ?? 0

      // If data returned results, set the address(location) to formatted address
      location =
        (data.results.length === 0)
          ? undefined
          : data.results[0]?.formatted

      // Throw error if location wasn't returned, i.e evaluates to undefined
      if (location === undefined || location.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a correct address');
        return;
      }
    } else {
      setGeolocationEnabled(false)// TODO: set up a manually config for geolocation

      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Store image in firebase function
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        // create storage reference --> pass in storage, path/filename
        const storageRef = ref(storage, 'images/' + fileName);

        // Upload the file metadata
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // const progress =
            //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                // console.log('Upload is paused');
                break;
              case 'running':
                // console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, return the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // TODO: Throw an error if new image TOTAL is not 10 or less
    const availableImageStorage =
      (listing.imageUrls.length - imagesToRemove.length) + addedImages.length
    if (availableImageStorage > 10) {
      setLoading(false);
      toast.error(
        'Image Upload failed - Too many total images for this listing'
      )
      return;
    }

    // TODO: IF new images were uploaded, Store the returned imageUrls in a new array
    let newStoredImageUrls;
    if (addedImages.length > 0) {
      newStoredImageUrls = await Promise.all(
        [...addedImages].map(({ data }) => storeImage(data))
      ).catch(() => {
        setLoading(false);
        toast.error('Images not uploaded');
        return;
      });
    }

    // TODO: Function to Delete an Image from Storage
    const deleteImage = async (imgUrl) => {
      // Split Url to get the filename in the middle
      let fileName = imgUrl.split('images%2F')
      // let fileName = imgUrl.split('/').pop()
      fileName = fileName[1].split('?alt');
      fileName = fileName[0]

      const storage = getStorage();

      // Create a reference to the file to delete
      const imgRef = ref(storage, `images/${fileName}`);

      // Returns a promise
      return deleteObject(imgRef)
    }

    //TODO: Delete each image in imagesToRemove Array, from storage
    imagesToRemove.forEach(async (imgUrl) => {
      await deleteImage(imgUrl) // Handle the returned promise
        .then(() => {
          toast.success('Image was successfully removed from storage');
        })
        .catch((error) => {
          console.log(error);
          // admin imgs deletion fail - img links
          toast.error('Deletion failed');
          setLoading(false);
        });
    });

    //TODO: Remove all imagesToRemove from current imageUrls for this listing
    const remainingListingImages = listing.imageUrls.filter(
      // if the curr listing.imageUrl's value is not in imagesToRemove array, keep it in listing.imageUrls array
      (val) => !imagesToRemove.includes(val)
    );

    //TODO: Merge ImageUrls with newStoredImageUrls (if defined) else just remainingListingImages
    let mergedImageUrls;
    if (newStoredImageUrls) {
      mergedImageUrls = [...remainingListingImages, ...newStoredImageUrls];
    } else {
      mergedImageUrls = [...remainingListingImages];
    }

    // Create a separate copy of the formData, then add/delete fields as needed to match collection keys
    const formDataCopy = {
      ...formData,
      imageUrls: mergedImageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    // Removes any leading zeros from price
    if (formDataCopy.discountedPrice) {
      formDataCopy.discountedPrice = formData.discountedPrice.toString();
    }
    formDataCopy.regularPrice = formData.regularPrice.toString();

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice; // Remove discountedPrice if no offer

    // Update in firestore
    const docRef = doc(db, 'listings', params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success('Listing successfully updated');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  // Form Data Changed
  const onMutate = (e) => {
    // let boolean = null;
    let newValue = e.target.value;

    // Edge Cases to prevent booleans from converting to strings
    if (e.target.value === 'true') {
      newValue = true;
    }
    if (e.target.value === 'false') {
      newValue = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
      displayAddedImgs(e.target.files)
    }

    // All other
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: newValue,
      }));
    }
  }

  // TODO: add images and display it
  const displayAddedImgs = (files) => {

    const selectedImages = Array.from(files)

    // create url for each file and store in an array
    const imagesArray = selectedImages.map(img => ({
      data: img,
      url: URL.createObjectURL(img)
    }))

    // in background addedImages will be set to current imagesArray not in UI and on each rerender will show prevState in console if logged
    // setAddedImages(imagesArray)
    // console.log('added images are', addedImages)

    // to have previous images still shown when adding newer images
    setAddedImages((prevState) => prevState.concat(imagesArray))

  }

  // TODO: set images to remove using checkbox
  const handleChange = (e) => {
    if (e.target.checked) {
      // Case 1 : The user checks the box
      setImagesToRemove([...imagesToRemove, e.target.value])
      // were e.target.value] is the file url, from listings.ImageUrls
    } else {
      // Case 2  : The user unchecks the box
      setImagesToRemove((current) =>
        current.filter((url) => {
          return url !== e.target.value;
        })
      );
    }
  };

  if (loading) return <Spinner />

  return (
    <div className="profile">
      <div className="px-6">
        <BackBtn />
        <header className='flex font-bold text-lg mb-4'>
          <p className='pageHeader'>
            Edit Listing</p>
        </header>
      </div>

      <main className='px-2'>
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

            <Divider textAlign="left" role='presentation' className='mb-4 text-sm font-semibold text-gray-400'>
              Info</Divider>

            {/* NAME of listing */}
            <div className='mb-3'>
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
            </div>

            {/* ADDRESS of listing */}
            <div className='mb-3'>
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
              />
              <p className='text-xs opacity-50'>
                Please provide a valid address (including state, country)</p>
            </div>

            {/* manually input geolocation */}
            {!geolocationEnabled && (
              <div className='mt-3'>
                <p>
                  Manually input geolocation(Optional)
                </p>
                <div className='flex'>
                  <div className='mr-5'>
                    <label className='mb-1 !mt-1'>
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
                    <label className='mb-1 !mt-1'>
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
            <div className='flex flex-wrap items-center font-medium'>
              <div className='mr-3'>
                <p className='mb-1 !m-0 bold block'>
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
                        size="small"
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
                        size="small"
                      />
                    }
                    label="No" />
                </FormGroup>
              </div>
            </div>

            <div className='flex flex-wrap items-center font-medium mb-2.5'>
              <div className='mr-3'>
                <p className='mb-1 !m-0 bold block'>
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
                        size="small"
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
                        size="small"
                      />
                    }
                    label="No" />
                </FormGroup>
              </div>
            </div>

            {/* BEDROOMS & BATHROOMS of listing */}
            <div className='flex flex-wrap items-center font-medium mb-4'>
              <div className='mr-8'>
                <label className='mb-1'>
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
                <label className='mb-1'>
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
            <div className='font-medium'>
              <label className='mb-1'>
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
                {type === 'rent' && <p className='inline-block ml-1'>/ Night</p>}
              </div>
            </div>
            {/* include offer? */}
            <div className='flex flex-wrap items-center'>
              <div className='mr-2'>
                <p className='inline-block text-xs opacity-50'>
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
                  size='small'
                />
              </div>
            </div>
            {/* DISCOUNTED PRICE */}
            {offer && (
              <>
                <label className='font-medium mt-2 mb-1'>
                  Discounted Price
                </label>
                <div className='font-medium'>
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
                  {type === 'rent' && <p className='inline-block ml-1'>/ Month</p>}
                </div>
              </>
            )}

            <Divider textAlign="left" role='presentation' className='mt-4 mb-3 text-sm font-semibold text-gray-400'>
              Images</Divider>

            {/* <label className="formLabel">Parking spot</label>
            <div className="formButtons">
              <button
                className={parking ? 'formButtonActive' : 'formButton'}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={
                  !parking && parking !== null ? 'formButtonActive' : 'formButton'
                }
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="formLabel">Furnished</label>
            <div className="formButtons">
              <button
                className={furnished ? 'formButtonActive' : 'formButton'}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !furnished && furnished !== null
                    ? 'formButtonActive'
                    : 'formButton'
                }
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div> */}

            {/* {!geolocationEnabled && (
              <div className="formLatLng flex">
                <div>
                  <label className="formLabel">Latitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="latitude"
                    value={latitude}
                    onChange={onMutate}
                    required
                  />
                </div>
                <div>
                  <label className="formLabel">Longitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="longitude"
                    value={longitude}
                    onChange={onMutate}
                    required
                  />
                </div>
              </div>
            )} */}

            {/* <label className="formLabel">Offer</label>
            <div className="formButtons">
              <button
                className={offer ? 'formButtonActive' : 'formButton'}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null ? 'formButtonActive' : 'formButton'
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div> */}

            {/* <label className="formLabel">Regular Price</label>
            <div className="formPriceDiv">
              <input
                className="formInputSmall"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === 'rent' && <p className="formPriceText">$ / Month</p>}
            </div>

            {offer && (
              <>
                <label className="formLabel">Discounted Price</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
              </>
            )} */}

            {/* TODO: Display Current Images (Noting Cover) with Delete Buttons --> Then display "Add Image" Option */}
            <div className='mb-12'>
              <label className='font-medium mb-3 !mt-0'>
                Add or remove listing Images
              </label>
              <p className='text-xs font-medium opacity-50 mb-2'>
                DELETE: check the box of each image you wish to delete
              </p>
              <div className='mb-3'>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 3, sm: 8, md: 12 }}>
                    {listing?.imageUrls &&
                      listing.imageUrls.map((img, index) => (
                        <Grid item xs={3} sm={4} md={4} key={index}>
                          <div
                            className="editListingImg overflow-hidden max-w-sm mx-auto"
                            style={{
                              background: `url(${img}) center no-repeat`,
                              backgroundSize: 'cover',
                            }}
                          >
                            {index === 0 && <p
                              className='w-fit bg-brand text-white px-2.5 py-1 absolute top-2 right-2 rounded-lg text-xs font-semibold'>Cover</p>}
                            <input
                              type="checkbox"
                              id="imageDelete"
                              name="imageDelete"
                              value={img}
                              onChange={handleChange}
                              className='checkedImg absolute bottom-2 right-2 w-5 h-5'
                            />
                          </div>
                        </Grid>
                      ))}
                    {addedImages && addedImages.map((obj, index) => (
                      <Grid item xs={3} sm={4} md={4} key={index}>
                        <div
                          className="editListingImg overflow-hidden max-w-sm mx-auto"
                        >
                          <img
                            alt='listings piccc'
                            src={obj.url}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: 'cover',
                            }}
                          />
                          <p
                            className='w-fit bg-gray-700 text-white px-2.5 py-1 absolute top-2 left-2 rounded-lg text-xs font-semibold'>Added</p>
                          <div className='w-fit absolute top-0 right-0'>
                            <IconButton
                              aria-label="delete"
                              // to delete selected images on click
                              onClick={() => {
                                setAddedImages(addedImages.filter(({ url }) => url !== obj.url))
                              }}
                            >
                              <RemoveCircleIcon className='text-red-500' />
                            </IconButton></div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </div>
              {/* Displays the number of remaining spots available after checked images are deleted */}
              <p className='text-xs font-medium opacity-50 mb-3'>
                ADD: Choose files to add. (Max 10 total)
              </p>
              <div className='mt-2'>
                <Button
                  disabled={totalNumImages > 10}
                  disableElevation
                  variant='outlined'
                  size='small'
                  component="label"
                  sx={{ textTransform: 'none' }}
                >
                  <PhotoCamera sx={{ mr: 1 }} />
                  {totalNumImages > 10 ? (
                    `Remove ` + (totalNumImages - 10) + ' '
                  ) : (
                    `Add ` + (10 - totalNumImages) + ' '
                  )}
                  image{(10 - totalNumImages === 1) || (totalNumImages - 10 === 1) ? '' : 's'}
                  <input
                    hidden
                    accept="image/*"
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='10'
                    multiple
                  />
                </Button>
              </div>
            </div>

            <div className='max-w-md mx-auto mb-2'>
              <Button
                fullWidth
                disableElevation
                type='submit'
                variant="contained"
                onClick={onSubmit}
              >
                Update Listing
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditListing;