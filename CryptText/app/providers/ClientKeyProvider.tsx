import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client as DH_Client } from 'diffie-hellman-ts';
import { sha256 } from '../cryptography/hash';
import { useFirstRender } from '../components/useFirstRender';

export declare class DhClientKeys {
	public secret: string;
	public prime: string;
	public public_number: string;
	private generatorNumber;
	constructor(id?: number);
	generatePublicNumber(): string;
	generateSharedSecret(publicSecret: string): string;
}

export interface Client {
	name: string;
	publicKey: string;
	privateKey: string;
	prime: string;
	dhClientKeys: DhClientKeys;
}

type ClientKeyContextType = {
	getClient(): Promise<void>;
	loadingComplete: boolean;

	client: Client;
	calculateSharedSecret(sharedPublicKey: string): Promise<string>;
};

export const ClientKeyContext = React.createContext({} as ClientKeyContextType);

interface ClientKeyProviderProps {}

export const ClientKeyProvider: React.FC<ClientKeyProviderProps> = ({
	children,
}) => {
	const [client, setClientState] = useState<Client>({} as Client);
	const [loadingComplete, setLoadingComplete] = useState(false);

	const firstRender = useFirstRender();

	useEffect(() => {
		if (!firstRender) {
			setLoadingComplete(true);
		}
	}, [client]);

	const getClient = async () => {
		// Check if client is already stored in localstorage
		var storedClientKeys = await AsyncStorage.getItem('client');

		const dhClientKeys = new DH_Client() as unknown as DhClientKeys;

		if (storedClientKeys) {
			// Parse class object
			const parsedClient = JSON.parse(storedClientKeys) as Client;

			// Set prime numbers on new dh_client_keys instance
			dhClientKeys.prime = parsedClient.prime;
			dhClientKeys.public_number = parsedClient.publicKey;
			dhClientKeys.secret = parsedClient.privateKey;

			// Save on client object
			parsedClient.dhClientKeys = dhClientKeys;

			setClientState(parsedClient);

			return;
		}

		// If not stored generate client keys
		dhClientKeys.public_number = dhClientKeys.generatePublicNumber();

		const client_to_store: Client = {
			name: await sha256(dhClientKeys.public_number),
			prime: dhClientKeys.prime,
			publicKey: dhClientKeys.public_number,
			privateKey: dhClientKeys.secret,
			dhClientKeys: dhClientKeys,
		};

		// Save client
		await AsyncStorage.setItem('client', JSON.stringify(client_to_store));

		setClientState(client_to_store);
	};

	const calculateSharedSecret = async (sharedPublicKey: string) => {
		return client.dhClientKeys.generateSharedSecret(sharedPublicKey);
	};

	return (
		<ClientKeyContext.Provider
			value={{
				getClient,
				loadingComplete,

				client,
				calculateSharedSecret,
			}}
		>
			{children}
		</ClientKeyContext.Provider>
	);
};
