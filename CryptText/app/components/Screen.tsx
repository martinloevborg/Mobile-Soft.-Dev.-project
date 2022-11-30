import React from 'react';
import { View, ScrollView } from 'react-native';
import Styles from '../styles/Styles';
import Container from './Container';

interface Props {
	children: React.ReactNode;
	action?: React.ReactNode;
    scrollable?: boolean;
    style?: object;
    scrollStyle?: object;
}

export default (props: Props) => {
	return (
		<View
			style={[
                props.style,
                {
                    flex: 1,
                }
            ]}
		>
            {props.scrollable !== false ?
                <ScrollView
                    contentContainerStyle={[{
                        flexGrow: 1,
                        justifyContent: 'space-around',
                    }, props.scrollStyle]}
                >
                    {props.children}
                </ScrollView>
            : props.children}

            {props.action ? (
                <View
                    style={Styles.defaultVerticalPadding}
                >
                    <Container>
                        {props.action}
                    </Container>
                </View>
            ) : null}
        </View>
	);
};
