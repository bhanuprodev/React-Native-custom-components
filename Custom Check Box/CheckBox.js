import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorConstants from "../constants/ColorConstants";
import { getFont } from '../utils/Utils';
import ValueConstants from "../constants/ValueConstants";
import Fonts from "../constants/Fonts";

const CheckBox = (props) => {

	return (
		<View style={styles.container}>
			<Pressable onPress={props.onPress}>
				<MaterialCommunityIcons
					name={props.isChecked ?
						"checkbox-marked" : "checkbox-blank-outline"}
					size={18} color={ColorConstants.baseBlueColor} />
			</Pressable>
			<Text style={styles.title}>{props.title}</Text>
		</View>
	);
};

export default CheckBox;

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",

		marginTop: 5,
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
