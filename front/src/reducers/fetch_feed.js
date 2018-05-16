import {FETCH_FEED} from '../actions/index';

const INITIAL_STATE = {posts: []};

export default function fetchDashboardPosts(state=INITIAL_STATE, action) {
    switch(action.type){
        case FETCH_FEED:
            return {
                following: action.payload.data.following[0],
            };
        default:
            return state;
    }
}