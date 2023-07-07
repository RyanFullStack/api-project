import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSingleSpot } from "../../store/spots";
import ReviewStats from "../ReviewStats";
import './spotdetail.css';

function SpotDetail() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId))
            .then(() => setLoading(false));
        return function () {
            setLoading(true);
        };
    }, [dispatch, spotId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const spotImages = spot?.SpotImages ?? [];
    const url = spotImages[0]?.url;
    const url2 = spotImages[1]?.url;
    const url3 = spotImages[2]?.url;
    const url4 = spotImages[3]?.url;
    const url5 = spotImages[4]?.url;
    const owner = spot?.Owner ?? {};
    const firstName = owner.firstName ?? "";
    const lastName = owner.lastName ?? "";
    const description = spot?.description ?? "";
    const price = spot?.price ?? 0;

    return (
        <div className="spot-details-container">
            <div className="spot-details-title">
                <div id='spot-name'>{spot.name}</div>
                <div id="spot-location">{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div className="spot-details-images">
                <div className="spot-main-image">
                {url ? (
                    <img src={url} alt={spot.name} />
                ) : (
                    <div>Loading image...</div>
                )}
                </div>
                <div className="spot-images">

                {url2 ? (
                    <img src={url2} alt={spot.name} />
                ) : null}
                {url3 ? (
                    <img src={url3} alt={spot.name} />
                ) : null}
                {url4 ? (
                    <img src={url4} alt={spot.name} />
                ) : null}
                {url5 ? (
                    <img src={url5} alt={spot.name} />
                ) : null}
                </div>
            </div>
            <div className="spot-detail-info">
                <div className="spot-detail-left">
                    <div className="spot-host">Hosted by {firstName} {lastName}</div>
                    <div className="spot-description">
                        {description}
                    </div>
                </div>
                <div className="spot-detail-right">
                    <div className="spot-book-box">
                        <div className="spot-price">
                            <div className="price">
                                <span>${price}</span> / night
                            </div>
                            <div className="star-review">
                                <ReviewStats />
                            </div>
                        </div>
                        <div className="spot-reserve">
                            <button id='reserve' onClick={()=>alert('Feature coming soon!')}>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotDetail;
