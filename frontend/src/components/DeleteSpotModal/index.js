import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";
import "../LoginFormModal/LoginForm.css";


function DeleteSpotModal({spotid}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        return dispatch(thunkDeleteSpot(spotid))
            .then(closeModal)
    };

    return (
        <div className="delete-spot-form">
            <h1>Delete Spot?</h1>
            <h3>Are you sure? This action cannot be undone!</h3>
            <div><button className='formbutton red' onClick={handleSubmit}>Yes (Delete Spot)</button>
                <button className='formbutton grey' onClick={closeModal}>No (Keep Spot)</button></div>
        </div>
    );
}

export default DeleteSpotModal;
