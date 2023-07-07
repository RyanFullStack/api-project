const GET_SPOT_REVIEWS = 'spotreviews/GET'

export const getSpotReviews = (reviews) => {
    return {
    type: GET_SPOT_REVIEWS,
    reviews
    }
}



export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)
    if (res.ok) {
        const data = await res.json()
        dispatch(getSpotReviews(data))
        return data
    } else {
        const err = await res.json()
        return err
    }
}

const initialState = {
    spot: {}, user: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_SPOT_REVIEWS: {
        const newState = {spot: {}}
        action.reviews.Reviews.forEach(review => {
            newState.spot[review.id] = review
        })
        return newState;
      }
        default:
            return state;
    }
}

export default reviewsReducer;
