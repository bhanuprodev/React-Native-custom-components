import React, { useReducer, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Animated,
} from "react-native";
import ColorConstants from "../constants/ColorConstants";
import Fonts from "../constants/Fonts";
import ValueConstants from "../constants/ValueConstants";
import { getFont } from "../utils/Utils";
import Feather from 'react-native-vector-icons/Feather';
import FloatingLabelModal from "./FloatingLabelModal";



export default FloatLabelDropDown = forwardRef(({
    formStyle = {},
    baseStyle = {},
    initialValue, onInputChange,
    borderColor = ColorConstants.light_grey, ...props }, ref) => {
    const containerRef = React.useRef(null);
    const modalRef = useRef(null)
    const state = useRef(0)
    const [value, setValue] = useState(initialValue)

    useImperativeHandle(ref, () => ({

        setText(text) {
            setValue(text)
            handleAnimation();
        }

    }))
    useEffect(() => {
        if (initialValue) handleAnimation(1)
        if (initialValue != value) {
            setValue(initialValue)
        }
    }, [initialValue])
    const textAnim = useRef(new Animated.Value(0)).current;

    const handleAnimation = (value = 1, showModal) => {
        state.current = value
        if (value && showModal)
            containerRef.current.measure((x, y, width, height, pageX, pageY) => {

                if (modalRef.current) {
                    modalRef.current.refresh(width, height, pageX, pageY, value)
                }
            })
        Animated.timing(textAnim, {
            toValue: value,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };


    const fontSize = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [getFont(ValueConstants.font_medium), getFont(ValueConstants.font_small)],
    });

    const marginTop = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [10, -10],
    });

    const color = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(60,60,70)", borderColor || "rgb(70,70,90)"],
    });

    const animatedStyle = {
        fontSize,
        marginTop,
        color: borderColor && color,
    };


    return (
        <Animated.View ref={(ref) => {
            containerRef.current = ref
        }} style={[styles.formControl, props.formControlStyle, baseStyle,]}>
            <Animated.Text onPress={() => {
                handleAnimation(1, true);
            }}
                style={[
                    styles.label,
                    styles.endLabel,
                    props.initialValue ? styles.basic : animatedStyle,
                    props.right && styles.labelRight,
                    props.labelStyle, {
                        color: "black",
                        fontFamily: Fonts.Mukta_Regular,
                        fontSize: getFont(ValueConstants.font_large), marginBottom: 3
                    },
                    formStyle
                ]}
            >
                {props.label}
            </Animated.Text>
            <Text onPress={() => {
                handleAnimation(1, true);
            }}
                style={{ ...styles.input, flex: 1 }}
            >{value}</Text>
            <Feather onPress={() => {
                handleAnimation(1, true);
            }}
                name="chevron-down"
                size={25}
                color={'#49658c'}
                style={{ marginTop: 10, marginRight: 5 }}
            />
            <FloatingLabelModal ref={modalRef} {...props}

                onSelectedItem={async (item, index) => {

                    if (item) {
                        typeof (item) == 'object' ? setValue(item.currencyCode) : setValue(item)
                        onInputChange(item)
                    }
                    else if (!value) {
                        handleAnimation(0)
                    }
                }} initialValue={value} >
            </FloatingLabelModal>
        </Animated.View>
    );


});

const styles = StyleSheet.create({
    formControl: {
        borderColor: "#ccc",
        borderWidth: 1.5,
        borderRadius: 5,
        marginVertical: 10,
        flex: 1,
        minHeight: 50,
        flexDirection: 'row',
    },
    basic: {
        fontSize: 13,
        marginTop: -7,
        zIndex: 10,
    },
    label: {
        marginVertical: 8,
        position: "absolute",
        marginTop: 13,
        left: 10,
        color: "#4D4D4D",
        backgroundColor: "white",
        paddingHorizontal: 5,
        fontSize: getFont(ValueConstants.font_small),
        color: ColorConstants.operator_grey,
        fontFamily: Fonts.Poppins_SemiBold,
        flex: 1
    },
    lineLabel: {
        marginVertical: 8,
        fontSize: 15,

        fontFamily: Fonts.Poppins_Regular,
    },
    endLabel: {
        zIndex: 10,
    },
    redColor: {
        color: "black",
    },


    input: {
        paddingHorizontal: 10,
        paddingTop: 8,
        fontFamily: Fonts.Mukta_Regular,
        fontSize: getFont(ValueConstants.font_extra_large),
        color: ColorConstants.black,
    },
    inputLine: {
        fontSize: 22,
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomWidth: 1,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        paddingHorizontal: 15,
        fontSize: 13,
        fontFamily: Fonts.Mukta_Regular,
    },
    errorTxtRight: { textAlign: "right" },
    labelRight: { right: 20, left: null },
    lineLabelRight: { textAlign: "right", color: "#4D4D4D" },
});


