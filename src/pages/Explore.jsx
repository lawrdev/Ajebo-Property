import { Link } from 'react-router-dom'
import ExploreSlider from '../components/ExploreSlider'
import Stack from '@mui/material/Stack'
import CardSliderRent from '../components/CardSliderRent'
import HotelIcon from '@mui/icons-material/Hotel'
import HouseIcon from '@mui/icons-material/House';
import CardSliderSale from '../components/CardSliderSale'
import ExploreMap from '../components/ExploreMap';
import AccountMenu from '../components/AccountMenu'
import Divider from '@mui/material/Divider'
import Navbar from '../components/Navbar';
import IntroTop from '../components/IntroTop';
import Button from '@mui/material/Button'
import Footer from '../components/Footer'
import Notice from '../components/Notice'
import { ReactComponent as Logo } from '../assets/brandlogo2.svg'

const Explore = () => {

    return (
        <div className='pb-3 max-w-5xl mx-auto'>

            <div className='relative'>
                <div className='rounded-xl mx-2 absolute z-50 top-6 left-0 right-0 px-3 py-1 bg-white'>
                    <header className='flex justify-between items-center'>
                        <Link to='/'>
                            <p className='text-brand text-sm font-semibold cursor-pointer flex items-center gap-2'>
                                <Logo className='text-brand' fill='#e74c3c' />
                                AjeboProperty
                            </p>
                        </Link>
                        <div>
                            <Stack direction="row" spacing={1} className='flex justify-center items-center'>
                                <Notice />

                                <div>
                                    <AccountMenu isHome={true} />
                                </div>
                            </Stack>
                        </div>
                    </header>
                </div>
            </div>

            <main className=''>
                <div className=''>
                    <ExploreSlider />
                </div>

                <div>
                    <div className='px-6 my-10 max-w-lg'>
                        <h2 className='text-xl font-light'>Sell and list your property on AjeboProperty and open your home to rental income</h2>
                        <Button
                            className='!rounded-full mt-2'
                            variant="outlined">Create a listing</Button>
                    </div>

                    <Divider textAlign="left" role='presentation' className='text-sm font-semibold text-gray-400 px-6'>Categories</Divider>
                    <div className='mt-3'>
                        <div className='categoryDivContainer px-6'>
                            {/* RENT */}
                            <div className="flex justify-center">
                                <div className='overflow-hidden'>
                                    <div className='mx-auto'
                                        style={{
                                            maxWidth: 490
                                        }}>
                                        <div className='relative '>
                                            <div className='absolute z-50 top-0 left-0 mx-3 mt-3 cursor-pointer'>
                                                <span className='font-semibold text-sm tracking-wide 
                                    bg- bg-slate-50 text-slate-900 px-2 py-1 rounded'>
                                                    Properties for rent
                                                </span>
                                            </div>
                                            <div className='absolute z-50 bottom-10 right-0 mx-3 mb-2 cursor-pointer'>
                                                <HotelIcon
                                                    color='white'
                                                    sx={{
                                                        width: '26px',
                                                        height: '26px'
                                                    }} />
                                            </div>
                                            <CardSliderRent />
                                            <div className='w-fit mx-auto mt-2'>
                                                <Link to='/category/rent'>
                                                    <p className='text-black font-semibold text-sm p-2 hover:!text-brand hover:underline'>
                                                        View more
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SALE */}
                            <div className="flex justify-center">
                                <div className='overflow-hidden'>
                                    <div className='mx-auto'
                                        style={{
                                            maxWidth: 490
                                        }}>
                                        <div className='relative '>
                                            <div className='absolute z-50 top-0 left-0 mx-3 mt-3 cursor-pointer'>
                                                <span className='font-semibold text-sm tracking-wide 
                                    bg- bg-slate-50 text-slate-900 px-2 py-1 rounded'>
                                                    Properties for sale
                                                </span>
                                            </div>
                                            <div className='absolute z-50 bottom-10 right-0 mx-3 mb-2 cursor-pointer'>
                                                <HouseIcon
                                                    color='white'
                                                    sx={{
                                                        width: '26px',
                                                        height: '26px'
                                                    }} />
                                            </div>
                                            <CardSliderSale />
                                            <div className='w-fit mx-auto mt-2'>
                                                <Link to='/category/sale'>
                                                    <p className='text-black font-semibold text-sm p-2 hover:!text-brand hover:underline'>
                                                        View more
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INTRO */}
                    <div className='px-6 my-20'>
                        <Divider textAlign="left" role='presentation' className='text-sm font-semibold text-gray-400'>What we offer you</Divider>
                        <IntroTop />
                    </div>

                    {/* Map */}
                    <div className='mt-10 px-6'>
                        <Divider textAlign="left" role='presentation' className='mt-3  text-sm font-semibold text-gray-400'>Where we currently have listings</Divider>
                        <div className='max-w-5xl mx-auto mt-3'>
                            <div className='rounded-3xl overflow-hidden shadow-md '>
                                <ExploreMap />
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            {/* footer here */}
            <div className='mt-20'>
                <Footer />
            </div>

            <Navbar />
        </div>
    )
}

export default Explore;