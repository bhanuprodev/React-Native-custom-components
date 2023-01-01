import React, { useReducer, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Animated,
    TouchableOpacity,
} from "react-native";
import ColorConstants from "../constants/ColorConstants";
import { CSSStyles } from "../constants/CSSStyles";
import Fonts from "../constants/Fonts";
import ValueConstants from "../constants/ValueConstants";
import CalendarDateTimePicker from "../screens/fragments/searchaircraft/CalendarDateTimePicker";
import { getFont } from "../utils/Utils";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MlkitOcr from 'react-native-mlkit-ocr';
import { captureImage, nameOfMonths, validateEmail, validateGSTIN } from "./Exports";
export default FloatLabelInput = forwardRef(({ scan = false, placeHolder = "", regx = "",
    errorText = "Invalid format", editable = true,
    formStyle = {}, isItTimePicker = false, initialValue = "", borderColor = ColorConstants.light_grey, ...props }, ref) => {
    const [showCalenderPicker, setshowCalenderPicker] = useState(false)
    const [value, setValue] = useState(initialValue ? initialValue : "")
    const [error, setError] = useState("")
    const inputRef = useRef(null)
    const actived = useRef(false)

    useImperativeHandle(ref, () => ({
        setText(text) {
            console.log(text, ":::::::::", props.maxLength)
            if (props.maxLength) text = text.substring(0, props.maxLength)
            handleOnChangeText(text)
            setError(regx && !regx.test(text) ? errorText : "")

        },
        setError(text) {
            setError(text)
        }
    }))
    useEffect(() => {
        if (initialValue) handleAnimation(1)
        if (initialValue != value) {
            setValue(initialValue)

        }
    }, [initialValue])
    const textAnim = useRef(new Animated.Value(0)).current;

    const checkIsValid = (text) => {
        if (regx && props.maxLength && text.length == props.maxLength)
            setError(regx.test(text) ? "" : errorText)
        else if (props.minLength && text.length < props.minLength)
            setError(errorText)
        else setError("")
    }

    const handleOnChangeText = (value) => {
        console.log('handle', value)
        setValue(value)
        handleAnimation(1)
        props.onInputChange(value);
        checkIsValid(value)
    };
    const handleAnimation = (value = 1) => {

        Animated.timing(textAnim, {
            toValue: value,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };


    const fontSize = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [getFont(ValueConstants.font_large), getFont(ValueConstants.font_medium)],
    });

    const marginTop = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Platform.OS == 'ios' ? 10 : 13, -10],
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
        <TouchableOpacity activeOpacity={0.9}
            onPress={() => {
                if (isItTimePicker)
                    setshowCalenderPicker(isItTimePicker)
            }}
            style={[FoatingLabelStyles.formControl, props.formControlStyle]}>
            <Animated.Text onPress={() => {
                if (!actived.current && !isItTimePicker) {
                    handleAnimation();
                    inputRef.current.focus()
                }
                else if (isItTimePicker)
                    setshowCalenderPicker(isItTimePicker)

            }}
                style={[
                    FoatingLabelStyles.label,
                    FoatingLabelStyles.endLabel,
                    props.initialValue ? FoatingLabelStyles.basic : animatedStyle,
                    props.right && FoatingLabelStyles.labelRight,
                    props.labelStyle,
                    { color: "#4D4D4D", fontFamily: Fonts.Mukta_Medium },
                    formStyle
                ]}
            >
                {props.label}
            </Animated.Text>
            {showCalenderPicker
                ? <CalendarDateTimePicker
                    textStyle={{
                        ...CSSStyles.textWithFmffPM,
                        color: 'black',
                        textAlign: 'center',
                        textAlignVertical: 'center'
                    }}
                    typeOfSelection={1}
                    preSelectedDate={""}
                    onClosed={(data) => {
                        setshowCalenderPicker(false)
                        if (data) {
                            Animated.timing(textAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: false,
                            }).start();
                            let date = new Date(data)
                            props.onInputChange(date.getDate() + " " + nameOfMonths(date.getMonth()) + " " + date.getFullYear());
                            setValue(date.getDate() + " " + nameOfMonths(date.getMonth()) + " " + date.getFullYear())
                        }
                    }} >

                </CalendarDateTimePicker> : null}
            {!isItTimePicker ?
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: "#ccc",
                    borderWidth: 1.5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                }}>
                    <TextInput ref={(ref) => {
                        if (ref) inputRef.current = ref
                    }}
                        onSubmitEditing={(text) => (props.submit ? props.submit(text) : null)}
                        onFocus={() => {
                            actived.current = true
                            handleAnimation();
                        }}

                        maxLength={props.maxLength ? props.maxLength : 200}
                        placeholder={placeHolder}
                        onBlur={() => {
                            actived.current = false
                            checkIsValid(value)
                            if (!value) handleAnimation(0)
                        }}
                        {...props}
                        style={FoatingLabelStyles.input}
                        value={value}
                        onChangeText={(value) => {
                            if (props.maxLength && value.length > props.maxLength)
                                return
                            let text = props.multiline ? value : value.trim()
                            setValue(text)
                            checkIsValid(text)
                            props.onInputChange(text);

                        }}
                        editable={editable}
                    />
                    {scan ? <Ionicons onPress={async () => {
                        let image = await captureImage()
                        if (image) {
                            try {
                                MlkitOcr.detectFromFile(image.path).then((resultFromFile) => {
                                    try {
                                        if (Array.isArray(resultFromFile)) {
                                            resultFromFile.map((item, index, key) => {
                                                try {
                                                    item = item.text
                                                    if (props.maxLength && item.length <= props.maxLength) {
                                                        if (item.length >= 10) {
                                                            console.warn(item, index)
                                                            handleOnChangeText(item.trim())
                                                        }
                                                    }
                                                    console.log(item, index, props.maxLength)
                                                }
                                                catch (e) {
                                                    console.error("error", e, index)
                                                }


                                            });
                                        }
                                    }
                                    catch (e) {
                                        console.error("error", e)
                                    }
                                })
                            }
                            catch (e) {

                            }
                        }
                    }}
                        name="scan"
                        size={25}
                        color={'#49658c'}
                        style={{ marginHorizontal: 5 }}
                    /> : null}
                    {props.maxLength && value && props.maxLength != value.length ? <Text
                        style={{
                            ...CSSStyles.errortext,
                            paddingHorizontal: 2,
                            flexShrink: 1, color: ColorConstants.operator_light_grey
                        }}>{value.length + "/" + props.maxLength}</Text> : null}

                </View> :
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: "#ccc",
                    borderWidth: 1.5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                }}>
                    <Text style={{
                        ...FoatingLabelStyles.input,
                        textAlignVertical: 'center'
                    }}>{value}</Text>
                </View>
            }
            {error ? <Text
                style={{
                    ...CSSStyles.errortext,
                    paddingHorizontal: 2,
                    flexShrink: 1
                }}>{error}</Text> : null}


        </TouchableOpacity>
    );


});

export const FoatingLabelStyles = StyleSheet.create({
    formControl: {
        marginVertical: 10,
        minWidth: '100%'
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
        fontFamily: Fonts.Poppins_SemiBold
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
        flex: 1,
        flexShrink: 1,
        fontFamily: Fonts.Mukta_Regular,
        fontSize: getFont(ValueConstants.font_extra_large),
        color: ColorConstants.black,
        minHeight: 50
    },
    inputCloned: {
        flex: 1,
        flexShrink: 1,
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
