import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSpotReviews } from "../../store/reviews";
import { useEffect, useState } from "react";

function SpotReviews() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const { spotId } = useParams()

    const reviews = useSelector(state => state.reviews.spot)
    const revArr = Object.values(reviews)
    console.log(revArr)

    useEffect(() => {
        dispatch(thunkGetSpotReviews(spotId))
        .then(() => setLoading(false));
        return function () {
            setLoading(true);
        };
    }, [dispatch, spotId]);


    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="spot-reviews">
            {revArr.map(review => {
                return (
                    <div>
                    <h3>{review.User.firstName}</h3>
                    {review.createdAt.split('T')[0].split('-')[1]}/{review.createdAt.split('T')[0].split('-')[0]}
                    <p>{review.review}</p>
                    </div>
                )
            })}


        </div>
    )
}

export default SpotReviews;
