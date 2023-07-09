import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { thunkGetAllSpots } from "../../store/spots"
import { Link } from "react-router-dom"
import './spots.css'

function Spots() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);

    const allSpots = useSelector(state => state.spots.allSpots)
    const spotsArr = Object.values(allSpots)

    useEffect(() => {
        dispatch(thunkGetAllSpots())
        .then(()=>setLoading(false))

    }, [dispatch])

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="spots-container">
            {spotsArr.map(spot => {
                return (
                    <Link to={`/spots/${spot.id}`} key={spot.id}>
                    <div key={spot.id} className="spot-card" >
                        <div key={spot.id}><img alt={spot.name} src={spot.previewImage} title={spot.name} className="spot-image" key={spot.id}/></div>
                        <div className="spot-locationrating" >
                            <div className="spot-city-state">{spot.city}, {spot.state}</div>
                            <div><i className="fa-solid fa-star" key={spot.id}></i><span>{spot.avgRating?.toFixed(1) || `New`}</span></div>
                        </div>
                        <div className="spot-price-main"><span>${spot.price}</span> / night</div>
                    </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Spots;
