import React, { useContext } from 'react';
import {
	createStackNavigator,
	HeaderStyleInterpolators,
	TransitionPreset,
	TransitionSpecs,
} from '@react-navigation/stack';
import { MainParamList } from './MainParamList';
import { ContactsOverviewScreen } from './screens/ContactsOverviewScreen';
import Colors from '../styles/Colors';
import Styles, { transitionDuration } from '../styles/Styles';
import { ContactsContext } from '../providers/ContactsProvider';
import { IntroScreen } from './screens/IntroScreen';
import { DisplayCodeScreen } from './screens/DisplayCodeScreen';
import { ScanCodeScreen } from './screens/ScanCodeScreen';
import { EstablishSecretModal } from './modals/EstablishSecretModal';
import { ChatScreen } from './screens/ChatScreen';
import { StatusBar } from 'react-native';

interface ContactsStackProps {}

const Stack = createStackNavigator<MainParamList>();

const customTransition: TransitionPreset = {
	gestureDirection: 'horizontal',
	transitionSpec: {
		open: {
			animation: 'timing',
			config: { duration: transitionDuration },
		},
		close: {
			animation: 'timing',
			config: { duration: transitionDuration },
		},
	},
	headerStyleInterpolator: HeaderStyleInterpolators.forFade,
	cardStyleInterpolator: ({ current, next, layouts }) => {
		return {
			cardStyle: {
				opacity: next
					? next.progress.interpolate({
							inputRange: [0, 1 / 3, (1 / 3) * 2, 1],
							outputRange: [1, 0.5, 0, 0],
					  })
					: current.progress.interpolate({
							inputRange: [0, 1 / 3, (1 / 3) * 2, 1],
							outputRange: [0, 0, 0.5, 1],
					  }),
			},
		};
	},
};

export const MainStack: React.FC<ContactsStackProps> = ({}) => {
	const { contacts } = useContext(ContactsContext);

    StatusBar.setBarStyle('light-content');

	return (
		<Stack.Navigator
			initialRouteName={contacts.length == 0 ? 'Intro' : 'ContactsOverview'}
			screenOptions={{
				cardStyle: {
                    backgroundColor: Colors.darkBlue
                },
				headerStyle: {
					backgroundColor: Colors.darkBlue,
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
				},
				headerTitleStyle: {
                    color: Colors.lightGray,
                    fontSize: 19,
                    marginBottom: 2,
                    fontFamily: 'Poppins_400Regular',
				},
				headerTitleAlign: 'center',
				headerTintColor: Styles.title.color,
			}}
		>
			<Stack.Group
				screenOptions={{
					...customTransition,
					gestureDirection: 'horizontal',
					gestureEnabled: false,
				}}
			>
				<Stack.Screen
					name='ContactsOverview'
					component={ContactsOverviewScreen}
					options={{ headerTitle: 'Contacts' }}
				/>
				<Stack.Screen
					name='Chat'
					component={ChatScreen}
					options={{ headerTitle: 'Chat' }}
				/>

				<Stack.Group screenOptions={{
                    headerShown: false
                }}>
					<Stack.Screen
                        name='DisplayCode'
                        component={DisplayCodeScreen}
                    />
					<Stack.Screen name='ScanCode' component={ScanCodeScreen} />
				</Stack.Group>

				<Stack.Screen
					name='Intro'
					component={IntroScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Group>

			<Stack.Screen
				name='EstablishSecret'
				component={EstablishSecretModal}
				options={{ headerShown: false, presentation: 'transparentModal' }}
			/>
		</Stack.Navigator>
	);
};
