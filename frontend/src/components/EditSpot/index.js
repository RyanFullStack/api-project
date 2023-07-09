import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { thunkEditSpot } from '../../store/spots';
import { thunkGetSingleSpot } from '../../store/spots';
import { useSelector } from 'react-redux';
import './editspot.css'


function EditSpot() {
    const { spotId } = useParams()
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
    const [ownerId, setOwnerId] = useState()
    const [errors, setErrors] = useState({});

    let userId;
    const sessionUser = useSelector(state => state.session.user);
    if (sessionUser) {
        userId = sessionUser.id
    }


    useEffect(() => {
        const findSpot = async () => {
            const spot = await dispatch(thunkGetSingleSpot(spotId))
            setCountry(spot.country)
            setAddress(spot.address)
            setCity(spot.city)
            setState(spot.state)
            setLat(spot.lat)
            setLng(spot.lng)
            setName(spot.name)
            setDescription(spot.description)
            setPrice(spot.price)
            setOwnerId(spot.ownerId)
        }
        findSpot()
        // eslint-disable-next-line
    }, [])


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
        // eslint-disable-next-line
        if (Number(price) != price) errorObj.price = 'Price must be a number!'
        // eslint-disable-next-line
        if (Number(price) < 1) errorObj.price = 'Price must be positive!'
        // eslint-disable-next-line
        if (Number(lat) != lat) errorObj.lat = 'Latitude must be a number!'
        // eslint-disable-next-line
        if (Number(lng) != lng) errorObj.lng = 'Longitude must be a number!'

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
            const res = await dispatch(thunkEditSpot(spot, spotId))
            if (res.errors) {
                const err = res.errors
                setErrors(err)
                return
            } else {
                const id = res.id
                history.push(`/spots/${id}`)
            }

        }
    }



    if (userId === ownerId) {

        return (
            <div className='edit-spot-container'>
                <div className='edit-spot-form'>
                    <h1>Update your spot</h1>

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

                        <div id='submit'><button type='submit' className='updatebutton'>Update Your Spot</button></div>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <h2>Oh snap! Not your spot...</h2>
        )
    }
}

export default EditSpot;
