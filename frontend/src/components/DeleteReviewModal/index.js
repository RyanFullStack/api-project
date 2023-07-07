import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview } from "../../store/reviews";
import './DeleteReviewModal.css'
import { thunkGetSingleSpot } from "../../store/spots";

function DeleteReviewModal({ reviewId, setCanPost }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const spot = useSelector(state => state.spots.singleSpot)

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteReview(reviewId))
        await dispatch(thunkGetSingleSpot(spot.id))
        setCanPost(true)
        closeModal()
    };

    return (
        <div className="delete-review">
           <h1>Confirm Delete</h1>
           <h3>Are you sure you want to delete this review?</h3>
           <div id='delete-buttons'><button className='formbutton red' onClick={handleSubmit}>Yes (Delete Review)</button>
           <button className='formbutton grey' onClick={closeModal}>No (Keep Review)</button></div>
        </div>
    );
}

export default DeleteReviewModal;
