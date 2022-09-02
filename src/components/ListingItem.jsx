import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Tooltip from '@mui/material/Tooltip'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import KingBedIcon from '@mui/icons-material/KingBed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import { moneyFormatter } from '../shared/MoneyFormatter'

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y'

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
      <li className='mb-8 w-full rounded-2xl bg-white overflow:hidden'>

        {/* Mobile view */}
        <div className='block sm:hidden max-w-lg shadow-sm hover:!shadow-lg duration-700 p-2 overflow:hidden' style={{outline: '1px solid #eee'}}>
            <div className=''>
                {/* Swiper */}
                <div className='cardSlider rounded-3xl overflow-hidden w-full'
                    id='listingItemSwiper'>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        slidesPerView={1}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        navigation={true}
                    >
                        {listing.imageUrls.map((img, index) => {
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
                                        className='p-32 cardZoom duration-700'
                                    >
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>

                {/* Info */}
                <div>
                    <div className='mt-2 listingItemCard w-full'>
                        <Link
                            to={`/category/${listing.type}/${id}`}
                            className='categoryListingLink' >
                            <div className='overflow-hidden text-ellipsis whitespace-nowrap mb-2'>
                                <p className='font-bold text-lg locationName inline'>
                                    {listing.name}
                                </p>
                            </div>
                            <p className='text-xs font-medium pb-1 flex gap-1 items-end'>
                                <LocationOnIcon fontSize='small' />{listing.location}
                            </p>

                            <div className='text-xs font-medium flex gap-2'>
                                <div className='flex items-center flex-wrap'>
                                    <KingBedIcon
                                        aria-label='bed'
                                        sx={{
                                            width: '20px'
                                        }}
                                    />
                                    <p className=''>
                                        {listing.bedrooms > 1
                                            ? `${listing.bedrooms} Bedrooms`
                                            : '1 Bedroom'}
                                    </p>
                                </div>
                                <div className='flex items-center flex-wrap'>
                                    <BathtubIcon
                                        aria-label='bath'
                                        sx={{
                                            width: '20px'
                                        }}
                                    />
                                    <p className=''>
                                        {listing.bathrooms > 1
                                            ? `${listing.bathrooms} Bathrooms`
                                            : '1 Bathroom'}
                                    </p>
                                </div>
                            </div>

                            <div className='flex justify-between items-center'>
                                <p className='text-lg font-bold py-2'
                                    style={{ color: '#e74c3c' }}>
                                    {listing.offer
                                        ? moneyFormatter(listing.discountedPrice)
                                        : moneyFormatter(listing.regularPrice)
                                    }
                                    {listing.type === 'rent' && ' / Night'}
                                </p>
                                <div>
                                    {onEdit ?
                                        <Tooltip title="Edit this listing">
                                            <IconButton aria-label="edit"
                                            onClick={() => onEdit(id)}>
                                                <EditIcon
                                                    fontSize='small'
                                                    
                                                /></IconButton></Tooltip>
                                        : null}
                                    {onDelete ? (
                                        <Tooltip title="Delete this listing">
                                            <IconButton aria-label="delete"
                                            onClick={() => onDelete(listing.id, listing.name)}>
                                                <DeleteIcon
                                                    fontSize='small'
                                                    
                                                /></IconButton></Tooltip>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Desktop View */}
        <div className='hidden sm:flex gap-3 flex-col sm:flex-row p-2 rounded-xl shadow-sm hover:!shadow-lg duration-700' style={{outline: '1px solid #eee'}}>
            <div>
                <div className='flex justify-center items-center'>
                    <div className='cardSlider rounded-3xl overflow-hidden shadow-md w-60'
                        id='listingItemSwiper'>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                            slidesPerView={1}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            navigation={true}
                        >
                            {listing.imageUrls.map((img, index) => {

                                return (
                                    <SwiperSlide
                                        key={index}
                                    >
                                        <div
                                            style={{
                                                background: `url(${img}) center no-repeat`,
                                                backgroundSize: 'cover'
                                            }}
                                            className='p-20'
                                        >
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
            <div className='grow overflow-hidden'>
                <div className='h-full flex justify-center items-center max-w-3xl rounded-r-3xl shadow-md'>
                    {/* listing info card */}
                    <div className='listingItemCard px-4 w-full'>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs font-medium pb-1 flex gap-1 items-end'>
                                <LocationOnIcon fontSize='small' />{listing.location}
                            </p>
                            <div>
                                {onEdit ?
                                    <Tooltip title="Edit this listing">
                                        <IconButton aria-label="edit"
                                        onClick={() => onEdit(id)}>
                                            <EditIcon
                                                fontSize='small'
                                                
                                            /></IconButton></Tooltip>
                                    : null}
                                {onDelete ? (
                                    <Tooltip title="Delete this listing">
                                        <IconButton aria-label="delete"
                                        onClick={() => onDelete(listing.id, listing.name)}>
                                            <DeleteIcon
                                                fontSize='small'
                                                
                                            /></IconButton></Tooltip>
                                ) : null}
                            </div>
                        </div>
                        <Link
                            to={`/category/${listing.type}/${id}`}
                            className='categoryListingLink' >

                            <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                <p className='font-bold text-lg mb-1 locationName inline'>
                                    {listing.name}
                                </p></div>
                            <p className='text-lg font-bold mb-2'
                                style={{ color: '#e74c3c' }}>
                                {listing.offer
                                    ? moneyFormatter(listing.discountedPrice)
                                    // listing.discountedPrice
                                    //     .toString()
                                    //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : moneyFormatter(listing.regularPrice)
                                }
                                {listing.type === 'rent' && ' / Night'}
                            </p>
                            <div className='text-xs font-medium flex gap-2'>
                                <div className='flex items-center flex-wrap'>
                                    <KingBedIcon
                                        aria-label='bed'
                                        sx={{
                                            width: '20px'
                                        }}
                                    />
                                    <p className=''>
                                        {listing.bedrooms > 1
                                            ? `${listing.bedrooms} Bedrooms`
                                            : '1 Bedroom'}
                                    </p>
                                </div>
                                <div className='flex items-center flex-wrap'>
                                    <BathtubIcon
                                        aria-label='bath'
                                        sx={{
                                            width: '20px'
                                        }}
                                    />
                                    <p className=''>
                                        {listing.bathrooms > 1
                                            ? `${listing.bathrooms} Bathrooms`
                                            : '1 Bathroom'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </li>
  )
}

ListingItem.propTypes = {
    id: PropTypes.string,
    listing: PropTypes.object,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
} 

export function ListingItemSkeleton() {
  return (
      <>
          <div className="hidden sm:block">
              <Stack className='flex-col'>
                  <Stack spacing={1} className='my-6 flex-row gap-3'>
                      <div className='rounded-3xl overflow-hidden'>
                          <Skeleton variant="rounded" width={280} height={142} />
                      </div>
                      <Stack spacing={1} className='w-full flex-col'>
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: 144 }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '80%' }} />
                      </Stack>


                  </Stack>
                  <Stack spacing={1} className='my-6 flex-row gap-3'>
                      <div className='rounded-3xl overflow-hidden'>
                          <Skeleton variant="rounded" width={280} height={142} />
                      </div>
                      <Stack spacing={1} className='w-full flex-col'>
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: 144 }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '80%' }} />
                      </Stack>


                  </Stack>
              </Stack>
          </div>
          <div className='block sm:hidden'>
              <Stack className='flex-col'>
                  <Stack spacing={1} className='my-6 flex-col gap-3'>
                      <div>
                          <Skeleton variant="rounded" width='100%' height={142} className='rounded-2xl' />
                      </div>
                      <Stack spacing={1} className='w-full flex-col'>
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '90%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '70%' }} />
                      </Stack>


                  </Stack>
                  <Stack spacing={1} className='my-6 flex-col gap-3'>
                      <div>
                          <Skeleton variant="rounded" width='100%' height={142} className='rounded-2xl' />
                      </div>
                      <Stack spacing={1} className='w-full flex-col'>
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '90%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '100%' }} />
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} style={{ width: '70%' }} />
                      </Stack>


                  </Stack>
              </Stack>
          </div>
      </>
  )
}


export default ListingItem