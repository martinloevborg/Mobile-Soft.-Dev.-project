import { StackNavigationProp } from '@react-navigation/stack';
import { useRef } from 'react';
import { Animated } from 'react-native';
import { MainParamList } from '../nav/MainParamList';
import { transitionDuration } from '../styles/Styles';

export interface TransitionEvents {
	blurEvent: () => void;
	focusEvent: () => void;
	progress: Animated.Value;
	navigation: StackNavigationProp<MainParamList>;
}

export function hookTransitionEvents(
	navigation: StackNavigationProp<MainParamList>
): TransitionEvents {
	// Check if current screen is top of navigation stack
	const progressStartValue = navigation.getState().index == 0 ? 1 : 0;
	const progress = useRef(new Animated.Value(progressStartValue)).current;

	const blurEvent = () => {
		Animated.timing(progress, {
			toValue: 0,
			duration: transitionDuration / 2,
			useNativeDriver: true,
		}).start();
	};

	const focusEvent = () => {
		Animated.timing(progress, {
			toValue: 1,
			duration: transitionDuration / 2,
			delay: transitionDuration / 2,
			useNativeDriver: true,
		}).start();
	};

	navigation.addListener('blur', blurEvent);
	navigation.addListener('focus', focusEvent);

	return { blurEvent, focusEvent, progress, navigation };
}

export function unHookTransitionEvents(
	navigation: StackNavigationProp<MainParamList>,
	events: TransitionEvents
) {
	navigation.removeListener('blur', events.blurEvent);
	navigation.removeListener('focus', events.focusEvent);
}
