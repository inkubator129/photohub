import React from 'react';
import ImageUpload from './image-upload';
import Header from '../header/header';


export default class ImageUploadPage extends React.Component{
    render(){
        return (
            <div>
                <Header/>
                <ImageUpload/>
            </div>
        );
    }
}