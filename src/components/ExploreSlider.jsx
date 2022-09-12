import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'
import { moneyFormatter } from '../shared/MoneyFormatter'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Rating from '@mui/material/Rating';


function ExploreSlider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp'))
            const querySnap = await getDocs(q)

            let listingsArr = []

            querySnap.forEach((doc) => {
                return listingsArr.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            listingsArr.forEach(({ data, id }) => {
                if (id === 'N7MvqkRZowG8OP5e9Z80') {
                    setListings({ data, id })
                }
            })
            // setListings(listings)
            // console.log(listings)
            setLoading(false)
        }

        fetchListings()
    }, [])

    if (loading) return <ExploreSliderSkeleton />

    if (listings.length === 0) return <></>

    return (
        listings && (
            <>
                {/* Mobile swiper */}
                <div className='block sm:hidden cardSlider relative overflow-hidden rounded-xl'>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        slidesPerView={"auto"}
                        spaceBetween={28}
                        pagination={false}
                        navigation={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                    >
                        {listings.data.imageUrls.map((img, index) => {
                            return (
                                <SwiperSlide
                                    key={index}
                                    className='overflow-hidden'
                                >
                                    <div
                                        style={{
                                            background: `url(${img}) center no-repeat`,
                                            backgroundSize: 'cover',
                                            padding: '140px',
                                        }}
                                        className="swipeSlideDiv cardZoom duration-700"
                                    >

                                    </div>
                                </SwiperSlide>
                            )

                        })}
                    </Swiper>
                    <div className='absolute z-50 top-0 left-0 right-0 mx-3 mt-3 cursor-pointer flex justify-between items-center'>
                        <div className='font-semibold text-sm tracking-wide 
                                 bg-slate-50 text-slate-900 px-2 py-1 rounded w-fit'>
                            Featured Listing
                        </div>
                        <div className='bg-slate-900 bg-opacity-50 px-2 py-1 rounded w-fit flex items-center'>
                            <Rating name="rating" value={5} size='small' />
                        </div>
                    </div>
                    <div className='mx-3 absolute z-50 bottom-1/4 left-0 right-0 translate-y-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-white'
                        onClick={() => navigate(`/category/${listings.data.type}/${listings.id}`)}
                    >
                        <p className='inline text-sm font-semibold px-2 text-white bg-brand bg-opacity-80 rounded-lg'>
                            {listings.data.name}</p>
                        <p className='w-fit px-2 rounded-lg text-sm font-medium text-white bg-slate-900 bg-opacity-80 text-ellipsis '>
                            {listings.data.type === 'sale' ? 'Sale - ' : 'Rent - '}
                            {listings.data.discountedPrice ?
                                moneyFormatter(listings.data.discountedPrice) :
                                moneyFormatter(listings.data.regularPrice)}
                            {' '}
                            {listings.data.type === 'rent' ? '/month' : null}

                        </p>
                    </div>
                </div>

                {/* Desktop swiper */}
                <div className='hidden sm:block relative overflow-hidden rounded-xl'>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        slidesPerView={3}
                        spaceBetween={6}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                    >
                        {listings.data.imageUrls.map((img, index) => {
                            return (
                                <SwiperSlide
                                    key={index}
                                    className='overflow-hidden'
                                >
                                    <div
                                        style={{
                                            background: `url(${img}) center no-repeat`,
                                            backgroundSize: 'cover',
                                            padding: '140px',
                                        }}
                                        className="swipeSlideDiv cardZoom duration-700"
                                    >

                                    </div>
                                </SwiperSlide>
                            )

                        })}
                    </Swiper>
                    <div className='absolute z-50 top-0 left-0 right-0 mx-3 mt-3 cursor-pointer flex justify-between items-center'>
                        <div className='font-semibold text-sm tracking-wide 
                                 bg-slate-50 text-slate-900 px-2 py-1 rounded w-fit'>
                            Featured Listing
                        </div>
                        <div className='bg-slate-900 bg-opacity-50 px-2 py-1 rounded w-fit flex items-center'>
                            <Rating name="rating" value={5} size='small' />
                        </div>
                    </div>
                    <div className='mx-3 absolute z-50 bottom-1/4 left-0 right-0 translate-y-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-white'
                        onClick={() => navigate(`/category/${listings.data.type}/${listings.id}`)}
                    >
                        <p className='inline text-sm font-semibold px-2 text-white bg-brand bg-opacity-80 rounded-lg'>
                            {listings.data.name}</p>
                        <p className='w-fit px-2 rounded-lg text-sm font-medium text-white bg-slate-900 bg-opacity-80 text-ellipsis '>
                            {listings.data.type === 'sale' ? 'Sale - ' : 'Rent - '}
                            {listings.data.discountedPrice ?
                                moneyFormatter(listings.data.discountedPrice) :
                                moneyFormatter(listings.data.regularPrice)}
                            {' '}
                            {listings.data.type === 'rent' ? '/month' : null}

                        </p>
                    </div>
                </div>




            </>
        )
    )
}


export function ExploreSliderSkeleton() {
    return (<>
        <Stack spacing={1}>
            <Skeleton variant="rectangular" width='100%' height={280} />
        </Stack>
    </>)
}


export default ExploreSlider