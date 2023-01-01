import React, { useEffect, useRef, useState } from 'react'; 
import FastImage from 'react-native-fast-image';
import ImageWrapper from '../resources/images/ImageWrapper';

const ImageHandler = ({url="",width=70,height=70,borderRadius=70,...props}) => {
     
    const [imageUrl,setImageUrl]=useState(url)
    useEffect(()=>{

    }) 
    return (
        
           <FastImage 
           onError={()=>{
            setImageUrl("")
           }} 
           style={{width:width,height:height,borderRadius:borderRadius}} source={imageUrl&&imageUrl.startsWith("https")?{uri:imageUrl}:ImageWrapper.avathar} >

           </FastImage>
    )
};
export default ImageHandler;