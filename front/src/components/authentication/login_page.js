import React from 'react';

import SignIn from './signin';
import SignUp from './signup';
import ImageSlider from './slider';

export default class LoginPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {signUpFlag: false};
    }

    changeForm(){
        this.setState({signUpFlag: !this.state.signUpFlag});
    }

    render(){
        // return <ImageSlider/>;
        if (!this.state.signUpFlag) {
            return (
                <div className="login-main">
                    <ImageSlider/>
                    <SignIn onChangeForm={this.changeForm.bind(this)}
                            onSuccess={this.props.onSuccess}/>
                </div>
            );
        }

        return (
            <div  className="login-main">
                <ImageSlider/>
                <SignUp onChangeForm={this.changeForm.bind(this)}
                        onSuccess={this.props.onSuccess}/>
            </div>
        );
    }
}