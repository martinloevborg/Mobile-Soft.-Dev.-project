import AntDesign from '@expo/vector-icons/build/AntDesign';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  View,
} from 'react-native';
import Screen from '../../components/Screen';
import Container from '../../components/Container';
import { ClientKeyContext } from '../../providers/ClientKeyProvider';
import { ContactsContext } from '../../providers/ContactsProvider';
import { SocketContext } from '../../providers/SocketProvider';
import Colors from '../../styles/Colors';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';

interface Event {
  text: string;
  pending?: boolean;
  error?: boolean;
}

export function EstablishSecretModal({
  navigation,
  route,
}: MainNavProps<'EstablishSecret'>) {
  const { socket } = useContext(SocketContext);
  const { client, calculateSharedSecret } = useContext(ClientKeyContext);
  const { createContact, getContact } = useContext(ContactsContext);

  const [eventCount, setEventCount] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);

  const [publicKeyConfirmed, setPublicKeyConfirmed] = useState<
    undefined | boolean
  >(undefined);

  const addEvent = (e: Event) => {
    if (events.length > 0) {
      events[events.length - 1].pending = false;
    }

    events.push(e);
    setEvents(events);
    setEventCount(eventCount + 1);
  };

  useEffect(() => {
    if (publicKeyConfirmed === false) {
      socket?.off('public_key_scan_confirmed');

      //addEvent({ text: 'No answer from client', error: true });

      setTimeout(() => {
        navigation.goBack();
      }, 3 * 1000);
    }
  }, [publicKeyConfirmed]);

  useEffect(() => {
    const sharedSecretCalculation = () => {
      addEvent({ text: 'Calculating shared secret', pending: true });

      setTimeout(async () => {
        const sharedSecret = await calculateSharedSecret(
          route.params.recipientPublicKey
        );

        addEvent({ text: 'Creating contact', pending: true });
        const contact = await createContact(
          route.params.recipientPublicKey,
          sharedSecret
        );

        addEvent({ text: 'Navigating to conversation', pending: true });

        // Remove socket hook
        socket?.off('public_key_scan_confirmed');

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'ContactsOverview',
                params: {},
              },
              {
                name: 'Chat',
                params: { contact },
              },
            ],
          });
        }, 3000);
      }, 0);
    };

    if (route.params.clientScannedPublicKey) {
      addEvent({ text: 'Scanned key' });

      // Emit event to scanner
      addEvent({ text: 'Waiting for confirmation', pending: true });

      socket?.on('public_key_scan_confirmed', () => {
        setPublicKeyConfirmed(true);
        console.log('Public key scan confirmed');
        sharedSecretCalculation();
      });

      socket?.emit(
        'scanned_public_key',
        route.params.recipientPublicKey,
        client.publicKey
      );

      setTimeout(() => {
        if (publicKeyConfirmed === undefined) {
          setPublicKeyConfirmed(false);
        }
      }, 3 * 1000);
    } else {
      // Client was scanned
      addEvent({ text: 'Public key scanned' });

      // Emit event to scanner
      addEvent({ text: 'Emitting confirmation' });
      socket?.emit(
        'confirm_public_key_scan',
        route.params.recipientPublicKey,
        client.publicKey
      );

      sharedSecretCalculation();
    }
  }, []);

  useEffect(() => {}, [eventCount]);

  return (
    <Screen
      scrollable={false}
      style={{ justifyContent: 'flex-start', paddingTop: 60 }}
    >
      <Container>
        <Text style={Styles.title}>Key exchange</Text>
        <FlatList
          renderItem={({ item }) => {
            return (
              <View
                style={[
                  Styles.view,
                  { justifyContent: 'space-between', flexDirection: 'row' },
                ]}
              >
                <Text style={[Styles.text, { flex: 1 }]}>{item.text}</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: Styles.title.fontSize,
                  }}
                >
                  {item.pending ? (
                    <ActivityIndicator
                      color={Styles.title.color}
                      style={{
                        height: Styles.text.fontSize,
                      }}
                    />
                  ) : (
                    <AntDesign
                      name={item.error ? 'close' : 'check'}
                      size={Styles.title.fontSize}
                      style={{
                        color: item.error ? Colors.red : Styles.title.color,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}
                    />
                  )}
                </View>
              </View>
            );
          }}
          data={events}
          keyExtractor={(item, index) => index.toString()}
        ></FlatList>
      </Container>
    </Screen>
  );
}
