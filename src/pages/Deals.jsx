import { useState, useEffect } from 'react'
import useFetchListings from '../hooks/useFetchListings'
// import Loader from '../shared/Loader'
import ListingItem, { ListingItemSkeleton } from '../components/ListingItem'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';



const Deals = () => {
    const [rentListings, setRentListings] = useState(null)
    const [saleListings, setSaleListings] = useState(null)
    const [offerAvailable, setOfferAvailable] = useState(false)
    // for the tab
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { loading, listings } = useFetchListings()

    useEffect(() => {
        if (listings) {
            let rentData = []
            let saleData = []
            // console.log(listings)
            listings.forEach((item) => {

                if (item.data.offer && item.data.type === 'rent') {
                    rentData.push(item)
                }
                if (item.data.offer && item.data.type === 'sale') {
                    saleData.push(item)
                }
            })

            setRentListings(rentData)
            setSaleListings(saleData)
            setOfferAvailable(true)
        }
    }, [listings])

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
        <motion.div className="category" style={{ backgroundColor: '#f2f4f8' }}
            variants={pageAnimate}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <header className="mb-6 px-6">
                <p className='font-bold text-lg'>
                    Deals
                </p>
            </header>
            <div className='px-6'>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} >
                            <Tab label="Rent" {...a11yProps(0)} />
                            <Tab label="Sale" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                </Box>
            </div>

            {loading ? <div className='px-6'><ListingItemSkeleton /></div> : (
                offerAvailable && listings.length > 0) ? (
                <>
                    <main className='mt-2'>
                        <TabPanel value={value} index={0}>
                            <ul className="categoryListings">
                                {rentListings.map((listing) => (
                                    <ListingItem
                                        flip={true}
                                        listing={listing.data}
                                        id={listing.id}
                                        key={listing.id}
                                    />
                                ))}
                            </ul>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ul className="categoryListings">
                                {saleListings.map((listing) => (
                                    <ListingItem
                                        flip={true}
                                        listing={listing.data}
                                        id={listing.id}
                                        key={listing.id}
                                    />
                                ))}
                            </ul>
                        </TabPanel>
                    </main>
                </>
            ) : (<p className='px-6 mt-4 font-semibold'>There are no current deals</p>)}
        </motion.div>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default Deals;