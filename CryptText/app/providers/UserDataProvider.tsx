import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

export interface UserData {
	firstTimeSetupComplete: boolean;
}

const defaultUserData: UserData = {
	firstTimeSetupComplete: false,
};

type UserDataContextType = {
	userData: UserData;
	setUserData: (newUserData: UserData) => Promise<void>;
	getUserData: () => Promise<void>;
};

export const UserDataContext = React.createContext({} as UserDataContextType);

interface UserDataProviderProps {}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({
	children,
}) => {
	const [userData, setUserDataState] = useState<UserData>(defaultUserData);

	const setUserData = async (newUserData: UserData) => {
		const newUserDataString = JSON.stringify(newUserData);
		await AsyncStorage.setItem('userData', newUserDataString);
		setUserDataState(newUserData);
	};

	const getUserData = async () => {
		const userDataUnparsed = await AsyncStorage.getItem('userData');

		var loadedUserData = userDataUnparsed
			? (JSON.parse(userDataUnparsed) as UserData)
			: defaultUserData;

		setUserData(loadedUserData);
	};

	return (
		<UserDataContext.Provider
			value={{
				userData,
				setUserData,
				getUserData,
			}}
		>
			{children}
		</UserDataContext.Provider>
	);
};
