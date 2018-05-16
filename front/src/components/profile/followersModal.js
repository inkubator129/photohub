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


export default class FollowersModal extends React.Component{
    user = cookie.load('user');


    handleFollow(user_id){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        // let onEvent = this.onEvent;
        axios.post(`${ROOT_URL}/api/profile/follow/`,
            {'user_id': user_id},config
        ).then((response) => {
            this.props.onEvent();
        }).catch(function (error) {
            console.log(error);
        })
    }

    renderButton(user){
        if (this.props.following.filter((row) => {
            return row.following.id === user.id;
        }).length > 0){
            return <button className="btn btn-primary"
                           onClick={() => this.handleFollow.bind(this)(user.id)}>Unfollow</button>;
        } else {
            return <button className="btn btn-defalut"
                           onClick={() => this.handleFollow.bind(this)(user.id)}>Follow</button>;
        }

    }

    renderFollowers(){
        return this.props.followers.map((row) => {
            return (
                <div className="followerBlock">
                    <img src={folder + row.follower.avatar_url} />
                    <div className="followerInfo">
                        <span className="followerUsername">{row.follower.username}</span>
                        <br/>
                        <span className="followerName">{row.follower.name}</span>
                    </div>
                    {this.props.owner && this.renderButton.bind(this)(row.follower)}
                </div>
            );
        });
    }

    render(){
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
                width: '400px',
                maxHeight: '500px'
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