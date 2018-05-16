import React from 'react';
import Slider from 'react-slick';

const baseUrl = "./../../../static/images";

export default class ImageSlider extends React.Component{
    render(){
        const settings = {
            dots: false,
            infinite: true,
            autoplay:true,
            speed: 500,
            slidesToShow: 1,
            fade: true,
            pauseOnHover:false,
            draggable: false
            // adaptiveHeight:true
        };

        const images = [
            'slide1.png',
            'slide2.png',
            'slide3.png'
        ];
        return(
            <div className="">
                <div className="slider-block ">
                    <Slider {...settings}>
                        {images.map((url, key) =>
                        <div>
                            <img key={key} src={`${baseUrl}/${url}`} className="slide-image"/>
                        </div>
                        )}
                    </Slider>
                </div>
            </div>
        );
    }
}