import { Link, useNavigate } from 'react-router-dom'
import ExploreSlider from '../components/ExploreSlider'
import Stack from '@mui/material/Stack'
import CardSliderRent from '../components/CardSliderRent'
import HotelIcon from '@mui/icons-material/Hotel'
import HouseIcon from '@mui/icons-material/House';
import CardSliderSale from '../components/CardSliderSale'
import ExploreMap from '../components/ExploreMap';
import AccountMenu from '../components/AccountMenu'
import Divider from '@mui/material/Divider'
import IntroTop from '../components/IntroTop';
import Button from '@mui/material/Button'
import Footer from '../components/Footer'
import Notice from '../components/Notice'
import { motion } from "framer-motion"


const Explore = () => {

    const navigate = useNavigate()

    const createListingVariant = {
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.2,
                yoyo: Infinity
            }
        },
    }
    const notifyVariant = {
        visible: {
            scale: [1, 1.2, 1, 1.2, 1, 1.2, 1],
            transition: {
                delay: 1,
                duration: 1.5,
            }
        },
        hover: {
            rotate: [0.01, -25, 50],
            transition: {
                yoyo: Infinity
            }
        }
    }
    const logoSvgVariants = {
        hidden: {
            rotate: 90,
        },
        visible: {
            rotate: 0,
            transition: {
                type: "spring", duration: 5, bounce: 0.8
            }
        }
    }
    const logoPathVariants = {
        hidden: {
            pathLength: 0,
            stroke: '#000',
        },
        visible: {
            pathLength: 1,
            stroke: '#fff',
            transition: { duration: 3, ease: 'easeInOut' }
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

    return (
        <motion.div className='pageContainer pb-3 max-w-5xl mx-auto'
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <div className='px-3 relative'>
                <div className='rounded-xl mx-2 z-50 top-6 left-0 right-0 px-3 py-1 bg-white'>
                    <header className='flex justify-between items-center'>
                        <Link to='/'>
                            <p className='text-brand text-sm font-semibold cursor-pointer flex items-center gap-2'>
                                <span>
                                    <motion.svg
                                        style={{
                                            overflow: 'visible',
                                            strokeWidth: '1',
                                            strokeLinejoin: 'round',
                                            strokeLinecap: 'round',
                                        }}
                                        variants={logoSvgVariants}
                                        initial='hidden'
                                        animate='visible'
                                        fill='#e74c3c'
                                        xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                                        <motion.path
                                            variants={logoPathVariants}
                                            d="M27.958 23.917q-.416-.875-1.187-1.5-.771-.625-1.854-1L14.167 17.5q-.209-.042-.438-.042h-.896v-4.916q0-.584.25-1.104.25-.521.709-.813l8.166-5.792q.625-.458 1.375-.458t1.375.458l8.167 5.792q.458.292.708.813.25.52.25 1.104v11.375ZM25 13.292q.25 0 .438-.188.187-.187.187-.437t-.187-.438q-.188-.187-.438-.187t-.438.187q-.187.188-.187.438t.187.437q.188.188.438.188Zm-3.333 0q.25 0 .437-.188.188-.187.188-.437t-.188-.438q-.187-.187-.437-.187t-.438.187q-.187.188-.187.438t.187.437q.188.188.438.188ZM25 16.625q.25 0 .438-.187.187-.188.187-.438t-.187-.438q-.188-.187-.438-.187t-.438.187q-.187.188-.187.438t.187.438q.188.187.438.187Zm-3.333 0q.25 0 .437-.187.188-.188.188-.438t-.188-.438q-.187-.187-.437-.187t-.438.187q-.187.188-.187.438t.187.438q.188.187.438.187ZM3.917 32.042v-9.417q0-.5.333-.833.333-.334.833-.334h2.125q.5 0 .834.334.333.333.333.833v9.417q0 .5-.333.833-.334.333-.834.333H5.083q-.5 0-.833-.333-.333-.333-.333-.833Zm18.041 3-12.583-3.75v-9.834h3.875q.25 0 .417.021.166.021.375.104L23.375 25q.875.292 1.479 1.125.604.833.604 1.583 0 .25-.104.375t-.396.125h-1.041q-1.334 0-2.479-.166-1.146-.167-2.146-.5l-2.709-.875q-.208-.084-.416 0-.209.083-.292.291-.083.209.042.459t.375.333l2.666.875q1.042.333 2.313.5 1.271.167 2.646.167h7.125q1.291 0 2 .708.708.708.708 1.958l-10.5 3.125q-.25.042-.646.042t-.646-.083Z" />
                                    </motion.svg>
                                </span>
                                AjeboProperty
                            </p>
                        </Link>
                        <div>
                            <Stack direction="row" spacing={1} className='flex justify-center items-center'>
                                <motion.div
                                    className='w-fit'
                                    variants={notifyVariant}
                                    whileHover='hover'
                                    initial='hidden'
                                    animate='visible'>
                                    <Notice />
                                </motion.div>
                                <div>
                                    <AccountMenu isHome={true} />
                                </div>
                            </Stack>
                        </div>
                    </header>
                </div>
            </div>

            <main>
                <div className='px-6 my-10'>
                    <ExploreSlider />
                </div>

                <div>
                    <div className='px-6 my-10 max-w-lg'>
                        <h2 className='text-xl font-light'>Sell and list your property on AjeboProperty and open your home to rental income</h2>
                        <motion.div className='w-fit'
                            variants={createListingVariant}
                            whileHover='hover'>
                            <Button
                                className=' mt-2'
                                variant="outlined"
                                onClick={() => navigate('/create-listing')}
                            >Create a listing</Button>
                        </motion.div>
                    </div>

                    <Divider textAlign="left" role='presentation' className='text-sm font-semibold text-gray-400 px-6'>Categories</Divider>

                    <div className='mt-3'
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-mirror="true"
                    >
                        <div className='categoryDivContainer px-6'>
                            {/* RENT */}
                            <div className="flex justify-center"
                            >
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
                                                        View all rent listings
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SALE */}
                            <div className="flex justify-center"
                            >
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
                                                        View all sale listings
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
                    <Divider textAlign="left" role='presentation' className='mt-3  text-sm font-semibold text-gray-400'>Where we currently have listings</Divider>
                    <div className='mt-10 px-6'
                        data-aos="fade-up"
                        data-aos-duration="500"
                        data-aos-mirror="true"
                    >
                        <div className='max-w-5xl mx-auto mt-3'>
                            <div className='rounded-3xl overflow-hidden shadow-md '>
                                <ExploreMap />
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            {/* footer here */}
            <div className='mt-20'

            >
                <Footer />
            </div>
        </motion.div >
    )
}

export default Explore;