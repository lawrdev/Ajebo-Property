import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    collection, getDocs, query, where, orderBy, limit, startAfter
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Loader from '../shared/Loader'
import ListingItem, { ListingItemSkeleton } from '../components/ListingItem'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Divider from '@mui/material/Divider'

const Category = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [noMoreListings, setNoMoreListings] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get a refrence for the 'listings' collection
                const listingsRef = collection(db, 'listings')

                // create a query
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                // execute the query and get a snapshot
                const querySnap = await getDocs(q)
                setNoMoreListings(querySnap.empty)

                // this lastVisibleDoc varible
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                // loop through the snapshot
                let listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                console.log(error)
                toast.error('could not fetch listings')
            }
        }

        fetchListings()
    }, [params.categoryName])

    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            // Get reference
            const listingsRef = collection(db, 'listings')

            // Create a query
            const q = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(10)
            )

            // Execute query
            const querySnap = await getDocs(q)
            setNoMoreListings(querySnap.empty)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch listings')
        }
    }

    return (<>
        <div className="category px-6">
            <div className="flex items-center pb-2">
                <Button variant="text"
                    onClick={() => { window.history.go(-1) }}
                    size='small'
                    color='black'
                    sx={{ textTransform: 'none' }}
                    startIcon={<ArrowBackIosIcon />}>
                    Back
                </Button>
            </div>
            <Divider />
            <header className="my-6">
                <p className='font-bold text-lg'>
                    {params.categoryName === 'rent'
                        ? 'Places for rent'
                        : 'Places for sale'}
                </p>
            </header>

            {loading ? (
                <div>
                    <ListingItemSkeleton />
                    <ListingItemSkeleton />
                </div>
            ) : (
                listings && listings.length > 0
            ) ? (
                <>
                    <main>
                        <ul className="overflow-hidden">
                            {listings.map((listing) => (
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                />
                            ))}
                        </ul>
                    </main>
                    <br />
                    <div className='w-72 mx-auto'>
                        {noMoreListings ? (
                            <p className='font-semibold text-sm text-center'>
                                No more listings....
                            </p>
                        ) : (
                            <Button
                                fullWidth
                                disableElevation
                                variant="contained"
                                onClick={onFetchMoreListings}
                                sx={{ textTransform: 'none' }}
                            >Load more
                            </Button>
                        )}
                    </div>

                </>
            ) : (<p>No listings for {params.categoryName}</p>)}
        </div>
    </>);
}

export default Category;