import { useState, useEffect} from 'react'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {Link, useParams} from 'react-router-dom'
import {
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import Loader from '../shared/Loader'
import BackBtn from '../shared/BackBtn'
import ListingItem from '../components/ListingItem'


const Saved = () => {
  // const auth = getAuth()
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(false)
  const params = useParams()

  useEffect(() =>{
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
          // let savedListsObjArry = []
          // savedLists.forEach(listId => {
          //   const getObj = async () => {
          //     const listingRef = doc(db, 'listings', listId)
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
          //   const listingDocSnap = await getDoc(listingRef)
          //   if (listingDocSnap.data()) {
          //     let obj = {};
          //     obj.id = listId;
          //     obj.data = listingDocSnap.data();
          //     savedListsObjArry.push(obj)
          //   }
          // }
          // getObj()
          setListings(savedListsObjArry)
          console.log(savedListObjArry)
        }

        
        setLoading(false)
        // TODO: to fix 
        // setTimeout(() => {

        // }, 1000)

      } else { console.log('error no doc data') }
    }
    getUserInfo()
  }, [params.userId])
  
  if(loading) return <Loader show={loading}/>

  return (
    <div className='pageContainer px-6'>
      <BackBtn />
      <header className='flex justify-between items-center pb-3'>
        <h2 className='font-bold text-lg'>
          Your saved listings</h2>
      </header>

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
    </div>
  )
}

export default Saved