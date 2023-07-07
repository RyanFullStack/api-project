import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../store/reviews";
import './DeleteReviewModal.css'

function DeleteReviewModal({ reviewId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteReview(reviewId))
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
