import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSpotReviews } from "../../store/reviews";
import { useEffect, useState } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

function SpotReviews() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const { spotId } = useParams()

    const reviews = useSelector(state => state.reviews.spot)
    const revArr = Object.values(reviews)

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
            <div className="formbuttontwo"><OpenModalMenuItem itemText='Post Your Review' modalComponent={<PostReviewModal spotId={spotId}/>} /></div>
            {revArr.map(review => {
                return (
                    <div key={review.id}>
                    <h3>{review.User.firstName}</h3>
                    {review.createdAt.split('T')[0].split('-')[1]}/{review.createdAt.split('T')[0].split('-')[0]}
                    <p>{review.review}</p>
                    <div className="formbutton"><OpenModalMenuItem itemText='DELETE' modalComponent={<DeleteReviewModal reviewId={review.id}/>} /></div>
                    </div>
                )
            })}
        </div>
    )
}

export default SpotReviews;
