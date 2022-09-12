import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
// import PrivateRoute from './components/PrivateRoute'
import Deals from './pages/Deals'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Category from './pages/Category'
import Listing from './pages/Listing'
import Contact from './pages/Contact'
import EditListing from './pages/EditListing'
import Saved from './pages/Saved'
import { AnimatePresence } from "framer-motion"
import AOS from 'aos'
import 'aos/dist/aos.css'


function App() {
  const location = useLocation()
  const theme = createTheme({
    palette: {
      primary: {
        main: '#e74c3c',
      },
      white: {
        main: '#fff',
      },
      black: {
        main: '#212121',
      },
      secondary: {
        light: '#42a5f5',
        main: '#1976d2',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    }
  })

  AOS.init({
    offset: 80,
  });

  return (
    <div className="!overflow-x-hidden">
      <ThemeProvider theme={theme}>

        <div className="app pb-11 max-w-5xl mx-auto h-full ">
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.key}>
              <Route path="/" element={<Explore />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/category/:categoryName/:listingId" element={<Listing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/saved/:userId" element={<Saved />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/edit-listing/:listingId" element={<EditListing />} />
              <Route path="/contact/:landlordId" element={<Contact />} />
            </Routes>
            <ToastContainer
              hideProgressBar
              limit={2}
              transition={Zoom}
              className="text-sm mt-2" />
          </AnimatePresence>
        </div>

        <Navbar />
      </ThemeProvider>
    </div>
  );
}

export const COLORS = {
  PRIMARY: '#e74c3c',
  PRIMARY_LIGHT: '#ec7669',
  PRIMARY_DARK: '#d52d1a'
}

export default App;
