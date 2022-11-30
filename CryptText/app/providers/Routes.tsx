import React, { useState, useEffect, useContext } from 'react';
import {
	DefaultTheme,
	NavigationContainer,
	RouteProp,
} from '@react-navigation/native';
import { ActivityIndicator, Button, Text, View } from 'react-native';

import { UserDataContext } from './UserDataProvider';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import {
	useFonts,
	Poppins_400Regular,
	Poppins_300Light,
} from '@expo-google-fonts/poppins';
import { ContactsContext } from './ContactsProvider';
import { ClientKeyContext } from './ClientKeyProvider';
import { MainStack } from '../nav/MainStack';
import { MessagesContext } from './MessagesProvider';
import { useFirstRender } from '../components/useFirstRender';
import { SocketContext } from './SocketProvider';

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
	const { getUserData } = useContext(UserDataContext);
	const { getContacts, loadingComplete: contactsLoadingComplete } =
		useContext(ContactsContext);
	const { getClient, loadingComplete: clientLoadingComplete } =
		useContext(ClientKeyContext);
	const { getMessages } = useContext(MessagesContext);
	const { connectSocket, loadingComplete: socketLoadingComplete } =
		useContext(SocketContext);
	const [loading, setLoading] = useState(true);

	let [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_300Light,
	});

	const firstRender = useFirstRender();

	useEffect(() => {
		if (firstRender) {
			const getData = async () => {
				await getUserData();
				await getClient();
				await getContacts();
				return;
			};
			getData();
		}

		if (
			contactsLoadingComplete &&
			clientLoadingComplete &&
			!socketLoadingComplete
		) {
			connectSocket();
		}

		if (socketLoadingComplete) {
			getMessages().then(() => {
				setLoading(false);
			});
		}
	}, [contactsLoadingComplete, clientLoadingComplete, socketLoadingComplete]);

	if (loading || !fontsLoaded) {
		return (
			<View style={[Styles.view, Styles.centeredView]}>
				<ActivityIndicator size='large' color={Colors.blue} />
			</View>
		);
	}

	const navTheme = DefaultTheme;
	navTheme.colors.background = Colors.darkBlue;

	return (
		<NavigationContainer theme={navTheme}>
			<MainStack />
		</NavigationContainer>
	);
};
