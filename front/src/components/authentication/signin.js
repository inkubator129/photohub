import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {loginUser} from "./../../actions/index" ;
import User from '../user';
import UserHolder from '../user_service';

const renderField = ({input, type, placeholder, value, meta: {touched, invalid}}) => (
    <input {...input} type={type} value={value} placeholder={placeholder}
           className={`${touched && invalid ? 'invalid': 'clear-or-valid'}`} />
);

class Login extends React.Component {
    constructor(props){
        super(props);

        this.state = { error: null, signupFlag: false};

        this.handleClick = this.handleClick.bind(this);
    }
    onSubmit(props){
        this.props.loginUser(props).then(res => {
            if (res.error){
                this.setState({...this.state, error:res.payload.response.data.error});
            } else {
                const user = new User(res.payload.data.user[0]);
                UserHolder.setInstance(user);
                this.props.onSuccess(res.payload.data.token, user);
            }
        });
    }

    handleClick(){
        this.props.onChangeForm();
    }

    render(){
        const {  handleSubmit } = this.props;

        return (
            <div className="">
                <div className="login-div">
                    <h3> PhotoHub </h3>
                    <form className="login-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <Field name="username" type="text"
                               placeholder="username"  component={renderField} />
                        <Field name="password" type="password"
                               placeholder="password" component={renderField} />
                        <h5>{this.state.error}</h5>
                        <button>Sign in</button>
                    </form>
                    <h4>
                        <span className="sign-up-link" onClick={this.handleClick}>
                            Sign up
                        </span>
                        &nbsp;if you don't have an account.
                    </h4>
                </div>
            </div>
        );
    }
}


function validate(values){
    const errors = {};

    if (!values.username) {
        errors.username = "Enter a username";
    }


    if (!values.password) {
        errors.password = "Enter a password";

    }
    return errors;
}

export default connect(null, {loginUser})(reduxForm({
    form: 'LoginUserForm',
    validate
})(Login));