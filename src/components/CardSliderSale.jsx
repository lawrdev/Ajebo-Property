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
import Loader from '../shared/Loader'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


function CardSliderSale() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp'), limit(10))
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

    

    if (loading) return <CardSliderSaleSkeleton />

    if (listings.length === 0) return <></>
    
    let saleImages = []

    if (listings && listings.length > 0) {
        
        listings.forEach(({ data:{ type, imageUrls } }) => {

            if( type === 'sale') {
                imageUrls.forEach((img) =>{
                    saleImages.push(img)
                })  
            }
        })

    }

    return (
        <div className='cardSlider rounded-3xl overflow-hidden shadow-md'>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                pagination={{
                    dynamicBullets: true,
                }}
                navigation={true}
            >
                {saleImages.map((img, index) => {

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
    )
}

export function CardSliderSaleSkeleton() {
    return (<>
        <Stack spacing={1}>
          <div className='rounded-3xl overflow-hidden'>
              <Skeleton variant="rounded" width={390} height={230} />
          </div>
        </Stack>
    </>)
  }

export default CardSliderSale
    