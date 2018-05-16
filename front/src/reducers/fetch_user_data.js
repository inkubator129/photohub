import {FETCH_USER_DATA} from '../actions/index';

const INITIAL_STATE = {all: [], currentPost:null, user: null, followers: null,
following: null};

export default function fetchUserPosts(state=INITIAL_STATE, action) {
    switch(action.type){
    case FETCH_USER_DATA:
        console.log( action.payload.data.followers[0]);
        return {
            ...state,
            user: action.payload.data.user[0],
            followers: action.payload.data.followers[0],
            following: action.payload.data.following[0],
        };
    default:
        return state;
    }
}