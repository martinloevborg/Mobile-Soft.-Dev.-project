import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact } from '../providers/ContactsProvider';

export type MainParamList = {
	ContactsOverview: undefined;
	Chat: { contact: Contact };
	DisplayCode: undefined;
	ScanCode: undefined;
	Intro: undefined;
	EstablishSecret: {
		recipientPublicKey: string;
		clientScannedPublicKey: boolean;
	};
};

export type MainNavProps<T extends keyof MainParamList> = {
	navigation: StackNavigationProp<MainParamList, T>;
	route: RouteProp<MainParamList, T>;
};
