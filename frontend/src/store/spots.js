import { csrfFetch } from "./csrf"

export const GET_ALL_SPOTS = 'spots/GETALL'
export const GET_SINGLE_SPOT = 'spots/GETONE'
export const CREATE_SPOT = 'spots/NEW'
export const CREATE_SPOT_IMAGE = 'spot/NEWIMAGE'
export const GET_USER_SPOTS = 'spots/GETUSER'
export const DELETE_SPOT = 'spots/DELETE'
export const EDIT_SPOT = 'spots/EDIT'

export const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

export const getUserSpots = (spots) => {
    return {
        type: GET_USER_SPOTS,
        spots
    }
}

export const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

export const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

export const createSpotImage = (image) => {
    return {
        type: CREATE_SPOT_IMAGE,
        image
    }
}

export const editSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
}

export const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots')
    const data = await res.json()
    dispatch(getAllSpots(data))
    return data;
}

export const thunkGetUserSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots/current')
    const data = await res.json()
    dispatch(getUserSpots(data))
    return data;
}

export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
    const data = await res.json()
    dispatch(getSingleSpot(data))
    return data;
}

export const thunkCreateSpotImage = (image) => async (dispatch) => {
    const { previewImageUrl, id } = image
    const resPreviewImage = await csrfFetch(`/api/spots/${id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: previewImageUrl,
            preview: true
        })
    })
    const data = await resPreviewImage.json()
    return data;
}

export const thunkEditSpot = (spot, spotId) => async (dispatch) => {
    const { country, address, city, state, lat, lng, description, name, price } = spot
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price
        })
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(editSpot(data))
        return data
    } else {
        const err = await res.json()
        return err
    }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        dispatch(deleteSpot(spotId))
    } else {
        const err = await res.json()
            return err;
    }
}


export const thunkCreateSpot = (spot) => async (dispatch) => {
    const { country, address, city, state, lat, lng, description, name, price } = spot

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(createSpot(data))
        return data
    } else {
        const err = await res.json()
        return err;
    }
}


const initialState = {
    allSpots: {},
    singleSpot: {}
}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = { ...state }
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
            return newState
        }
        case GET_USER_SPOTS: {
            const newState = { allSpots:{}, singleSpot: {} }
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
            return newState
        }
        case GET_SINGLE_SPOT: {
            const newState = { ...state }
            newState.singleSpot = action.spot
            return newState
        }
        case CREATE_SPOT: {
            const newState = { ...state }
            newState.singleSpot = action.spot
            return newState
        }
        case DELETE_SPOT: {
            const newState = { ...state, allSpots: {...state.allSpots}}
            delete newState.allSpots[action.spotId]
            return newState
        }
        default:
            return state
    }
}

export default spotReducer;
