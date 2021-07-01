import React, { createContext, useContext, useReducer } from 'react';
import axios from '../api/axiosApp';

/**
 * Auth reducer
 */

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signin':
      return {
        id_user: action.payload.userId,
        email: action.payload.email,
        name: action.payload.name,
        token: action.payload.token,
      };
    case 'logout':
      return {
        id_user: '',
        email: '',
        name: '',
        token: '',
      };
    default:
      return state;
  }
};

/* Actions */

/**
 * Sign in / log in
 */
const signin = dispatch => async ({ email, password, onSuccess, onError }) => {
  try {
    const res = await axios.post(
      '/users/login',
      {
        email: email,
        password: password
      }
    );
    dispatch({ type: 'signin', payload: res.data });
    localStorage.setItem('token', res.data.token);
    onSuccess(res.data);
  } catch (err) {
    console.error('ERRORSITO: ' + err);
    onError();
  }
};

/**
 * Log out
 */
const logout = dispatch => onCompleted => {
  dispatch({ type: 'logout' });
  localStorage.removeItem('token');
  // onCompleted is a callback function that redirects user to login
  onCompleted();
};

/**
 * Verify token
 */
const testToken = dispatch => async (token) => {
  try {
    const response = await axios.get('/users/verify_token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.data)
    {
      dispatch({ type: 'signin', payload: { ...response.data, token: response.data.token } });
    }
    else
    {
      dispatch({ type: 'logout', payload: { ...response.data, token: response.data.token } });
      localStorage.removeItem('token');
    }
  } catch (err) {
    dispatch({ type: 'logout', payload: { } });
    localStorage.removeItem('token');
  }
};

/* Context */
export const AuthContext = createContext();

/* Hook */
export function useAuth() {
  return useContext(AuthContext);
}

/* Provider */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    id_user: '',
    token: '',
    email: '',
    name: ''
  });

  const boundActions = {
    signin: signin(dispatch),
    logout: logout(dispatch),
    testToken: testToken(dispatch)
  };

  return (
    <AuthContext.Provider value={{ state, ...boundActions }}>
      {children}
    </AuthContext.Provider>
  );
}
