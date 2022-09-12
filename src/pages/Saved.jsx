import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import BackBtn from '../shared/BackBtn'
import ListingItem, { ListingItemSkeleton } from '../components/ListingItem'
import { motion } from "framer-motion"

const Saved = () => {
  // const auth = getAuth()
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(false)
  const params = useParams()

  useEffect(() => {
    setLoading(true)
    const getUserInfo = async () => {
      // get user's saved listings
      if (params.userId) {
        const docRef = doc(db, 'users', params.userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.data().savedListings) {
          let savedLists = []
          docSnap.data().savedListings.forEach(save => {
            return savedLists.push(save)
          })
          // get listings obj for each listing Id
          const promiseArray = savedLists.map(async (listId) => {
            const listingRef = doc(db, 'listings', listId)
            const listingDocSnap = await getDoc(listingRef)
            if (listingDocSnap.data()) {
              return ({
                id: listId,
                data: listingDocSnap.data()
              })
            }
          })
          const savedListObjArry = await Promise.all(promiseArray)
          setListings(savedListObjArry)
          // console.log(savedListObjArry)
        }
        setLoading(false)

      } else { console.log('error no doc data') }
    }
    getUserInfo()
  }, [params.userId])

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
    <motion.div className='pageContainer px-6'
      variants={pageAnimate}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      <BackBtn />
      <header className='flex justify-between items-center pb-6'>
        <h2 className='font-bold text-lg'>
          Your saved listings</h2>
      </header>

      {loading ? (<ListingItemSkeleton />) : (
        <main>{(listings && listings.length > 0) ? (
          < ul > {
            listings.map(item => (
              <ListingItem key={item.id} listing={item.data} id={item.id} />
            ))
          }
          </ul>
        ) : (
          <p>
            You have no saved listings. <Link to='/category/rent'>View and save your favorites listings.</Link></p>
        )
        }</main>
      )}

    </motion.div>
  )
}

export default Saved