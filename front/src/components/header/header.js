import React from 'react';
import SearchBar from './search-bar';
import ProfileIcons from './profile-icons';
import LogoIcon from './logo-icon';


export default class Header extends React.Component {
		render() {
			return (
			    <div className="headerMain">
                    <div className='header'>
                        <LogoIcon />
                        <SearchBar />
                        <ProfileIcons />
                    </div>
                </div>
			);
		}
}