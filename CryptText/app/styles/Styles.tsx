import { Dimensions, StyleSheet } from 'react-native';
import Colors from './Colors';

const screenWidth = Dimensions.get('screen').width;

export default StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: Colors.darkBlue,
		alignItems: 'center',
	},
    defaultVerticalPadding: {
        paddingVertical: 42,
    },
    defaultHorizontalPadding: {
        paddingHorizontal: 42,
    },
	roundCardView: {
		flex: 1,
		backgroundColor: Colors.white,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignSelf: 'center',
	},
	title: {
		color: Colors.lightGray,
		fontSize: 21,
		marginBottom: 25,
		fontFamily: 'Poppins_400Regular',
	},
	text: {
		color: Colors.gray,
		fontSize: 16,
		fontFamily: 'Poppins_300Light',  
	},
    alignCenter: {
        alignItems: 'center',
    },
    qrContainer: {
        width: screenWidth * 0.8,
        height: screenWidth * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
	centeredText: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	chatText: {
		fontFamily: 'Poppins_400Regular',
		fontSize: 13,
	},
    buttonText: {
		fontFamily: 'Poppins_400Regular',
		fontSize: 18,
		color: Colors.white,
        flex: 1,
        textAlign: 'center',
    },
});

export const transitionDuration = 250;
