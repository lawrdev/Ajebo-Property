import { Navigate } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'
import Loader from '../shared/Loader'

const PrivateRoute = ({ children }) => {
    const { loggedIn, checkingStatus } = useAuthStatus()

    if (checkingStatus) {
        return <Loader show={true} />
    }

    return loggedIn ? children : <Navigate to='/sign-in' />
}

export default PrivateRoute;