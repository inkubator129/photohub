import React from 'react';
import Header from '../header/header';
import EditProfileTab from './edit_profile_tab';

export default class EditProfilePage extends React.Component{

    render(){
        return(
            <div>
                <Header/>
                <EditProfileTab/>
            </div>
        );
    }


}