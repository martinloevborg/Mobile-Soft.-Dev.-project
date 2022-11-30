import React, { useContext, useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MessageData } from "../cryptography/message";
import { Contact } from "../providers/ContactsProvider";
import { MessagesContext } from "../providers/MessagesProvider";
import Colors from "../styles/Colors";
import Styles from "../styles/Styles";
import { TransitionEvents } from "../utility/transitionEventHooks";
import { ContactNameCircleComponent } from "./ContactNameCircle";

const xOffset = 250;

export function MessageComponent({
  message,
  sentByUser,
  previousMessageSentBySameUser,
  transitionEvents,
}: {
  message: MessageData;
  sentByUser: boolean;
  previousMessageSentBySameUser: boolean;
  transitionEvents: TransitionEvents;
}) {
  return (
    <View
      style={{
        width: "100%",
        alignItems: sentByUser ? "flex-end" : "flex-start",
      }}
    >
      <Animated.View
        style={[
          {
            translateX: transitionEvents.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [sentByUser ? xOffset : -xOffset, 0],
            }),
            opacity: transitionEvents.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            borderRadius: 18,
            backgroundColor: sentByUser
              ? Colors.lighterDarkBlue
              : Colors.lightGray,
            maxWidth: "80%",

            marginTop: previousMessageSentBySameUser ? 2 : 10,
          },
        ]}
      >
        <Text
          style={[
            Styles.chatText,
            {
              color: sentByUser ? Colors.white2 : Colors.darkerGray,
              textAlign: sentByUser ? "right" : "left",
              marginLeft: 15,
              marginRight: 15,
              margin: 10,
            },
          ]}
        >
          {message.text}
        </Text>
      </Animated.View>
    </View>
  );
}
