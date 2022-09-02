import {useState, useEffect} from 'react'
import { MapContainer, Marker, TileLayer} from 'react-leaflet'
// import "leaflet/dist/leaflet.css";
import L from "leaflet"
import useFetchListings from '../hooks/useFetchListings'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
 
function ExploreMap() {

    const [points, setPoints] = useState([])
    const { listings, loading } = useFetchListings()
    
    const position = [9.0820, 8.6753];

    useEffect(() => {
        if (listings && listings.length > 0) {
            let cord = []
            listings.forEach((obj) => {
                return cord.push(obj.data.geolocation)
            })
            setPoints(cord)
        }
    }, [listings])

    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
    });

    if(loading) return <ExploreMapSkeleton />
  return (
      <div>
          <div className='leafletContainer'>
              <MapContainer 
              center={position} 
              zoom={5} 
              style={{ height: '100%', width: '100%'}}
              scrollWheelZoom={false}>
                  <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {
                    points.map((pts, index) => {
                        return <Marker key={index} position={[pts.lat, pts.lng]} icon={icon}>
                        </Marker>})
                  }
              </MapContainer>
          </div>
      </div>
  )
}


export function ExploreMapSkeleton() {
  return (<>
     <Stack spacing={1}>
      <div className=''>
        <Skeleton variant="rounded" width='100%' height={260} />
      </div>
      
    </Stack>
  </>)
}


export default ExploreMap