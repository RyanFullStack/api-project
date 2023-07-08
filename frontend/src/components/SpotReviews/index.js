import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSpotReviews } from "../../store/reviews";
import { useEffect, useState } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import ReviewStats from "../ReviewStats";
import './spotreviews.css'

function SpotReviews({canPost, setCanPost}) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const { spotId } = useParams()


        useEffect(() => {
            setCanPost(true)
        },[loading, setCanPost])

    const sessionUser = useSelector(state => state.session.user);

    const spot = useSelector((state) => state.spots.singleSpot);

    const reviews = useSelector(state => state.reviews.spot)


    const revArr = Object.values(reviews)


    useEffect(() => {
        dispatch(thunkGetSpotReviews(spotId))
            .then(() => setLoading(false))
            setCanPost(true)
        return function () {
            setLoading(true);
        };
    }, [dispatch, spotId, setCanPost]);

    useEffect(() => {
        revArr.forEach(review => {
            if (review?.userId === sessionUser?.id) {
                setCanPost(false)
            }
            return function () {
                setCanPost(true);
            }
        });
    }, [dispatch, revArr, sessionUser, spotId, setCanPost]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!revArr.length) {
        return (
            <>
                <ReviewStats />
                {canPost && sessionUser && spot.Owner.id !== sessionUser.id ? <><div className="reviewbutton"><OpenModalMenuItem itemText='Post Your Review' modalComponent={<PostReviewModal setCanPost={setCanPost} spotId={spotId} />} /></div>
                    <h3>Be the first to post a review!</h3></>
                    : null}
            </>
        )
    }

    return (
        <div className="spot-reviews">
            <div className="rev-stats"><ReviewStats />
            {canPost && sessionUser && spot.Owner.id !== sessionUser.id ? <div className="reviewbutton"><OpenModalMenuItem itemText='Post Your Review' modalComponent={<PostReviewModal setCanPost={setCanPost} spotId={spotId} />} /></div> : null}</div>
            {revArr.sort((a, b) => b.id - a.id).map(review => {
                return (
                    <div key={review.id} className="review-item">
                        <h3>{review.User.firstName}</h3>
                        <h6>{review.createdAt.split('T')[0].split('-')[1]}/{review.createdAt.split('T')[0].split('-')[0]}</h6>
                        <p>{review.review}</p>
                        {sessionUser?.id === review.User?.id ? <div className="reviewbutton"><OpenModalMenuItem itemText='DELETE' modalComponent={<DeleteReviewModal reviewId={review.id} setCanPost={setCanPost} />} /></div> : null}
                    </div>
                )
            })}
        </div>
    )
}

export default SpotReviews;
