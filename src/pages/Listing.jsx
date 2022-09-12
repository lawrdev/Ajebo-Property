import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import { Helmet } from 'react-helmet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { moneyFormatter } from '../shared/MoneyFormatter'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined'
import IosShareIcon from '@mui/icons-material/IosShare'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { toast } from 'react-toastify'
import SaveListing from '../components/SaveListing'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { motion } from "framer-motion"

const Listing = () => {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth();

    // fetch the particular listing with a uid(we'd use our params())
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef);
            // set our listing data
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            } else if (!docSnap.exists()) {
                navigate('/')
            }
        }

        fetchListing()
    }, [navigate, params.listingId])

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

    return (
        <motion.div
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <div className="px-6 mt-3 mb-1 flex justify-between items-center">
                <Button variant="text"
                    onClick={() => { window.history.go(-1) }}
                    size='small'
                    color='black'
                    sx={{ textTransform: 'none' }}
                    startIcon={<ArrowBackIosIcon />}>
                    Back
                </Button>

                <div className='flex items-end'>
                    <div className='hover:scale-105'>
                        <Tooltip title="Copy and share">
                            <IconButton
                                aria-label="share"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                    toast.success('Link copied')
                                }}>
                                <IosShareIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    {auth.currentUser ? (
                        loading ? (null)
                            : (<>
                                <div>
                                    <SaveListing id={params.listingId} />
                                </div>
                                {auth.currentUser?.uid !== listing.userRef ? (
                                    <div className='hover:scale-105'>
                                        <Tooltip title="Contact landlord">
                                            <IconButton
                                                aria-label="contact"
                                                onClick={() => {
                                                    navigate(`/contact/${listing.userRef}?listingName=${listing.name}`)
                                                }}>
                                                <ContactPageOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                ) : null}
                            </>)
                    ) : (null)
                    }
                </div>
            </div>
            {loading ? (<ListingSkeleton />)
                : (
                    listing ? (
                        <main>
                            {/* Mobile swiper */}
                            <div className='block sm:hidden cardSlider' id='listingItemSwiper'>
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    slidesPerView={1}
                                    navigation={true}
                                    pagination={{
                                        type: "fraction",
                                    }}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    // onSlideChange={() => console.log('slide change')}
                                    style={{ height: '300px' }}
                                >
                                    {listing.imageUrls.map((url, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className='swiperSlideDiv'
                                                    style={{
                                                        background: `url(${listing.imageUrls[index]}) center no-repeat`,
                                                        backgroundSize: 'cover',
                                                    }}
                                                ></div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>

                            {/* Desktop Swiper */}
                            <div className='hidden sm:block'>
                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={20}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[Pagination]}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    // onSlideChange={() => console.log('slide change')}
                                    style={{ height: '300px' }}
                                >
                                    {listing.imageUrls.map((url, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className='swiperSlideDiv'
                                                    style={{
                                                        background: `url(${listing.imageUrls[index]}) center no-repeat`,
                                                        backgroundSize: 'cover',
                                                    }}
                                                ></div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>

                            <div className='px-6'>
                                {/* Listing Details */}
                                <div className='listingDetails'>
                                    <p className='font-semibold text-xl'>
                                        {listing.name}
                                    </p>
                                    <div className='text-sm mt-1'>
                                        <p className='inline pr-1 py-0.5 font-medium rounded-r-lg mr-1'>
                                            {listing.type === 'rent' ? <span className='text-brand inline'>
                                                For Rent</span> :
                                                <span className='text-green-400 inline'>
                                                    For Sale</span>}
                                        </p>·
                                        {listing.offer && (
                                            <p className='inline mx-1'>
                                                {moneyFormatter(listing.regularPrice - listing.discountedPrice)} discount
                                            </p >
                                        )}·
                                        <p className='inline font-medium my-1 ml-1'>
                                            {' ' + listing.location}
                                        </p>
                                    </div>

                                    <ul className='listingDetailsList mt-3'>

                                        <li className='text-sm'>{listing.parking && 'This listing has a parking spot'}</li>
                                        <li className='text-sm'>{listing.furnished && 'This listing is fully furnished'}</li>
                                        <li>
                                            <div className='text-sm flex gap-2 flex-wrap'>
                                                {listing.bedrooms > 1
                                                    ? <p>{listing.bedrooms} Bedrooms</p>
                                                    : <p>1 Bedroom</p>}

                                                {listing.bathrooms > 1
                                                    ? <p className='ml-1'>{listing.bathrooms} Bathrooms</p>
                                                    : <p>1 Bathroom</p>}
                                            </div>
                                        </li>

                                        <li className='text-sm'>
                                            {listing.offer ?
                                                <span className='line-through opacity-60 font-bold mr-1'>
                                                    {moneyFormatter(listing.regularPrice)}
                                                </span>
                                                : null}

                                            <span className='font-bold'>
                                                {listing.offer
                                                    ? moneyFormatter(listing.discountedPrice)
                                                    : moneyFormatter(listing.regularPrice)
                                                    // listing.regularPrice
                                                    //     .toString()
                                                    //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                }
                                            </span> / Night

                                        </li>
                                    </ul>

                                    <p className='font-semibold text-gray-600 text-sm mt-8 mb-1 flex items-end'>
                                        <LocationOnIcon /> <span>Location</span></p>

                                    {/*  M A P  */}
                                    <div className='leafletContainer'>
                                        <MapContainer
                                            style={{ height: '100%', width: '100%' }}
                                            // center is the lat and lng were we want to center this, i.e the geolocation
                                            center={[listing.geolocation.lat, listing.geolocation.lng]}
                                            zoom={10}
                                            scrollWheelZoom={false}
                                        >
                                            <TileLayer
                                                attribution=' &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>  contributors'
                                                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                                            />

                                            <Marker
                                                position={[listing.geolocation.lat, listing.geolocation.lng]}
                                            >
                                                <Popup>{listing.location}</Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>


                                    {/* If this listing does not belongs to current user */}
                                    {auth.currentUser?.uid !== listing.userRef ? (
                                        <div className='mt-4 w-fit mx-auto'>
                                            <Button
                                                disableElevation
                                                onClick={() => {
                                                    navigate(`/contact/${listing.userRef}?listingName=${listing.name}`)
                                                }}
                                                variant="contained"
                                                sx={{ textTransform: 'none' }}>
                                                Contact Landlord
                                            </Button>
                                        </div>
                                    ) : null}

                                </div>
                            </div>
                        </main>
                    ) : (<ListingSkeleton />)
                )}
        </motion.div>
    )
}

export const ListingSkeleton = () => {

    return (
        <div>
            <Stack className='flex-col mt-2'>
                <Skeleton variant="rectangular" width='100%' height={320} />
                <Stack spacing={1} className='my-6 flex-row gap-3'>
                    <div className='px-6 w-full'>
                        <Skeleton variant="text" sx={{ fontSize: '2rem' }} style={{ width: '100%' }} />
                    </div>
                </Stack>
            </Stack>
        </div>
    );
}

export default Listing;