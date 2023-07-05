import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkCreateSpot } from '../../store/spots.js'
import './createspot.css'

function CreateSpotForm() {
    const dispatch = useDispatch();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [imageUrl4, setImageUrl4] = useState('');
    const [errors, setErrors] = useState({});


    const errorObj = {};

    if (!country) errorObj.country = "Country is required";
    if (!address) errorObj.address = "Address is required";
    if (!city) errorObj.city = "City is required";
    if (!state) errorObj.state = "State is required";
    if (!description || description.length < 30) errorObj.description = "Description needs 30 or more characters";
    if (!title) errorObj.title = "Name is required";
    if (!price) errorObj.price = "Price is required";
    if (!previewImageUrl) errorObj.previewImageUrl = "Preview image is required";

    const wrongFileType = 'Image URL must end in .png, .jpg, or .jpeg'

    if (!previewImageUrl.endsWith('.jpg') || !previewImageUrl.endsWith('.jpeg') || !previewImageUrl.endsWith('.png')) {
        errorObj.imageUrl = wrongFileType
    }
    if (!imageUrl.endsWith('.jpg') || !imageUrl.endsWith('.jpeg') || !imageUrl.endsWith('.png')) {
        errorObj.imageUrl = wrongFileType
    }
    if (!imageUrl2.endsWith('.jpg') || !imageUrl2.endsWith('.jpeg') || !imageUrl2.endsWith('.png')) {
        errorObj.imageUrl = wrongFileType
    }
    if (!imageUrl3.endsWith('.jpg') || !imageUrl3.endsWith('.jpeg') || !imageUrl3.endsWith('.png')) {
        errorObj.imageUrl = wrongFileType
    }
    if (!imageUrl4.endsWith('.jpg') || !imageUrl4.endsWith('.jpeg') || !imageUrl4.endsWith('.png')) {
        errorObj.imageUrl = wrongFileType
    }



    const handleSubmit = () => {
        setErrors(errorObj)
        if (!Object.keys(errors).length) {
            dispatch(
                thunkCreateSpot({
                    country,
                    address,
                    city,
                    state,
                    lat: 90,
                    lng: 90,
                    description,
                    title,
                    price
                })
            )
        }

        setCountry('');
        setAddress('');
        setCity('');
        setState('');
        setLat('');
        setLng('');
        setDescription('');
        setTitle('');
        setPrice(0);
        setPreviewImageUrl('');
        setImageUrl('');
        setImageUrl2('');
        setImageUrl3('');
        setImageUrl4('');
    }


    return (
        <div className='create-spot-container'>
            <div className='create-spot-form'>
                <h1>Create a new Spot</h1>
                <h3>Where's your place located?</h3>
                Guests will only receive your exact address once they have completed a booking.

                Country
                <input></input>
                Street Address
                <input></input>
                City
                <input></input>
                State
                <input></input>
                Latitude
                <input></input>
                Longitude
                <input></input>

                <h3>Describe your place to guests</h3>
                Mention the best features of your space, any special amentities like fast wifi
                or parking, and what you love about the neighborhood.
                <input></input>

                <h3>Create a title for your spot</h3>
                Catch guests' attention with a spot title that highlights what makes your place special.
                <input></input>

                <h3>Set a base price for your spot</h3>
                Competitve pricing can help your listing stand out and rank higher in search results.
                <input></input>

                <h3>Liven up yoru spot with photos</h3>
                Submit a link to at least one photo to publish your spot.
                <input></input>

                <input></input>

                <input></input>

                <input></input>

                <input></input>

                <button>Create Spot</button>

            </div>
        </div>
    )
}


export default CreateSpotForm;
