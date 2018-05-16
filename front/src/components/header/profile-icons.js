import React from 'react';
import { Link } from 'react-router';
import * as cookie from "react-cookie";

export default class Header extends React.Component{
    user = cookie.load('user');

    onLogout(){
        cookie.remove('credInfo', { path: '/' });
        cookie.remove('user', { path: '/' });
        window.location.replace("http://127.0.0.1:8000/");
    }

	render(){
        return (
			<div className='profile-icons'>
				<a href='/upload' style={{color:'black', textDecoration: 'none'}}
				   className='glyphicon glyphicon-plus heart-icon clickable' />
				<a href={'/profile/'+this.user.username} style={{color:'black', textDecoration: 'none'}}
				   className='glyphicon glyphicon-user user-icon clickable' />
				<span className='glyphicon glyphicon-off logout-icon clickable'
					  onClick={this.onLogout.bind(this)}/>
			</div>
        );
	}

}