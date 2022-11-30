import React from 'react';
import { View } from 'react-native';
import Styles from '../styles/Styles';

interface Props {
	children: React.ReactNode;
}

export default (props: Props) => {
	return (
		<View
			style={Styles.defaultHorizontalPadding}
		>
            {props.children}
        </View>
	);
};
