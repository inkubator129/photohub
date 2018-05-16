import React from 'react';
import { Link } from 'react-router';

export default function(props) {
	return (
		//<div className='col-md-4 col-xs-4'>
			<div className='icon-logo'>
				<a href="/"
					  className='glyphicon glyphicon-camera camera-icon clickable' />
				<a href="/" className="clickable"> <h3 className='clickable'>PhotoHub</h3></a>
			</div>
		//</div>
	);
}