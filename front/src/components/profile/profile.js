import React from 'react';
import { fetchUserData } from './../../actions/index';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import base64 from 'base-64';
import { ROOT_URL } from './../../actions/index';
import Header from '../header/header';
import SelectedPost from './selected_post';
import FollowersModal from './followersModal';
import FollowingModal from './followingModal';
import UserInfo from './user_info';
import Avatar from './user_photo';
import ReactPaginate from 'react-paginate';

const folder = './../../../static/user/';

class Profile extends React.Component {
    constructor(props){
        super(props);
        this.username = this.props.routeParams.user;
        this.user = cookie.load('user');
        this.owner = false;
        this.state = {
            modalIsOpen: false,
            selectedPost: null,
            followModalIsOpen: false,
            followingModalIsOpen: false,
            activePage: 1
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.posts = []
    }

    componentWillMount(){
        if (this.user.username === this.props.routeParams.user) {
            this.owner = true;
        }
        this.props.fetchUserData(cookie.load('credInfo'), this.props.routeParams.user);

    }

    renderPosts(){
        if (!this.props.user){
            return (
              <div>
                  <h3 className="no-posts">... Loading ...</h3>
              </div>
            );
        }
        const startIndex = (this.state.activePage - 1) * 3;
        let lastIndex = this.state.activePage * 3;
        if (this.state.activePage === this.countOfPages){
            lastIndex = this.props.user.posts.length;
        }

        this.posts = [];
        for (let i = startIndex; i < lastIndex; i++) {
            this.posts.push(
                <div className="col-md-4 user-post" key={i}>
                    <div className="onHoverImage" onClick={() => this.toggleModal(this.props.user.posts[i])}>
                        <span className='glyphicon glyphicon-heart heart-icon white-heart'/>
                        <span className="white-heart">{this.props.user.posts[i].likes.length}</span>
                        <span className='glyphicon glyphicon-comment white-heart'/>
                        <span className="white-heart">{this.props.user.posts[i].comments.length}</span>
                    </div>
                    <img src={folder + this.props.user.posts[i].img_url} key='1' width={300} height={300}/>

                </div>
            );
        }
        return this.posts;

        // return this.props.user.posts.map((post) => {
        //     return(
        //         <div className="col-md-4 user-post">
        //             <div className="onHoverImage" onClick={() => this.toggleModal(post)}>
        //                 <span className='glyphicon glyphicon-heart heart-icon white-heart' />
        //                 <span className="white-heart">{post.likes.length}</span>
        //                 <span className='glyphicon glyphicon-comment white-heart' />
        //                 <span className="white-heart">{post.comments.length}</span>
        //             </div>
        //             <img src={folder+post.img_url} key='1' width={300} height={300}/>
        //
        //         </div>
        //     );
        // });
    }

    onEvent(){
        this.props.fetchUserData(cookie.load('credInfo'), this.props.routeParams.user);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectedPost){
            let updatedPost;
            for (let i = 0, len = nextProps.user.posts.length; i < len; i++) {
                if (nextProps.user.posts[i].id === this.state.selectedPost.id){
                    updatedPost = nextProps.user.posts[i];
                    break;
                }
            }
            this.setState({...this.state, selectedPost: updatedPost});
        }

        if (nextProps.user){
            this.countOfPages = Math.ceil(nextProps.user.posts.length / 3);
            console.log(this.countOfPages);
        }


     //   this.setState({...this.state});
    }

    renderModal(){
        if (this.state.selectedPost){
            return <SelectedPost post={this.state.selectedPost}
                                 user={this.props.user}
                                 onEvent={this.onEvent.bind(this)}
                                 toggleModal={this.hideModal}
                                 modalIsOpen={this.state.modalIsOpen} />;
        }
    }

    renderFollowersModal(){
        if (this.state.followModalIsOpen){
            return <FollowersModal followers={this.props.followers}
                                   following={this.props.following}
                                   owner={this.owner}
                                   onEvent={this.onEvent.bind(this)}
                                   toggleModal={this.hideFollowModal.bind(this)}
                                   modalIsOpen={this.state.followModalIsOpen} />;
        }
    }

