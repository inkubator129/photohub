import React from 'react';
import {
    Modal,
    ModalBody,
} from 'react-modal-bootstrap';
import axios from 'axios';
import base64 from 'base-64';
import cookie from 'react-cookie';
import { ROOT_URL } from './../../actions/index';
const folder = './../../../static/user/';


export default class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {term: '', modalIsOpen: false, res: null};
		this.onInputChange = this.onInputChange.bind(this);
	}

	onInputChange(event){
		event.preventDefault();

        if (event.target.value){
            const credInfo = cookie.load('credInfo');
            const config = {headers:
                {
                    "Authorization": `Basic ${base64.encode(credInfo+":")}`
                }
            };
            const data = {query: event.target.value};
            axios.post(`${ROOT_URL}/api/profile/search`,
                data, config
            ).then((response) =>{
            	if (response.data.response[0].length > 0)
                	this.setState({...this.state, res: response.data.response[0], modalIsOpen: true});
				// console.log(response.data.response[0]);
            }).catch(function (error) {
                console.log(error);
            })
        }
        this.setState({...this.state, term: event.target.value});

    }
	toggleModal(){
        if (this.state.term)
    		this.setState({...this.state, modalIsOpen: !this.state.modalIsOpen});
	}

	renderSearchResponse(){
		if (this.state.res){
			console.log(this.state.res.length);
            return this.state.res.map((user) =>{
				return  (
					<div>
						<div className="searched-user">
							<div className="searched-user-photo">
								<img src={folder + user.avatar_url}/>
							</div>
							<div className="searched-user-info">
								<a href={"/profile/" + user.username}
								   style={{color:'black', textDecoration: 'none'}}
								   className="searched-username clickable">{user.username}</a>
								<br/>
								<span className="searched-name">{user.name}</span>
							</div>
						</div>
						{(this.state.res.indexOf(user) + 1 !== this.state.res.length) &&
							<hr/>
						}
					</div>
				);
			});
		}
	}

	render() {
        let backdropStyles = {
            base: {
                background: 'transparent',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.4s',
                overflowX: 'hidden',
                overflowY: 'scroll'
            },
            open: {
                background: 'transparent',
                opacity: 1,
                visibility: 'visible'
            }
        };
        let dialogStyles = {
            base: {
                top: 20,
                transition: 'top 0.4s',
                width: '200px'
            },
            open: {
                top: 20,
                width: '200px'
            }
        };
		return (
			<div className='search-bar'>
		      	<input 
		      		value={this.state.term}
		      		onChange={this.onInputChange}
		      		placeholder="Search" onClick={this.toggleModal.bind(this)} />
				<Modal isOpen={this.state.modalIsOpen}  backdropStyles={backdropStyles} dialogStyles={dialogStyles}  onRequestHide={this.toggleModal.bind(this)}>
					<ModalBody>
						<div>
							{this.renderSearchResponse.bind(this)()}
						</div>
					</ModalBody>
				</Modal>
	    	</div>
		);	
	}
}