import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// import loginReducer from './login_reducer';
import userDataReducer from './fetch_user_data';
import userDashboardReducer from './fetch_feed';

const rootReducer = combineReducers({
    form: formReducer,
    userData: userDataReducer,
    userDashboard: userDashboardReducer
});

export default rootReducer;
