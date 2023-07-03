import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSingleSpot } from "../../store/spots";
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
    const owner = spot?.Owner ?? {};
    const firstName = owner.firstName ?? "";
    const lastName = owner.lastName ?? "";
    const description = spot?.description ?? "";
    const price = spot?.price ?? 0;
    const avgStarRating = spot?.avgStarRating ?? 0;
    const numReviews = spot?.numReviews ?? 0;

    return (
        <div className="spot-details-container">
            <div className="spot-details-title">
                <div>{spot.name}</div>
                <div>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div className="spot-details-images">
                {url ? (
                    <img src={url} alt={spot.name} />
                ) : (
                    <div>Loading image...</div>
                )}
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
                                ${price}/night
                            </div>
                            <div className="star-review">
                                <i className="fa-solid fa-star" key={spot.id}></i>{avgStarRating.toFixed(1)}
                                <div className="num-review">
                                    {numReviews} Reviews
                                </div>
                            </div>
                        </div>
                        <div className="spot-reserve">
                            <button>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spot-reviews-container">
                <i className="fa-solid fa-star" key={spot.id}></i>{avgStarRating.toFixed(1)} {numReviews} Reviews
            </div>
            {}
        </div>
    );
}

export default SpotDetail;
