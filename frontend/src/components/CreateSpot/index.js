import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { thunkCreateSpot, thunkCreateSpotImage } from '../../store/spots.js'
import './createspot.css'

function CreateSpotForm() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [imageUrl4, setImageUrl4] = useState('');
    const [errors, setErrors] = useState({});



    const handleSubmit = async (e) => {
        e.preventDefault()

        const errorObj = {};

        if (!country) errorObj.country = "Country is required";
        if (!address) errorObj.address = "Address is required";
        if (!city) errorObj.city = "City is required";
        if (!state) errorObj.state = "State is required";
        if (!description || description.length < 30) errorObj.description = "Description needs 30 or more characters";
        if (!name) errorObj.name = "Name is required";
        if (!price) errorObj.price = "Price is required";
        if (!previewImageUrl) errorObj.previewImageUrl = "Preview image is required";
        // eslint-disable-next-line
        if (parseInt(price) != price) errorObj.price = 'Price must be a number!'
        // eslint-disable-next-line
        if (parseInt(lat) != lat) errorObj.lat = 'Lat must be a number!'
        // eslint-disable-next-line
        if (parseInt(lng) != lng) errorObj.lng = 'Lnt must be a number!'

        const wrongFileType = 'Image URL must end in .png, .jpg, or .jpeg'

        if (!previewImageUrl.endsWith('.jpg') && !previewImageUrl.endsWith('.jpeg') && !previewImageUrl.endsWith('.png')) {
            errorObj.previewImageUrl = wrongFileType
        }
        if (imageUrl && (!imageUrl.endsWith('.jpg') && !imageUrl.endsWith('.jpeg') && !imageUrl.endsWith('.png'))) {
            errorObj.imageUrl = wrongFileType
        }
        if (imageUrl2 && (!imageUrl2.endsWith('.jpg') && !imageUrl2.endsWith('.jpeg') && !imageUrl2.endsWith('.png'))) {
            errorObj.imageUrl2 = wrongFileType
        }
        if (imageUrl3 && (!imageUrl3.endsWith('.jpg') && !imageUrl3.endsWith('.jpeg') && !imageUrl3.endsWith('.png'))) {
            errorObj.imageUrl3 = wrongFileType
        }
        if (imageUrl4 && (!imageUrl4.endsWith('.jpg') && !imageUrl4.endsWith('.jpeg') && !imageUrl4.endsWith('.png'))) {
            errorObj.imageUrl4 = wrongFileType
        }


        setErrors(errorObj)


        if (!Object.keys(errorObj).length) {

            const spot = {
                country,
                address,
                city,
                state,
                lat,
                lng,
                description,
                name,
                price
            }
            const res = await dispatch(thunkCreateSpot(spot))
            if (res.errors) {
                const err = res.errors
                setErrors(err)
            } else {
                const id = res.id
                if (previewImageUrl) await dispatch(thunkCreateSpotImage({ url: previewImageUrl, id }))
                if (imageUrl) await dispatch(thunkCreateSpotImage({ url: imageUrl, id }))
                if (imageUrl2) await dispatch(thunkCreateSpotImage({ url: imageUrl2, id }))
                if (imageUrl3) await dispatch(thunkCreateSpotImage({ url: imageUrl3, id }))
                if (imageUrl4) await dispatch(thunkCreateSpotImage({ url: imageUrl4, id }))
                history.push(`/spots/${id}`)
            }

        }
    }

    return (
        <div className='create-spot-container'>
            <div className='create-spot-form'>
                <h1>Create a new Spot</h1>

                <form onSubmit={handleSubmit}>
                    <h3>Where's your place located?</h3>
                    Guests will only receive your exact address once they have completed a booking.

                    <div className='create-with-error'>Country {errors.country && <p>{errors.country}</p>}</div>
                    <input type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required />
                    <div className='create-with-error'>Street Address {errors.address && <p>{errors.address}</p>}</div>
                    <input type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required />
                    <div className='create-with-error'>City {errors.city && <p>{errors.city}</p>}</div>
                    <input type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required />
                    <div className='create-with-error'>State {errors.state && <p>{errors.state}</p>}</div>
                    <input type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required />
                    <div className='create-with-error'>Latitude {errors.lat && <p>{errors.lat}</p>}</div>
                    <input type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        required />
                    <div className='create-with-error'>Longitude {errors.lng && <p>{errors.lng}</p>}</div>
                    <input type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        required />

                    <h3>Describe your place to guests</h3>
                    Mention the best features of your space, any special amentities like fast wifi
                    or parking, and what you love about the neighborhood.
                    <div className='create-with-error' id='description'><textarea
                        rows='5'
                        cols='52'
                        value={description}
                        placeholder='Please write at least 30 characters'
                        onChange={(e) => setDescription(e.target.value)}
                        required /></div>
                        <div className='create-with-error'>{errors.description && <p>{errors.description}</p>}</div>

                    <h3>Create a title for your spot</h3>
                    Catch guests' attention with a spot title that highlights what makes your place special.
                    <div className='create-with-error'><input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required /></div>
                        <div className='create-with-error'>{errors.name && <p>{errors.name}</p>}</div>

                    <h3>Set a base price for your spot</h3>
                    Competitve pricing can help your listing stand out and rank higher in search results.
                    <div className='create-with-error'><input type="text"
                        value={price}
                        placeholder='Price per night (USD)'
                        onChange={(e) => setPrice(e.target.value)}
                        required /></div>
                        <div className='create-with-error'>{errors.price && <p>{errors.price}</p>}</div>

                    <h3>Liven up your spot with photos</h3>
                    Submit a link to at least one photo to publish your spot.
                    <div className='create-with-error'><input type="text"
                        value={previewImageUrl}
                        placeholder='Preview Image URL'
                        onChange={(e) => setPreviewImageUrl(e.target.value)}
                        required /></div>
                        <div className='create-with-error'>{errors.previewImageUrl && <p>{errors.previewImageUrl}</p>}</div>

                    <div className='create-with-error'><input type="text"
                        value={imageUrl}
                        placeholder='Image URL'
                        onChange={(e) => setImageUrl(e.target.value)}
                    /></div>
                        <div className='create-with-error'>{errors.imageUrl && <p>{errors.imageUrl}</p>}</div>

                    <div className='create-with-error'><input type="text"
                        value={imageUrl2}
                        placeholder='Image URL'
                        onChange={(e) => setImageUrl2(e.target.value)}
                    /></div>
                        <div className='create-with-error'>{errors.imageUrl2 && <p>{errors.imageUrl2}</p>}</div>

                    <div className='create-with-error'><input type="text"
                        value={imageUrl3}
                        placeholder='Image URL'
                        onChange={(e) => setImageUrl3(e.target.value)}
                    /></div>
                        <div className='create-with-error'>{errors.imageUrl3 && <p>{errors.imageUrl3}</p>}</div>

                    <div className='create-with-error'><input type="text"
                        value={imageUrl4}
                        placeholder='Image URL'
                        onChange={(e) => setImageUrl4(e.target.value)}
                    /></div>
                        <div className='create-with-error'>{errors.imageUrl4 && <p>{errors.imageUrl4}</p>}</div>

                    <div id='submit'><button type='submit' className='createbutton'>Create Spot</button></div>
                </form>
            </div>
        </div>
    )
}


export default CreateSpotForm;
