import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { motion } from "framer-motion"
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

function Contact() {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  const [loading, setLoading] = useState(false)
  // this would let us get the listingName we're passing in as a search param 
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      setLoading(true)
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
        setLoading(false)
      } else {
        setLoading(false)
        toast.error('Could not get landlord data')
      }
    }

    getLandlord()
  }, [params.landlordId])

  const onChange = (e) => setMessage(e.target.value)

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

      {loading ? (
        <ContactSkeleton />
      ) : (
        landlord !== null ? (
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
        ) : <p className='px-6 mt-8 font-semibold text-sm'>The creator of this listing is not available</p>
      )}

    </motion.div>
  )
}

export function ContactSkeleton() {
  return (
    <div>
      <Stack className='flex-col max-w-lg mx-auto mt-6'>
        <Skeleton variant="rounded" width='100%' height={242} />
        <Skeleton variant="text" sx={{ fontSize: '3rem', mx: 'auto' }} style={{ width: '40%' }} />
      </Stack>
    </div>
  )
}


export default Contact