import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie'
import { fetchFeed } from './../../actions/index';
import SelectedPost from './../profile/selected_post';
const folder = './../../../static/user/';

class Dashboard extends React.Component {
    constructor(props){
        super(props);

        this.state = {modalIsOpen: false, selectedPost: null, owner: null};
        this.toggleModal = this.toggleModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    componentWillMount(){
        this.props.fetchFeed(cookie.load('credInfo'));
    }

    toggleModal(post, owner){
        this.setState({modalIsOpen: true, selectedPost: post, owner: owner});
    }

    hideModal(){
        this.setState({modalIsOpen: false, selectedPost:null, owner: null});
    }


    onEvent(){
        this.props.fetchFeed(cookie.load('credInfo'));
    }
    componentWillReceiveProps(nextProps) {
        let updatedPost;
        if (this.state.selectedPost){
            for (let i = 0, len = nextProps.following.length; i < len; i++) {

                for (let j = 0, len1 = nextProps.following[i].posts.length; j < len1; j++) {
                    if (nextProps.following[i].posts[j].id === this.state.selectedPost.id) {
                        updatedPost = nextProps.following[i].posts[j];
                        break;
                    }
                }


            }
            this.setState({...this.state, selectedPost: updatedPost});
        }
        //   this.setState({...this.state});
    }
    renderModal(){
        if (this.state.selectedPost){
            return <SelectedPost post={this.state.selectedPost}
                                 user={this.state.owner}
                                 onEvent={this.onEvent.bind(this)}
                                 toggleModal={this.hideModal}
                                 modalIsOpen={this.state.modalIsOpen} />;
        }
    }
    renderPosts(){
        if (!this.props.following){
            return (
                <div>
                    <h3 className="no-posts">... Loading ...</h3>
                </div>
            );
        }
        return this.props.following.map((user) => {
            user.posts.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
            });
            return user.posts.map((post) => {
                return(
                    <div className="dash-post">
                        <div className="onHoverImage" onClick={() => this.toggleModal(post, user)}>
                            <span className='glyphicon glyphicon-heart heart-icon white-heart' />
                            <span className="white-heart">{post.likes.length}</span>
                            <span className='glyphicon glyphicon-comment white-heart' />
                            <span className="white-heart">{post.comments.length}</span>
                        </div>
                        <img src={folder+post.img_url} key='1' width={300} height={300}/>

                    </div>
                );
            });
        });
    }


    render() {
        return (
            <div>
                {this.renderModal.bind(this)()}
                {/*<div className="col-md-12 col-xs-12 posts-container">*/}
                    {/*{this.renderPosts.bind(this)()}*/}
                {/*</div>*/}
                <div className="dash-posts">
                    {this.renderPosts.bind(this)()}
                </div>
            </div>

        );
    }
}



function mapStateToProps(state) {
    return {
        following: state.userDashboard.following
    };
}

export default connect(mapStateToProps, {fetchFeed})(Dashboard);