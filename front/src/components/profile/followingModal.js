import React from 'react';
import axios from 'axios';
import base64 from 'base-64';
import { ROOT_URL } from './../../actions/index';
import {
    Modal,
    ModalBody,
} from 'react-modal-bootstrap';
import * as cookie from "react-cookie";

const folder = './../../../static/user/';


export default class FollowingModal extends React.Component{
    user = cookie.load('user');
    componentWillMount(){
        this.following = [];
        this.props.following.map((row) =>{
            row.status = true;
            this.following.push(row);
        });
    }

    handleFollow(row){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        // let onEvent = this.onEvent;
        axios.post(`${ROOT_URL}/api/profile/follow/`,
            {'user_id': row.following.id},config
        ).then((response) => {
            row.status = !row.status;
            this.forceUpdate();
        }).catch(function (error) {
            console.log(error);
        })
    }

    renderButton(row){
        if (row.status === true){
            return <button className="btn btn-primary"
                           onClick={() => this.handleFollow.bind(this)(row)}>Unfollow</button>;
        } else {
            return <button className="btn btn-defalut"
                           onClick={() => this.handleFollow.bind(this)(row)}>Follow</button>;
        }

    }

    renderFollowers(){
        return this.following.map((row) => {
            return (
                <div className="followerBlock">
                    <img src={folder + row.following.avatar_url} />
                    <div className="followerInfo">
                        <span className="followerUsername">{row.following.username}</span>
                        <br/>
                        <span className="followerName">{row.following.name}</span>
                    </div>
                    {this.props.owner && this.renderButton.bind(this)(row)}
                </div>
            );
        });
    }

    render(){
        console.log(this.user);
        let backdropStyles = {
            base: {
                background: 'rgba(0, 0, 0, .7)',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.4s',
                overflowX: 'hidden',
                overflowY: 'scroll'
            },
            open: {
                opacity: 1,
                visibility: 'visible'
            }
        };
        let dialogStyles = {
            base: {
                top: 100,
                transition: 'top 0.4s'
            },
            open: {
                top: 100,
                width: '400px'
            }
        };
        return(

            <Modal isOpen={this.props.modalIsOpen} backdropStyles={backdropStyles} dialogStyles={dialogStyles}  onRequestHide={this.props.toggleModal}>
                <ModalBody>
                    <div >
                        {this.renderFollowers()}
                    </div>
                </ModalBody>
            </Modal>
        );
    }


}