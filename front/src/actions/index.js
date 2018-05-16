import axios from 'axios';
import base64url from 'base64url';
// import base64 from 'base64-js';
import base64 from 'base-64';

export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const FETCH_FEED = 'FETCH_FEED';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';

export const ROOT_URL = 'http://127.0.0.1:8001';

export function loginUser(props){
    const request = axios.post(`${ROOT_URL}/api/authentication/signin`, props);

    return {
        type: LOGIN,
        payload: request
    }
}


export function signupUser(props){
    const request = axios.post(`${ROOT_URL}/api/authentication/signup`, props);

    return {
        type: SIGNUP,
        payload: request
    }
}

export function fetchFeed(credInfo) {
    const config = {headers: {"Authorization": `Basic ${base64.encode(credInfo+':')}`}};
    const request = axios.get(`${ROOT_URL}/api/dashboard/`, config);

    return {
        type: FETCH_FEED,
        payload: request
    }
}

export function fetchUserData(credInfo, username) {
    const config = {headers: {"Authorization": `Basic ${base64.encode(credInfo+':')}`}};
    const request = axios.get(`${ROOT_URL}/api/profile/${username}`, config);

    return {
        type: FETCH_USER_DATA,
        payload: request
    }
}
