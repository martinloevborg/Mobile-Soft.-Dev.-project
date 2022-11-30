import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';

interface Props {
	onPress: () => void;
	iconName: string;
	text: string;
	height?: number;
	width?: number;
}

const borderRadius = 25;

export default (props: Props) => {
	const height = props.height ?? 55;

	return (
		<TouchableOpacity
			style={{
				height: height,
				flexDirection: 'row',
			}}
			onPress={props.onPress}
		>
			<View
				style={{
                    paddingLeft: 26,
                    paddingRight: 18,
					backgroundColor: Colors.lighterDarkBlue,
					borderTopLeftRadius: borderRadius,
					borderBottomLeftRadius: borderRadius,
					justifyContent: 'center',
				}}
			>
				<AntDesign
					// @ts-ignore
					name={props.iconName}
					size={height * 0.5}
					style={{
						color: Styles.buttonText.color,
						alignSelf: 'center',
						textAlignVertical: 'center',
					}}
				/>
			</View>
			<View
				style={{
                    flex: 1,
					backgroundColor: Colors.blue,
					borderTopRightRadius: borderRadius,
					borderBottomRightRadius: borderRadius,
				}}
			>
				<Text
					style={[Styles.buttonText, { lineHeight: height - 2 }]}
				>
					{props.text}
				</Text>
			</View>
		</TouchableOpacity>
	);
};
