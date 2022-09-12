import { useState, useEffect } from 'react'
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


function CardSliderRent() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', "desc"), limit(10))
            const querySnap = await getDocs(q)

            let listingsArr = []

            querySnap.forEach((doc) => {
                return listingsArr.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings(listingsArr)
            setLoading(false)
        }
        fetchListings()
    }, [])

    if (loading) return <CardSliderRentSkeleton />

    if (listings.length === 0) return <></>

    let rentImages = []

    if (listings && listings.length > 0) {

        listings.forEach(({ data: { type, imageUrls } }) => {
            if (type === 'rent') {
                rentImages.push(imageUrls[0])
            }
        })

    }

    return (
        <div className='cardSlider rounded-xl overflow-hidden shadow-md'>
            <div className=''>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    slidesPerView={1}
                    pagination={{
                        dynamicBullets: true,
                    }}
                    navigation={true}
                >
                    {rentImages.map((img, index) => {

                        return (
                            <SwiperSlide
                                key={index}
                                className='overflow-hidden'
                            >
                                <div
                                    style={{
                                        background: `url(${img}) center no-repeat`,
                                        backgroundSize: 'cover'
                                    }}
                                    className='p-28 cardZoom duration-700'
                                >
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    )
}


export function CardSliderRentSkeleton() {
    return (<>
        <Stack spacing={1}>
            <div className='rounded-xl overflow-hidden'>
                <Skeleton variant="rounded" width={390} height={230} />
            </div>
        </Stack>
    </>)
}


export default CardSliderRent
