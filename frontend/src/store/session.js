import { csrfFetch } from "./csrf"

export const START_SESSION = 'session/ADD'
export const END_SESSION = 'session/END'

export const startSession = (user) => {
    return {
        type: START_SESSION,
        user
    }
}

export const endSession = (user) => {
    return {
        type: END_SESSION,
        user
    }
}

export const thunkStartSession = (user) => async (dispatch) => {
    const { credential, password } = user;
    const res = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await res.json();
    dispatch(startSession(data.user));
    return res;
}

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(startSession(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(endSession());
    return response;
  };


export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(startSession(data.user));
    return response;
  };


const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_SESSION: {
            const newState = {...state}
            newState.user = action.user
            return newState
        }
        case END_SESSION: {
            const newState = {...state}
            newState.user = null;
            return newState
        }

        default:
            return state;
    }
}

export default sessionReducer;
