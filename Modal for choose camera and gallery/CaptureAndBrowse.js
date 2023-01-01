import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import ColorConstants from "../constants/ColorConstants";
import { getFont } from '../utils/Utils';
import ValueConstants from "../constants/ValueConstants";
import Fonts from "../constants/Fonts";
import ReactNativeModal from "react-native-modal";
import { types } from "react-native-document-picker";
import { captureImage, generateString, getPermissions, pickFile } from "./Exports";
import ImagePicker from 'react-native-image-crop-picker';
import SimpleToast from "react-native-simple-toast";
import { CSSStyles } from "../constants/CSSStyles";

export function CaptureAndBrowse({ arrayOfValues = ["Camera", "Gallery", "PDF"], typeOfFile = [types.allFiles], onClosed, returnStatusCode = "null" }) {

    const grabFile = async (typeOfFile) => {
        let res = await pickFile(typeOfFile)
        if (res) {
            if (res.path) res.uri = res.path
            if (!res.name) {
                let a = res.uri.split("/")
                res.name = a[a.length - 1]
            }
            if (res.mime) res.type = res.mime
            onClosed(res, returnStatusCode)
        }
        else {
            onClosed()
        }

    }
    return (
        <ReactNativeModal isVisible={true} onDismiss={() => {
        }}
            transparent
            style={{ margin: 0, flex: 1, justifyContent: 'flex-end', }}
            onBackButtonPress={() => {
                onClosed()
            }}
            onBackdropPress={() => {
                onClosed()
            }}
            onRequestClose={() => {
                onClosed()
            }}  >
            <View style={{
                backgroundColor: 'white',
                padding: 20,
                flexDirection: 'row',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}>
                <TouchableOpacity onPress={async () => {
                    let image = await captureImage()
                    setTimeout(() => {
                        if (image) {
                            onClosed({
                                name: generateString(10),
                                uri: image.path,
                                type: image.mime
                            })
                        }
                        else onClosed()
                    }, 200)

                }} style={{ alignItems: 'center' }}>
                    <Entypo
                        name={"camera"}
                        size={30} color={ColorConstants.baseBlueColor} />
                    <Text style={{
                        ...CSSStyles.textWithFmffPM,
                        color: 'black',
                        paddingVertical: 5
                    }}>{arrayOfValues[0]}</Text>
                </TouchableOpacity>

                {typeOfFile.includes(types.allFiles) || typeOfFile.includes(types.images)
                    ? <TouchableOpacity
                        onPress={async () => {
                            grabFile(types.images)
                        }}
                        style={{ alignItems: 'center', marginHorizontal: 20 }}>
                        <FontAwesome
                            name={"file-photo-o"}
                            size={30} color={ColorConstants.baseBlueColor} />
                        <Text style={{
                            ...CSSStyles.textWithFmffPM,
                            color: 'black',
                            paddingVertical: 5
                        }}>{arrayOfValues[1]}</Text>
                    </TouchableOpacity> : null

                }

                {typeOfFile.includes(types.allFiles) || typeOfFile.includes(types.pdf)
                    ? <TouchableOpacity onPress={() => {
                        grabFile(types.pdf)
                    }} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <FontAwesome
                            name={"file-pdf-o"}
                            size={30} color={ColorConstants.baseBlueColor} />
                        <Text style={{
                            ...CSSStyles.textWithFmffPM,
                            color: 'black',
                            paddingVertical: 5, textAlign: 'center'
                        }}>
                            {"  "}{arrayOfValues[2]} {"  "}</Text>
                    </TouchableOpacity> : null

                }





            </View>
        </ReactNativeModal >
    );
};
const styles = StyleSheet.create({
    container: {

        //marginHorizontal: 5,
    },
    title: {
        fontSize: getFont(ValueConstants.font_large_2x),
        color: ColorConstants.black,
        marginLeft: 3,
        //fontWeight: "600",
        fontFamily: Fonts.Mukta_Regular
    },
});
