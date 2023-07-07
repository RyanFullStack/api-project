import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { thunkGetUserSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from "../DeleteSpotModal";
import { useHistory } from "react-router-dom";
import '../LoginFormModal/LoginForm.css'

function ManageSpot() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [loading, setLoading] = useState(true);

    const userSpots = useSelector(state => state.spots.allSpots)
    const spotArr = Object.values(userSpots)

    useEffect(() => {
        dispatch(thunkGetUserSpots())
            .then(() => setLoading(false))
    }, [dispatch])


    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="spots">
            {spotArr.map(spot => {
                return (
                    <div key={spot.id} className="spot-card" >
                        <Link to={`/spots/${spot.id}`} key={spot.id}>
                            <div key={spot.id}><img alt={spot.name} src={spot.previewImage} title={spot.name} className="spot-image" key={spot.id} /></div>
                            <div className="spot-locationrating" >
                                <div>{spot.city}, {spot.state}</div>
                                <div><i className="fa-solid fa-star" key={spot.id}></i><span>{spot.avgRating?.toFixed(1) || `New`}</span></div>
                            </div>
                            <div className="spot-price-main"><span>${spot.price}</span> / night</div>
                        </Link>
                        <div className='spot-manage-buttons'>
                           <div className="formbutton" onClick={()=>history.push(`/spots/edit/${spot.id}`)}>UPDATE</div>
                           <div className="formbutton"><OpenModalMenuItem itemText='DELETE' modalComponent={<DeleteSpotModal spotid={spot.id}/>} /></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


export default ManageSpot
