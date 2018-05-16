import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app';
import Homepage from './components/homepage';
import Profile from './components/profile/profile';
import EditProfileTab from './components/profile/edit_profile_page';
import ImageUploadPage from './components/image_upload/image-upload-page';


export default (
    <Route path="/" component={App} >
        <IndexRoute component={Homepage} />
        <Route path="/profile/:user" component={Profile}>
        </Route>
        <Route path="/edit" component={EditProfileTab} />

        <Route path="/upload" component={ImageUploadPage} />
    </Route>
);