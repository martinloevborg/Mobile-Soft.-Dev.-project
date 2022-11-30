import React, { useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { useFirstRender } from '../components/useFirstRender';
import constants from '../utility/constants';
import { ClientKeyContext } from './ClientKeyProvider';

type SocketContextType = {
	connectSocket: () => void;
	loadingComplete: boolean;

	socket: Socket | undefined;
};

export const SocketContext = React.createContext({} as SocketContextType);

interface SocketProviderProps {}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const { client } = useContext(ClientKeyContext);
	const [socket, setSocket] =
		useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

	const [loadingComplete, setLoadingComplete] = useState(false);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		if (!loadingComplete && connected && !loadingComplete) {
			setLoadingComplete(true);
		}
	}, [socket, connected]);

	const connectSocket = () => {
		const s = io(`${constants.socketUrl}`, {
			auth: {
				public_key: client.publicKey,
			},
			path: `${constants.socketPath}`,
			secure: true,
			rejectUnauthorized: false,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		s.on('connect', () => {
			setConnected(true);
		});

		setSocket(s);
	};

	return (
		<SocketContext.Provider
			value={{ connectSocket, loadingComplete, socket: socket }}
		>
			{children}
		</SocketContext.Provider>
	);
};
