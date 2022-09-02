import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function Contact() {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // this would let us get the listingName we're passing in as a search param or query string
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error('Could not get landlord data')
      }
    }

    getLandlord()
  }, [params.landlordId])

  const onChange = (e) => setMessage(e.target.value)

  return (
    <div className='pageContainer px-6'>
      <div>
        <Button variant="text"
          onClick={() => { window.history.go(-1) }}
          size='small'
          color='black'
          sx={{ textTransform: 'none' }}
          startIcon={<ArrowBackIosIcon />}>
          Back
        </Button>
        <header className='text-center mb-3'>

          <p className='font-bold text-lg'>Contact Landlord</p>
        </header>
      </div>
      <hr />

      {landlord !== null ? (
        <main className='bg-white shadow-md rounded-3xl max-w-lg text-center mx-auto mt-6 px-6'>
          <div className='pt-8 text-sm font-semibold'>
            <p className='landlordName'>For enquires about this listing, send an email to <span className='text-brand '>{landlord?.name}</span></p>
          </div>

          <form className='mt-3'>
            <TextField
            fullWidth
            color='black'
            id='message'
            name='message'
            value={message}
                onChange={onChange}
              label="Message"
              multiline
              rows={4}
            />
            
              {/* we use 'mailto:' prefix to auto mail landord and  '?Subject=' after to set a subject for the mail- READ UP MORE
          We also use 'searchParams' which we set to useSearchParams(), we use it to get the listingName we passed into our route from Listing.jsx The way we use it to get the query string or search params is '.get(name of the search/query string) - READ UP MORE ON ROUTER6. Finally we tack on '&body=' the message state */}
            <div className='mt-3 pb-8'>
              <a
                target='_blank' rel='noreferrer'
                href={`mailto:${landlord.email}?Subject=${searchParams.get(
                  'listingName'
                )}&body=${message}`}
              ><Button
                variant='contained'>
                  Send Message</Button>
              </a>
            </div>
            
          </form>
        </main>
      ) : <p className='px-6 mt-8 font-semibold text-sm'>The creator of this listing is not available</p> }
    </div>
  )
}


export default Contact