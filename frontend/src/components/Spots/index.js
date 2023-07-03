import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { thunkGetAllSpots } from "../../store/spots"
import './spots.css'

function Spots() {
    const dispatch = useDispatch()

    const allSpots = useSelector(state => state.spots.allSpots)
    const spotsArr = Object.values(allSpots)

    useEffect(() => {
        dispatch(thunkGetAllSpots())
    }, [dispatch, allSpots])


    return (
        <div className="spots">
            {spotsArr.map(spot => {
                return (
                    <div key={spot.id} className="spot-card">
                        <div><img alt={spot.name} src={spot.previewImage} className="spot-image"/></div>
                        <div className="spot-locationrating">
                            <div>{spot.city}, {spot.state}</div>
                            <div><i className="fa-solid fa-star"></i>{spot.avgRating.toFixed(1)}</div>
                        </div>
                        <div className="spot-price">{spot.price}/night</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Spots;
