import React from 'react';
import { Field, reduxForm, formValueSelector} from 'redux-form';
import { connect } from 'react-redux'
import axios from 'axios';
import base64 from 'base-64';
import { ROOT_URL } from './../../actions/index';
import * as cookie from "react-cookie";
import UserHolder from '../user_service';

const renderField = ({input, type, placeholder, value, meta: {touched, invalid}}) => (

    <input {...input} type={type} placeholder={placeholder}
           className="clear-valid" />
);


class EditPassForm extends React.Component{

    constructor(props){
        super(props);
        this.user = cookie.load('user');
        this.state = {error: null};
    }

    onSubmit(props){
        const credInfo = cookie.load('credInfo');
        const config = {headers:
            {
                "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                'Content-Type': 'application/json'
            }
        };

        axios.post(`${ROOT_URL}/api/profile/editpass`,
            props ,config
        ).then((response) => {
            window.location.replace(`http://127.0.0.1:8000/profile/${this.user.username}/`);
        }).catch(function (error) {
            console.log(error);
        })
    }

    render() {
        const {handleSubmit} = this.props;

        return(

            <form className="editForm"  onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <div className="rowCont">
                    <div className="labelField">
                        <span>Password: </span>
                    </div>
                    <div className="inputField">
                        <Field name="password" type="password"
                               component={renderField} />
                    </div>
                </div>


                <div className="rowCont">
                    <div className="labelField">
                        <span>Confirmation password: </span>
                    </div>
                    <div className="inputField">
                        <Field name="conf_password" type="password"
                               component={renderField} />
                    </div>
                </div>
                <div className="rowCont">
                    <div className="inputField">
                        <button className="btn btn-primary">Send</button>
                    </div>
                </div>
            </form>
        );
    }
}

function validate(values){
    const errors = {};

    if (!values.password) {
        errors.password = "Enter a password";
    }


    if (!values.conf_password) {
        errors.conf_password = "Enter an confirmation password";

    }

    return errors;
}


EditPassForm =  reduxForm({
    form: 'editPassForm',
    enableReinitialize: true,
    validate
})(EditPassForm);

EditPassForm = connect()(EditPassForm);

export default EditPassForm;