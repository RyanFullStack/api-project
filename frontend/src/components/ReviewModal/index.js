import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { thunkAddReview } from "../../store/reviews";
import { useSelector } from "react-redux";
import './ReviewModal.css';
import { thunkGetSingleSpot } from "../../store/spots";

function PostReviewModal({ spotId, setCanPost }) {
    const [starRating, setStarRating] = useState();
    const [hoverRating, setHoverRating] = useState();
    const [reviewText, setReviewText] = useState('');
    const [errors, setErrors] = useState('')
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const sessionUser = useSelector(state => state.session.user);

    const handleStarHover = (rating) => {
        setHoverRating(rating);
    };

    const handleStarLeave = () => {
        setHoverRating(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await dispatch(thunkAddReview({
            review: {
                review: reviewText,
                stars: starRating
            },
            spotId: spotId,
            sessionUser
        }))
        await dispatch(thunkGetSingleSpot(spotId))
        if (!res.ok) {
            setErrors(res.message)
        }
        if (res.createdAt) {
        closeModal()
        setCanPost(false)
        }
    };

    return (
        <div className="post-review">
            <h1>How was your stay?</h1>
            <div>{errors ? errors : null}</div>
            <textarea
                placeholder="Leave your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="review-stars">
                <div onClick={() => setStarRating(1)} onMouseEnter={() => handleStarHover(1)} onMouseLeave={handleStarLeave}>
                    <i className={hoverRating >= 1 || starRating >= 1 ? 'fas fa-star' : 'far fa-star'}></i>
                </div>
                <div onClick={() => setStarRating(2)} onMouseEnter={() => handleStarHover(2)} onMouseLeave={handleStarLeave}>
                    <i className={hoverRating >= 2 || starRating >= 2 ? 'fas fa-star' : 'far fa-star'}></i>
                </div>
                <div onClick={() => setStarRating(3)} onMouseEnter={() => handleStarHover(3)} onMouseLeave={handleStarLeave}>
                    <i className={hoverRating >= 3 || starRating >= 3 ? 'fas fa-star' : 'far fa-star'}></i>
                </div>
                <div onClick={() => setStarRating(4)} onMouseEnter={() => handleStarHover(4)} onMouseLeave={handleStarLeave}>
                    <i className={hoverRating >= 4 || starRating >= 4 ? 'fas fa-star' : 'far fa-star'}></i>
                </div>
                <div onClick={() => setStarRating(5)} onMouseEnter={() => handleStarHover(5)} onMouseLeave={handleStarLeave}>
                    <i className={hoverRating >= 5 || starRating >= 5 ? 'fas fa-star' : 'far fa-star'}></i>
                </div>
                Stars
            </div>
            <button className="reviewbutton" onClick={handleSubmit} disabled={reviewText.length < 10 || !starRating}>Submit Your Review</button>
        </div>
    );
}

export default PostReviewModal;
