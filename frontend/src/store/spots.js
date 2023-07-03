export const GET_ALL_SPOTS = 'spots/GETALL'
export const GET_SINGLE_SPOT = 'spots/GETONE'

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

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots')
    const data = await res.json()
    dispatch(getAllSpots(data))
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
        default:
            return state
    }
}

export default spotReducer;
