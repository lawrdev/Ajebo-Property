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
import Loader from '../shared/Loader'
import { moneyFormatter } from '../shared/MoneyFormatter'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'


function ExploreSlider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp'))
            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listings)
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
            <div className='block'>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                pagination={false}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
            >
                {listings.map(({ data, id }) => {
                    return (
                        <SwiperSlide
                            key={id}
                        >
                            <div
                                style={{
                                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                    padding: '140px',
                                }}
                                className="swipeSlideDiv"
                            >
                                <div 
                                className='mx-3 absolute bottom-1/4 left-0 right-0 translate-y-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-white'
                                onClick={() => navigate(`/category/${data.type}/${id}`)}
                                >
                                    <p className='inline text-sm font-semibold px-2 text-white bg-brand bg-opacity-80 rounded-lg'>
                                        {data.name}</p>
                                    <p className='w-fit px-2 rounded-lg text-sm font-medium text-white bg-slate-900 bg-opacity-80 text-ellipsis '>
                                        {data.type === 'sale' ? 'Sale - ' : 'Rent - '}
                                        {data.discountedPrice ?
                                            moneyFormatter(data.discountedPrice) :
                                            moneyFormatter(data.regularPrice)}
                                        {' '}
                                        {data.type === 'rent' ? '/month' : null}
                                        
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            </div>

            {/* Desktop swiper */}
            {/* <div className="hidden lg:block "
            style={{ background: '#f2f4f8'}}>
                <div>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                       
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                        style={{ height: '290px' }}
                    >
                        {listings.map(({ data, id }) => {
                            return (
                                <SwiperSlide
                                    key={id}
                                >
                                    <div
                                        style={{
                                            background: `url(${data.imageUrls[0]}) center no-repeat`,
                                            backgroundSize: 'cover',
                                            padding: '150px',
                                        }}
                                        className="swipeSlideDiv"
                                    >
                                        <div
                                            className='mx-3 absolute bottom-1/4 left-0 right-0 translate-y-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-white'
                                            onClick={() => navigate(`/category/${data.type}/${id}`)}
                                        >
                                            <p className='inline text-sm font-semibold px-2 text-white bg-brand bg-opacity-80 rounded-lg'>
                                                {data.name}</p>
                                            <p className='w-fit px-2 rounded-lg text-sm font-medium text-white bg-slate-900 bg-opacity-80 text-ellipsis '>
                                                {data.type === 'sale' ? 'Sale - ' : 'Rent - '}
                                                {data.discountedPrice ?
                                                    moneyFormatter(data.discountedPrice) :
                                                    moneyFormatter(data.regularPrice)}
                                                {' '}
                                                {data.type === 'rent' ? '/month' : null}

                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div> */}
            </>
        )
    )
}


export  function ExploreSliderSkeleton() {
  return (<>
   <Stack spacing={1}>
      <Skeleton variant="rectangular" width='100%' height={160} />
    </Stack>
  </>)
}


export default ExploreSlider