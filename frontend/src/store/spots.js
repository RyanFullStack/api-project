import { csrfFetch } from "./csrf"

export const GET_ALL_SPOTS = 'spots/GETALL'
export const GET_SINGLE_SPOT = 'spots/GETONE'
export const CREATE_SPOT = 'spots/NEW'

export const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
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

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots')
    const data = await res.json()
    dispatch(getAllSpots(data))
    return data;
}

export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
    const data = await res.json()
    dispatch(getSingleSpot(data))
    return data;
}

export const thunkCreateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createSpot(data))
    }
    return data;
}


const initialState = {
    allSpots: {},
    singleSpot: {}
}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {...state}
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
            return newState
        }
        case GET_SINGLE_SPOT: {
            const newState = {...state}
            newState.singleSpot = action.spot
            return newState
        }
        case CREATE_SPOT: {
            const newState = {...state}
            newState.singleSpot = action.spot
            return newState
        }
        default:
            return state
    }
}

export default spotReducer;
