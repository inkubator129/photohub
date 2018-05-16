import React from 'react';
import axios from 'axios';
import base64 from 'base-64';
import { ROOT_URL } from './../../actions/index';
import {
    Modal,
    ModalBody,
} from 'react-modal-bootstrap';
import * as cookie from "react-cookie";
import UserHolder from '../user_service';

const folder = './../../../static/user/';


export default class SelectedPost extends React.Component{
    user = cookie.load('user');

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const comment = e.target.value;
            e.target.value = '';
            if (comment){
                const credInfo = cookie.load('credInfo');
                const config = {headers:
                    {
                        "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                        'Content-Type': 'application/json'
                    }
                };
                let data = new FormData();
                let onEvent = this.props.onEvent;
                data.append('post_id', this.props.post.id);
                data.append('comment', comment);
                axios.post(`${ROOT_URL}/api/posts/comment`,
                    data, config
                ).then(function (response) {
                    onEvent();
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
    };

    _handleLike = (e) => {
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        let data = new FormData();
        let onEvent = this.props.onEvent;
        data.append('post_id', this.props.post.id);
        axios.post(`${ROOT_URL}/api/posts/like`,
            data, config
        ).then(function (response) {
            onEvent();
        }).catch(function (error) {
            console.log(error);
        })

    };

    _handleCommentDeletion(commentId){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        let onEvent = this.props.onEvent;
        axios.delete(`${ROOT_URL}/api/posts/comment/${commentId}`, config
        ).then(function (response) {
            onEvent();
        }).catch(function (error) {
            console.log(error);
        })
    }

    _handlePostDeletion(){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        axios.delete(`${ROOT_URL}/api/posts/post/${this.props.post.id}`, config
        ).then((response) => {
            window.location.replace(`http://127.0.0.1:8000/profile/${this.user.username}/`);
        }).catch(function (error) {
            console.log(error);
        })
    }

    renderComments(){
        this.props.post.comments.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            });
        return this.props.post.comments.map((comment) => {
                return(
                    <div className="split-block">
                        <div className="comment">
                            <span><a href={'/profile/' + comment.user.username} className="clickable"><b>{comment.user.username}</b></a>&nbsp; {comment.text}</span>
                        </div>
                        {(comment.user_id === this.user.id ||
                        this.props.post.user_id === this.user.id) &&
                        <div className="delete-comment-btn" onClick={() => this._handleCommentDeletion(comment.id)}>
                            x
                        </div>
                        }
                    </div>
                );
        });
    }

    renderLikeButton(){
        if (this.props.post.likes.filter((like) => {
            return like.user_id === this.user.id;
        }).length > 0){
            return <span className='glyphicon glyphicon-heart heart-icon-small-red'
                         onClick={this._handleLike} />;
        }
        return <span className='glyphicon glyphicon-heart heart-icon-small-black'
                     onClick={this._handleLike} />

    }

    render(){
        let backdropStyles = {
            base: {
                background: 'rgba(0, 0, 0, .7)',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.4s',
                overflowX: 'hidden',
                overflowY: 'hidden'
            },
            open: {
                opacity: 1,
                visibility: 'visible',
                overflowY: 'hidden'
            }
        };
        let dialogStyles = {
            base: {
                top: '5%',
                transition: 'top 0.4s'
            },
            open: {
                top: '5%',
                width: (this.props.post.width + 270).toString() + 'px'
            }
        };
        return(

            <Modal isOpen={this.props.modalIsOpen}  backdropStyles={backdropStyles} dialogStyles={dialogStyles}  onRequestHide={this.props.toggleModal}>
                <ModalBody>
                    <div className="post-container">
                        <div className="modal-photo" width={this.props.post.width}>
                            <div className="on-hover-post-image">
                            </div>
                            <img className="postImage" onDoubleClick={this._handleLike}
                                 src={folder+this.props.post.img_url}
                                 width={this.props.post.width}
                                 height={this.props.post.height}
                            />
                        </div>
                        <div className="modal-actions" height={this.props.post.height}>
                            <div className="owner-block">
                                <div className="owner-photo">
                                    <img src={folder+this.props.user.avatar_url}/>
                                </div>
                                <div className="owner-info">
                                    <a href={'/profile/' + this.props.user.username} className="clickable">{this.props.user.username}</a>
                                </div>
                                {this.user.id === this.props.user.id &&
                                <div className="delete-post">
                                    <span className="glyphicon glyphicon-trash" onClick={this._handlePostDeletion.bind(this)}/>
                                </div>
                                }
                                <div className="buttons">
                                    {this.renderLikeButton()}
                                    <span className="likesText" >{this.props.post.likes.length}likes</span>

                                </div>
                            </div>
                            <div className="comments-block">
                                {this.renderComments()}
                            </div>
                            <div className="form-block">
                                <input type="text" placeholder="Leave your comment.." className="form-control" onKeyPress={this._handleKeyPress} />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }


}