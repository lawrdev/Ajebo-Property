import SecurityIcon from '@mui/icons-material/Security'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import SavingsIcon from '@mui/icons-material/Savings'
import AccessibilityIcon from '@mui/icons-material/Accessibility'

function IntroTop() {
    return (<>
        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div data-aos="fade-up"
                data-aos-duration="500"
                data-aos-mirror="true"
            >
                <SecurityIcon fontSize='large' color='secondary' />
                <h4 className='font-semibold my-2'>Peace of mind</h4>
                <p className='text-sm'>Our Book with Confidence guarantee gives you 24/7 support.</p>
            </div>
            <div data-aos="fade-up"
                data-aos-duration="700"
                data-aos-mirror="true"
            >
                <EmojiFoodBeverageIcon fontSize='large' color='secondary' />
                <h4 className='font-semibold my-2'>All the privacy of home</h4>
                <p className='text-sm'>Enjoy full kitchens, laundry, pools, yards and more</p>
            </div>
            <div data-aos="fade-up"
                data-aos-duration="900"
                data-aos-mirror="true"
            >
                <SavingsIcon fontSize='large' color='secondary' />
                <h4 className='font-semibold my-2'>More for less</h4>
                <p className='text-sm'>More space, more privacy, more amenities — more value</p>
            </div>
            <div data-aos="fade-up"
                data-aos-duration="1100"
                data-aos-mirror="true"
            >
                <AccessibilityIcon fontSize='large' color='secondary' />
                <h4 className='font-semibold my-2'>A place for everyone</h4>
                <p className='text-sm'>We stand for diversity, inclusion and families everywhere.</p>
            </div>
        </div>
    </>)
}

export default IntroTop