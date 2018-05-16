import React, {Component} from 'react'
import { Menu, Grid,  Segment } from 'semantic-ui-react'
import UserHolder from '../user_service';
import EditBioForm from './edit_bio_form';
import EditPassForm from './edit_pass_form';
import EditPhotoForm from './edit_photo_form';

import cookie from 'react-cookie';

const folder = './../../../static/user/';

export default class MenuExampleTabularOnLeft extends Component {

    constructor(props){
        super(props);

        this.state = { activeItem: 'bio' };
        this.user = cookie.load('user');
    }



    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    renderForm(){
        if (this.state.activeItem === 'bio'){
            return(
                <div>
                    <div className="userLink">
                        <img src={folder + this.user.avatar_url} width={35} height={35}/>
                        <span className="username">{this.user.username}</span>
                    </div>
                    <EditBioForm/>
                </div>
            );
        } else if (this.state.activeItem === 'private'){
            return(
                <div>
                    <EditPassForm/>
                </div>
            );
        } else if (this.state.activeItem === 'photo'){
            return(
                <div>
                    <EditPhotoForm/>
                </div>
            );
        }
    }

    render() {
        const { activeItem } = this.state;

        return (
            <div className="editProfileBlock">
                <div className="editMain">
                <Grid>
                    <Grid.Column width={4}>
                        <Menu fluid vertical tabular>
                            <Menu.Item name='bio' active={activeItem === 'bio'} onClick={this.handleItemClick} />
                            <Menu.Item name='private' active={activeItem === 'private'} onClick={this.handleItemClick} />
                            <Menu.Item name='photo' active={activeItem === 'photo'} onClick={this.handleItemClick} />
                            {/*<Menu.Item name='links' active={activeItem === 'links'} onClick={this.handleItemClick} />*/}
                        </Menu>
                    </Grid.Column>

                    <Grid.Column stretched width={12}>
                        <Segment>
                            {this.renderForm()}
                        </Segment>
                    </Grid.Column>
                </Grid>
                </div>
            </div>
        )
    }
}
