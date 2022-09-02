import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {COLORS} from '../App'

const BrandName = ({ size }) => {
    return (
        <>
        <Link to="/">
            <h2 style={{
                color: COLORS.PRIMARY,
                textAlign: 'center',
                fontSize: `${size}`,
                fontWeight: '800',
                letterSpacing: '0.02ch'
            }}
            className="whitespace-nowrap">
            AjeboProperty</h2>
        </Link>
        </>
    );
}

BrandName.defaultProps = {
    size: "26px"
}
BrandName.propTypes = {
    size: PropTypes.string
}
export default BrandName;