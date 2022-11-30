import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Screen from '../../components/Screen';
import Container from '../../components/Container';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Colors from '../../styles/Colors';
import { ContactsContext } from '../../providers/ContactsProvider';

export function ScanCodeScreen({ navigation }: MainNavProps<'ScanCode'>) {
	const { contacts } = useContext(ContactsContext);
	const [hasPermission, setHasPermission] = useState(false);

	var barCodeScannedTs = 0;

	const screenWidth = Dimensions.get('screen').width;
	const cameraPreviewSize = screenWidth * 0.8;

	useEffect(() => {
		navigation.setOptions({
            headerShown: contacts.length != 0,
            title: '',
        });

		const getCameraPermission = () => {
			// Get camera permission
			if (!hasPermission) {
				(async () => {
					const { status } = await BarCodeScanner.requestPermissionsAsync();
					setHasPermission(status === 'granted');
				})();
			}
		};

		navigation.addListener('transitionEnd', getCameraPermission);

		return () => {
			navigation.removeListener('transitionEnd', getCameraPermission);
		};
	}, [barCodeScannedTs, hasPermission]);

	return (
        <Screen
            action={
                <IconButton
                    onPress={() => navigation.replace('DisplayCode')}
                    iconName='qrcode'
                    text='Display your code'
                />
            }
        >
            <Container>
				<View
					style={Styles.qrContainer}
				>
                    {hasPermission && !barCodeScannedTs ? (
                        <BarCodeScanner
                            onBarCodeScanned={(params) => {
                                if (new Date().getTime() - barCodeScannedTs > 2.5 * 1000) {
                                    barCodeScannedTs = new Date().getTime();

                                    console.log('BAR CODE SCANNED ' + barCodeScannedTs);
                                    navigation.push('EstablishSecret', {
                                        clientScannedPublicKey: true,
                                        recipientPublicKey: params.data,
                                    });
                                }
                            }}
                            style={{ width: cameraPreviewSize, height: cameraPreviewSize }}
                        />
                    ) : (
                        <ActivityIndicator size='large' color={Colors.blue} />
                    )}
                </View>
                <View style={Styles.defaultVerticalPadding}>
                    <Text style={Styles.title}>Instructions</Text>
                    <Text style={Styles.text}>
                        Tell your contact to display their code by pressing the '+' in the
                        overview. Point your camera and scan their code.
                    </Text>
                </View>
            </Container>
        </Screen>
	);
}
