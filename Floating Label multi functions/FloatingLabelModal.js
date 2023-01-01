import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { TouchableOpacity, View, Text, Button, ScrollView, Dimensions, Modal } from 'react-native';
import Animated, { BounceIn, FadeInDown, PinwheelIn, SlideInDown, SlideInRight, SlideInUp } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/ColorConstants';
import { CSSStyles } from '../constants/CSSStyles';
import Fonts from '../constants/Fonts';
import ValueConstants from '../constants/ValueConstants';
import { getFont } from '../utils/Utils';
import { FoatingLabelStyles } from './FloatLabelInput';

const FloatingLabelModal = forwardRef(({ onDown = null, onSelectedItem,
  initialValue = "Operational Manager",
  data = ["Manager", "Operational Manager", "General Manager"],
  ...props }, ref) => {
  const [value, setValue] = useState(initialValue)
  const [isVisible, setIsVissible] = useState(false)
  const [margin, setMargin] = useState(0)
  const [alignTop, setAlignTop] = useState(false)
  const [alignBottom, setAlignBottom] = useState(false)
  const [maxHeight, setMaxHeight] = useState(null)
  const [marginLeft, setMarginLeft] = useState(0)
  const [width, setWidth] = useState(0)

  useImperativeHandle(ref, () => ({
    refresh(width, height, pageX, pageY, data = "Operational Manager") {
      if (props.responsiveHeight() / 2 >= (pageY)) {
        setValue(data)
        setWidth(width)
        setMarginLeft(pageX)
        setAlignTop(true)
        setAlignBottom(false)
        setMargin(height + pageY)
        setIsVissible(true)
        setMaxHeight(props.responsiveHeight() - height - pageY)
      }
      else {
        setValue(data)
        setWidth(width)
        setMarginLeft(pageX)
        setAlignTop(false)
        setAlignBottom(true)
        setMargin(props.responsiveHeight() - pageY ? props.responsiveHeight() - pageY : 0)
        setIsVissible(true)
        setMaxHeight(props.responsiveHeight())
      }
    },

  }))

  return (
    <Modal
      transparent
      style={{ margin: 0 }}
      visible={isVisible}
      onRequestClose={() => {
        onSelectedItem()
        setIsVissible(false)
      }}  >
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, alignItems: 'center' }}
        onPress={() => {
          onSelectedItem()
          setIsVissible(false)
        }}
      >
        <TouchableOpacity onPress={() => { }}
          activeOpacity={1}
          style={
            {
              width: width,
              left: marginLeft,
              bottom: alignBottom ? margin : 'auto',
              top: alignTop ? margin : 'auto',
              position: 'absolute',
              shadowColor: '#000',
              maxHeight: 250,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 10,
              backgroundColor: 'white',
              borderRadius: 10
            }
          }>
          <ScrollView showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5
            }}>

            {data.map((item, index, key) => {
              return <TouchableOpacity key={index} onPress={async () => {
                onSelectedItem(item, index)
                setIsVissible(false)
              }}>
                <Text style={{
                  ...FoatingLabelStyles.inputCloned, padding: 5,
                  color: (initialValue == ((typeof (item) == 'object') ? item.currencyCode : item)) ?
                    ColorConstants.baseBlueColor : "black",

                }}>{typeof (item) == 'object' ? item.currencyCode : item}</Text>
              </TouchableOpacity>
            })}


          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>

  )
});
export default FloatingLabelModal;