    renderFollowingModal(){
        if (this.state.followingModalIsOpen){
            return <FollowingModal following={this.props.following}
                                   onEvent={this.onEvent.bind(this)}
                                   owner={this.owner}
                                   toggleModal={this.hideFollowingModal.bind(this)}
                                   modalIsOpen={this.state.followingModalIsOpen} />;
        }
    }
    toggleModal(post){
        this.setState({modalIsOpen: true, selectedPost: post});
    }

    hideModal(){
        this.setState({modalIsOpen: false, selectedPost:null});
    }

    hideFollowModal(){
        this.setState({...this.state, followModalIsOpen: false});
    }

    toggleFollowModal(){
        if (this.props.followers.length > 0){
            this.setState({...this.state, followModalIsOpen: true});
        }
    }


    toggleFollowingModal(){
        if (this.props.following.length > 0) {
            this.setState({...this.state, followingModalIsOpen: true});
        }
    }

    hideFollowingModal(){
        this.setState({...this.state, followingModalIsOpen: false});
        this.onEvent();
    }

    handleFollow(){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };
        axios.post(`${ROOT_URL}/api/profile/follow/`,
            {'user_id': this.props.user.id},config
        ).then((response) => {
            this.onEvent();
        }).catch(function (error) {
            console.log(error);
        })
    }

    renderFollowButton(){
        if (!this.owner){
            if (this.props.followers.filter((follower) => {
                    return follower.follower.id === this.user.id;
                }).length > 0){
                return (
                    <button
                        className="btn btn-default in-row edit-btn"
                        onClick={this.handleFollow.bind(this)}>Unfollow</button>
                );
            }
            return (
                <button
                    className="btn btn-default in-row edit-btn"
                    onClick={this.handleFollow.bind(this)}>Follow</button>
            );


        }
    }

    renderUserInfo(){
            return (
                <div className="col-md-12 col-xs-12 user-details" >
                    <div className="col-md-1"></div>
                    <div className="col-md-3">
                        <img src={folder+ this.props.user.avatar_url}
                        className="user-avatar" width={150} height={130} />
                    </div>
                    <div className="col-md-8 ">
                        <div className="row">
                            <h3 className="in-row"> {this.props.user.username} </h3>
                            {this.owner &&
                            <Link to="/edit" className="btn btn-default in-row edit-btn"> Edit profile
                            </Link>
                            }




                            {this.renderFollowButton.bind(this)()}
                            <div className="fb-share-button"
                                 data-href={'http://127.0.0.1:8000/profile/' + this.props.routeParams.user}
                                 data-layout="button"
                                 data-size="small"
                                 data-mobile-iframe="true">
                            </div>
                        </div>
                        <div className="row">
                            <p>{this.props.user.name} <a href="#">{this.props.user.email}</a></p>
                        </div>
                        <br/>
                        <div className="row">
                            <p>
                                <span onClick={this.toggleFollowModal.bind(this)}
                                      className="clickable">
                                    {this.props.followers.length} followers
                                </span> | &nbsp;
                                <span onClick={this.toggleFollowingModal.bind(this)}
                                      className="clickable">
                                    {this.props.following.length} following
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            );
    }

    handlePageClick = (data) => {
        this.setState({...this.state, activePage: data.selected + 1});
    };

    render() {
        if (this.props.user){
            if (this.user.id === this.props.user.id){
                this.user = this.props.user;
                cookie.save('user', this.user , { path: '/' });
            }
            return (
                <div>
                    <Header />
                    <div className="container">
                        {this.renderUserInfo()}
                        {this.renderModal()}
                        {this.renderFollowersModal()}
                        {this.renderFollowingModal()}
                        <div className="col-md-12 paginationContent">
                            <ReactPaginate previousLabel={'prev'}
                                           nextLabel = {'next'}
                                           pageCount={this.countOfPages}
                                           marginPagesDisplayed={2}
                                           pageRangeDisplayed={2}
                                           onPageChange={this.handlePageClick}
                                           containerClassName={"pagination"}
                                           subContainerClassName={"pages pagination"}
                                           activeClassName={"active"} />
                        </div>
                        <div className="col-md-12 col-xs-12 posts-container">
                        {this.renderPosts()}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div> 
                <Header />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userData.user,
        followers: state.userData.followers,
        following: state.userData.following
    };
}

export default connect(mapStateToProps, {fetchUserData})(Profile);