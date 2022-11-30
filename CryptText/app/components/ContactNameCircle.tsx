import React, { useContext, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { Contact, ContactsContext } from '../providers/ContactsProvider';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';

export function ContactNameCircleComponent({ contact }: { contact: Contact }) {
	return (
		<View
			style={{
				backgroundColor: Colors.lightGray,
				aspectRatio: 1,
				width: 50,
				alignSelf: 'center',
				justifyContent: 'center',
				borderRadius: 90,
			}}
		>
			<Text
				style={[
					Styles.title,
					{
						marginBottom: 0,
						textAlign: 'center',
						justifyContent: 'center',
						textAlignVertical: 'center',
						color: Colors.darkerGray,
					},
				]}
			>
				{contact.name.toUpperCase().slice(0, 2)}
			</Text>
		</View>
	);
}
