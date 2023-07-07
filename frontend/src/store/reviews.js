import { csrfFetch } from "./csrf"

const GET_SPOT_REVIEWS = 'spotreviews/GET'
const ADD_REVIEW = 'spotreviews/ADD'

export const getSpotReviews = (reviews) => {
    return {
    type: GET_SPOT_REVIEWS,
    reviews
    }
}

export const addSpotReview = (review, sessionUser) => {
    return {
        type: ADD_REVIEW,
        review,
        sessionUser
    }
}

export const thunkAddReview = ({review, spotId, sessionUser}) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(addSpotReview(data, sessionUser))
        return data;
    } else {
        const err = await res.json()
        return err;
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
      case ADD_REVIEW: {
        const newState = {...state, spot: {...state.spot}}
        newState.spot[action.review.id] = action.review;
        newState.spot[action.review.id]['User'] = {
            id: action.sessionUser.id,
            firstName: action.sessionUser.firstName,
            lastName: action.sessionUser.lastName
        }
        return newState
      }
      // eslint-disable-next-line
        default:
            return state;
    }
}

export default reviewsReducer;
