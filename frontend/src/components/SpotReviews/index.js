import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSpotReviews } from "../../store/reviews";
import { useEffect, useState } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import ReviewStats from "../ReviewStats";

function SpotReviews() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [canPost, setCanPost] = useState(true)
    const { spotId } = useParams()

    const sessionUser = useSelector(state => state.session.user);

    const spot = useSelector((state) => state.spots.singleSpot);

    const reviews = useSelector(state => state.reviews.spot)


    const revArr = Object.values(reviews)


    useEffect(() => {
        dispatch(thunkGetSpotReviews(spotId))
            .then(() => setLoading(false))
        return function () {
            setLoading(true);
        };
    }, [dispatch, spotId]);

    useEffect(() => {
        revArr.forEach(review => {
            if (review?.userId === sessionUser?.id) {
                setCanPost(false)
            } else {
                setCanPost(true)
            }
            return function () {
                setCanPost(true);
            }
        });
    }, [dispatch, revArr, sessionUser, spotId]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!revArr.length) {
        return (
            <>
                <ReviewStats />
                {canPost && sessionUser && spot.Owner.id !== sessionUser.id ? <><div className="formbuttontwo"><OpenModalMenuItem itemText='Post Your Review' modalComponent={<PostReviewModal spotId={spotId} />} /></div>
                    <h3>Be the first to post a review!</h3></>
                    : null}
            </>
        )
    }

    return (
        <div className="spot-reviews">
            <ReviewStats />
            {canPost && sessionUser && spot.Owner.id !== sessionUser.id ? <div className="formbuttontwo"><OpenModalMenuItem itemText='Post Your Review' modalComponent={<PostReviewModal spotId={spotId} />} /></div> : null}
            {revArr.sort((a, b) => b.id - a.id).map(review => {
                return (
                    <div key={review.id}>
                        <h3>{review.User.firstName}</h3>
                        {review.createdAt.split('T')[0].split('-')[1]}/{review.createdAt.split('T')[0].split('-')[0]}
                        <p>{review.review}</p>
                        {sessionUser?.id === review.User?.id ? <div className="formbutton"><OpenModalMenuItem itemText='DELETE' modalComponent={<DeleteReviewModal reviewId={review.id} setCanPost={setCanPost} />} /></div> : null}
                    </div>
                )
            })}
        </div>
    )
}

export default SpotReviews;
