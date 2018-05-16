import React from 'react';
import { Field, reduxForm, formValueSelector} from 'redux-form';
import { connect } from 'react-redux'
import axios from 'axios';
import base64 from 'base-64';
import { ROOT_URL } from './../../actions/index';
import * as cookie from "react-cookie";


const renderField = ({input, type, placeholder, value, meta: {touched, invalid}}) => (

    <input {...input} type={type} placeholder={placeholder}
       className="clear-valid" />
);


class EditBioForm extends React.Component{

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
        axios.post(`${ROOT_URL}/api/profile/editbio`,
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
                        <span>Name: </span>
                    </div>
                    <div className="inputField">
                        <Field name="name" type="text"
                             component={renderField} />
                    </div>
                </div>


                <div className="rowCont">
                    <div className="labelField">
                        <span>Username: </span>
                    </div>
                    <div className="inputField">
                        <Field name="username" type="text"
                               component={renderField} />
                    </div>
                </div>
                <div className="rowCont">
                    <div className="labelField">
                        <span>Website: </span>
                    </div>
                    <div className="inputField">
                        <Field name="email" type="email"
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

    if (!values.name) {
        errors.name = "Enter a name";
    }


    if (!values.email) {
        errors.email = "Enter an email";

    }

    if (!values.username) {
        errors.username = "Enter an username";

    }
    return errors;
}


EditBioForm =  reduxForm({
    form: 'editBioForm',
    enableReinitialize: true,
    validate
})(EditBioForm);

const user = cookie.load('user');

EditBioForm = connect(
    state => ({
    initialValues: {
        username: user.username,
        name: user.name,
        email: user.email}
}))(EditBioForm);

export default EditBioForm;