import React from 'react';
import { ClientKeyProvider } from './ClientKeyProvider';
import { ContactsProvider } from './ContactsProvider';
import { MessagesProvider } from './MessagesProvider';
import { Routes } from './Routes';
import { SocketProvider } from './SocketProvider';
import { UserDataContext, UserDataProvider } from './UserDataProvider';

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
	return (
		<ClientKeyProvider>
			<UserDataProvider>
				<SocketProvider>
					<ContactsProvider>
						<MessagesProvider>
							<Routes />
						</MessagesProvider>
					</ContactsProvider>
				</SocketProvider>
			</UserDataProvider>
		</ClientKeyProvider>
	);
};
