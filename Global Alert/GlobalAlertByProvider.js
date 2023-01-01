import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { TouchableOpacity, View, Text, Button, ScrollView, Dimensions, Modal, ActivityIndicator, ImageBackground, Image } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Animated, { BounceIn, BounceInUp, BounceOut, BounceOutUp, SlideInDown, SlideInUp } from 'react-native-reanimated';
import ColorConstants from '../constants/ColorConstants';
import { CSSStyles } from '../constants/CSSStyles';
import Fonts from '../constants/Fonts';
import StringConstants from '../constants/StringConstants';
import PressableButtonWithDelay from './PressableButtonWithDelay';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageWrapper from '../images/ImageWrapper';
import { getFont } from '../utils/Utils';
import ValueConstants from '../constants/ValueConstants';



const GlobalAlertByProvider = forwardRef(({ ...props }, ref) => {

  const [visible, setVissible] = useState(false)
  const [value, setValue] = useState("")
  const navigationProps = useRef(null)
  const optionsObject = useRef({
    cancel: true,
    type: "Info",
    buttonValues: ["OK"],
    callBacks: null,
    value: StringConstants.SomethingWentWrong,
    canPop: false,
    navigation: null
  })

  useImperativeHandle(ref, () => ({

    alertConfig(visiblity = false, obj) {

      if (obj && visiblity != value) {
        optionsObject.current = { ...obj }
        setValue(value)
        setVissible(visiblity)

      }
    },
    setProps(setprops) {
      navigationProps.current = setprops
    }

  }))


  const renderUi = () => {

    if (optionsObject.current.value == StringConstants.DEVICE_OFFLINE)
      return <Image style={{ tintColor: "white", marginTop: 10 }} source={ImageWrapper.network}></Image>

    if (optionsObject.current.type == "Alert")
      return <AntDesign
        name="closecircle"
        size={40}
        style={{ padding: "5%" }}
        color={ColorConstants.white}
      />
    if (optionsObject.current.type == "Success")
      return <AntDesign
        name="checkcircle"
        size={40}
        style={{ padding: "5%" }}
        color={ColorConstants.white}
      />

    return <Ionicons
      name="ios-warning"
      size={55}
      style={{ padding: "5%", marginBottom: 20 }}
      color={ColorConstants.white}
    />


  }


  return visible ? <ReactNativeModal onBackdropPress={() => {

    if (optionsObject.current.cancel) {
      setVissible(false)
    }
  }} backdropOpacity={0.5} isVisible style={{ margin: 0, padding: 0, }} onBackButtonPress={() => {
    if (optionsObject.current.cancel) setVissible(false)
  }}>
    <Animated.View key={"rfhruief"}
      entering={SlideInDown.delay(200)} exiting={SlideInUp.delay(50)}
      style={{
        alignItems: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: '#00000070',
        bottom: 10, alignSelf: 'center',
        marginHorizontal: 10, borderRadius: 10,
        width: '75%',
        backgroundColor: 'white',
        padding: 20,
      }}>
      <View style={{
        flex: 1, bottom: '75%',
        position: 'absolute',
        width: "150%",
        height: "100%",
        backgroundColor: optionsObject.current.type == "Alert" ?
          ColorConstants.baseOrangeColor : optionsObject.current.type == "Warning" ? "orange" : "#02D402",
        transform: [{ rotate: "7deg" }]
      }}>

      </View>

      {/* <Text style={{
        ...CSSStyles.textInnerHeader,
        fontFamily: Fonts.Mukta_Bold,
        color: ColorConstants.basicBlackcolor,
        paddingVertical: 40
      }}>{optionsObject.current.type}</Text> */}


      {renderUi()}

      <Text style={{
        color: ColorConstants.baseBlueColor,
        fontSize: getFont(ValueConstants.font_extra_large_4x),
        marginTop: "25%", fontFamily: Fonts.Poppins_Medium
      }}>Oops !
      </Text>

      <Text style={{
        ...CSSStyles.textInnerHeader,
        color: ColorConstants.basicBlackcolor,
        paddingVertical: 10,
        marginHorizontal: 20,
      }}>{optionsObject.current.value}</Text>



      {optionsObject.current.buttonValues.map((item) => {

        return <PressableButtonWithDelay key={item}
          style={{
            paddingTop: 10
          }} presshandler={() => {
            setVissible(false)
            try {
              if (optionsObject.current.canPop && navigationProps.current && navigationProps.current.navigation) {
                navigationProps.current.navigation.pop()
              }
            }
            catch (e) {

            }
          }}>
          <View style={{
            backgroundColor: ColorConstants.baseBlueColor,
            paddingVertical: 10, marginBottom: 10,
            borderRadius: 5,
            paddingHorizontal: 60
          }}>
            <Text style={{ ...CSSStyles.textInnerHeader, }}>{item}</Text>
          </View>
        </PressableButtonWithDelay>
      })}



    </Animated.View>
  </ReactNativeModal >
    : null


  return visible ? <Animated.View key={"rfhruief" + new Date().getMilliseconds()} entering={BounceInUp.delay(500)} exiting={SlideInUp.delay(200)} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', bottom: 10, alignSelf: 'center', marginHorizontal: 10, borderRadius: 10, backgroundColor: 'black', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10 }}>
    <AntDesign name="exclamationcircle" size={15} color={isItInfo.current ? "yellow" : "red"} onPress={() => {
      setVissible(false)
    }} style={{ alignSelf: 'center', marginRight: 10 }} />

    <Text numberOfLines={1} style={{ color: 'white', flex: 1, fontFamily: Fonts.ottercoRegular, flexShrink: 1 }}>{value}</Text>
    <AntDesign name="close" size={15} color="white" onPress={() => {
      setVissible(false)
    }} style={{ alignSelf: 'center' }} />



  </Animated.View>
    : null

});
export default GlobalAlertByProvider;