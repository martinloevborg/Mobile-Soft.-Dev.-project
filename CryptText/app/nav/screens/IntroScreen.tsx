import React, { useContext, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Container from '../../components/Container';
import Screen from '../../components/Screen';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import IconSvg from '../../components/IconSvg';

export function IntroScreen({ navigation }: MainNavProps<'Intro'>) {
	const screenWidth = Dimensions.get('screen').width;
	const logoSize = screenWidth * 0.6;

	return (
        <Screen
            action={
                <IconButton
                    onPress={() => navigation.push('DisplayCode')}
                    iconName='contacts'
                    text='Add first contact'
                />
            }
        >
            <Container>
                <View style={[Styles.alignCenter, Styles.defaultVerticalPadding]}>
				    <IconSvg style={{ width: logoSize, height: logoSize }} />
                </View>
				<View style={Styles.defaultVerticalPadding}>
					<Text style={Styles.title}>Get started using CryptText</Text>
					<Text style={Styles.text}>
						CryptText uses a unique generated key-pair to encrypt communication
						between you and your contacts.{"\n\n"}
						To get started, scan the code shown on your contacts phone, or have
						them scan your code.
					</Text>
				</View>
			</Container>
        </Screen>
	);
}
