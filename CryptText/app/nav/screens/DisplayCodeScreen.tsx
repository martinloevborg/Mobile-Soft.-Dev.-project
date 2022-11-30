import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import IconButton from "../../components/IconButton";
import Styles from "../../styles/Styles";
import Screen from "../../components/Screen";
import Container from "../../components/Container";
import { MainNavProps } from "../MainParamList";
import QRCode from "react-native-qrcode-svg";
import { ClientKeyContext } from "../../providers/ClientKeyProvider";
import Colors from "../../styles/Colors";
import { SocketContext } from "../../providers/SocketProvider";
import { ContactsContext } from "../../providers/ContactsProvider";

export function DisplayCodeScreen({ navigation }: MainNavProps<"DisplayCode">) {
  const { contacts } = useContext(ContactsContext);
  const { socket } = useContext(SocketContext);
  const { client } = useContext(ClientKeyContext);

  useEffect(() => {
    navigation.setOptions({
        headerShown: contacts.length != 0,
        title: '',
    });

    // Add socket listener
    socket?.on("public_key_scanned", (scanned_by_public_key: string) => {
      console.log("Public key scanned!");
      navigation.push("EstablishSecret", {
        recipientPublicKey: scanned_by_public_key,
        clientScannedPublicKey: false,
      });
    });

    return () => {
      console.log("Removed socket on scan hook.");
      socket?.off("public_key_scanned");
    };
  }, []);

	return (
        <Screen
            action={
                <IconButton
                    onPress={() => navigation.replace('ScanCode')}
                    iconName='camera'
                    text='Scan a code'
                />
            }
        >
            <Container>
				<View
					style={Styles.qrContainer}
				>
					<QRCode
						value={client.publicKey}
						size={Styles.qrContainer.width}
						color={Colors.lightGray}
						backgroundColor={Colors.darkBlue}
					/>
				</View>
				<View style={Styles.defaultVerticalPadding}>
					<Text style={Styles.title}>Instructions</Text>
					<Text style={Styles.text}>
						Tell your contact to open the scanner by pressing '+' in the
						overview. Point their camera and scan the code.
					</Text>
				</View>
            </Container>
        </Screen>
	);
}
