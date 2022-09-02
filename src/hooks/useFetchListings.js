import { useEffect, useState } from 'react'
import {
    collection, getDocs, query, orderBy, 
} from 'firebase/firestore'
import {db} from '../firebase.config'

function useFetchListings() {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const fetchListings = async () => {
            let listingDocs = []
            try {
                const listingsRef = collection(db, 'listings')
                // create a query
                const q = query(
                    listingsRef,
                    orderBy('timestamp', 'desc')
                )
                const querySnap = await getDocs(q)
                // loop through the snapshot
                
                querySnap.forEach((doc) => {
                    return listingDocs.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listingDocs)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    }, [])
    
  return { listings, loading }
}

export default useFetchListings