import React from 'react';
import axios from 'axios';
import base64 from 'base-64';
import cookie from 'react-cookie';
import { ROOT_URL } from './../../actions/index';

const folder = './../../../static/user/';


export default class EditPhotoForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {file: '',imagePreviewUrl: '', dimensions:{}};
        this.user = cookie.load('user');
        this.onImgLoad = this.onImgLoad.bind(this);
    }


    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    }

    onImgLoad({target:img}){
        this.setState({...this.state,dimensions:{height:img.offsetHeight,
            width:img.offsetWidth}});
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (this.state.file && this.state.file.type.includes("image")){

            let file = this.state.file;

            const credInfo = cookie.load('credInfo');
            const config = {headers:
                {
                    "Authorization": `Basic ${base64.encode(credInfo+":")}`,
                    "Content-Type": "multipart/form-data"
                }
            };
            let data = new FormData();
            data.append('filename', file.name);
            data.append('width', this.state.dimensions['width']);
            data.append('height', this.state.dimensions['height']);
            data.append('type', file.type.split("/")[1]);
            let fr = new FileReader();
            fr.onload = () => {
                data.append('file', fr.result);
                axios.post(`${ROOT_URL}/api/profile/change_photo/`,
                    data, config
                ).then((response) => {
                    window.location.replace(`http://127.0.0.1:8000/profile/${this.user.username}/`);
                }).catch(function (error) {
                    console.log(error);
                })
            };
            fr.readAsDataURL(file);
        }
    }

    render(){
        let {imagePreviewUrl} = this.state;
        let imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = (<img onLoad={this.onImgLoad} src={imagePreviewUrl}  width={150} height={150}/>);
        } else {
            imagePreview = (<img src={folder + this.user.avatar_url} width={150} height={150}/>);
        }

        return (
            <div>
                <div className="labelContainer">
                    <label className="fileContainer">
                        {imagePreview}
                        <input type="file" onChange={(e)=>this._handleImageChange(e)} />
                    </label>
                </div>
                <div className="btn-container">
                    <button className="submitButton"
                            type="submit"
                            onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
                </div>
            </div>
        );
    }


}