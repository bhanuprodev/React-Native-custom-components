import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { TouchableOpacity, View, Text, Button, ScrollView, Dimensions, Modal, ActivityIndicator, ImageBackground } from 'react-native';
import Animated, { BounceIn, BounceInUp, BounceOut, BounceOutUp, SlideInDown, SlideInUp } from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ColorConstants from '../constants/ColorConstants';



const GlobalLoaderByProvider = forwardRef(({ ...props }, ref) => {

  const [visible, setVissible] = useState(false)
  const cancellable = useRef(true)

  useImperativeHandle(ref, () => ({
    loaderRefresh(visiblity = false, cancell = true) {
      cancellable.current = cancell
      setVissible(visiblity)
    },

  }))


  return visible ? <Modal transparent style={{}} onRequestClose={() => {
    if (cancellable.current) setVissible(false)
  }}>
    <Animated.View key={"rfhruief"} entering={SlideInDown.delay(200)} exiting={SlideInUp.delay(50)} style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000050', flex: 1 }}>

      <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', width: 80, height: 80, backgroundColor: 'white', borderRadius: 10 }}>
        {/* <FontAwesome5 name="pen" style={{}} size={15} color={ColorConstants.baseBlueColor} /> */}
        <ActivityIndicator size={40} color={ColorConstants.baseOrangeColor} style={{ position: 'absolute', borderRadius: 10 }}>

        </ActivityIndicator>
      </View>

    </Animated.View>
  </Modal> : null


  return <Animated.View entering={BounceInUp.delay(50)} exiting={BounceOut.delay(50)} style={{ backgroundColor: 'red', flex: 1 }}>

  </Animated.View>
});
export default GlobalLoaderByProvider;