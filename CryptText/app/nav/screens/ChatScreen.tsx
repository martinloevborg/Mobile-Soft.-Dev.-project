import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Button,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
} from "react-native";
import Colors from "../../styles/Colors";
import { MessageComponent } from "../../components/MessageComponent";
import { MessageData } from "../../cryptography/message";
import { ClientKeyContext } from "../../providers/ClientKeyProvider";
import { MessagesContext } from "../../providers/MessagesProvider";
import { ContactsContext } from "../../providers/ContactsProvider";
import Styles, { transitionDuration } from "../../styles/Styles";
import {
  hookTransitionEvents,
  unHookTransitionEvents,
} from "../../utility/transitionEventHooks";
import { MainNavProps } from "../MainParamList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ChatScreen({ navigation, route }: MainNavProps<'Chat'>) {
  const { client } = useContext(ClientKeyContext);
  const { sendMessage, messagesChanged, getContactMessages } =
    useContext(MessagesContext);
  const transitionEvents = hookTransitionEvents(navigation);
  const { contacts, setContact } = useContext(ContactsContext);

  var messages = getContactMessages(route.params.contact);

  const [text, onChangeText] = React.useState('');
  const [modalText, onChangeModalText] = React.useState(
    route.params.contact.name
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.contact.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={Colors.gray}
            style={{
              flex: 1,
              color: Colors.gray,
              alignSelf: "flex-end",
              textAlignVertical: "center",
              marginRight: 16,
              marginTop: 6,
            }}
          />
        </TouchableOpacity>
      ),
    });

    return () => {
      unHookTransitionEvents(navigation, transitionEvents);
    };
  }, [route.params.contact.name]);

  useEffect(() => {
    //setMessages(getContactMessages(route.params.contact));
    messages = getContactMessages(route.params.contact);
    setTimeout(() => {
      list?.scrollToOffset({ animated: false, offset: 0 });
    }, 100);
  }, [messagesChanged]);

  const [list, setList] = useState<FlatList<MessageData> | null>(null);

  useEffect(() => {
    if (list != null) {
      setTimeout(() => {
        list?.scrollToOffset({ animated: false, offset: 0 });
      }, transitionDuration / 2);

      //setTimeout(() => {
      //setMessages(getContactMessages(route.params.contact));
      //}, transitionDuration);
    }
  }, [list]);

  useEffect(() => {
    async function load() {
      await AsyncStorage.setItem(
        'enteredChatTimestamp',
        new Date().valueOf().toString()
      );
    }

    load();
  });

  return (
      <Screen scrollable={false} style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 6,
      }}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text>New Contact Name:</Text>
            <TextInput
              autoFocus={true}
              clearTextOnFocus={true}
              maxLength={12}
              style={{
                height: 40,
                width: '85%',
                margin: 10,
                padding: 5,
                backgroundColor: Colors.lightGray,
              }}
              onChangeText={onChangeModalText}
              value={modalText}
            />
            <Button
              title="Done"
              onPress={() => {
                route.params.contact.name = modalText;
                setContact(route.params.contact);
                setModalVisible(!modalVisible);
              }}
            ></Button>
          </View>
        </View>
      </Modal>
      <Animated.View
        style={[
          Styles.roundCardView,
          {
            backgroundColor: 'white',
          },
        ]}
      >
        <FlatList
          inverted={true}
          ref={(list) => {
            setList(list);
          }}
          data={messages}
          keyExtractor={(message) => {
            return message.timestamp.toString();
          }}
          style={{
            padding: 12,
            paddingBottom: 16,
            flex: 1,
          }}
          renderItem={(info) => (
            <MessageComponent
              message={info.item}
              transitionEvents={transitionEvents}
              sentByUser={client.publicKey == info.item.senderPublicKey}
              previousMessageSentBySameUser={
                info.index == messages.length - 1
                  ? false
                  : messages[info.index].senderPublicKey ==
                    messages[info.index + 1].senderPublicKey
              }
            />
          )}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            justifyContent: 'flex-end',
          }}
          scrollEnabled={true}
          initialNumToRender={messages.length}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={85}
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: Colors.lightGray,
          }}
        >
          <TextInput
            style={{
                flex: 1,
                height: 40,
                margin: 5,
                marginBottom: 16,
                padding: 10,
            }}
            onChangeText={onChangeText}
            placeholder={'Write a reply...'}
            value={text}
          />

          <TouchableOpacity
            style={{
              height: 60,
              flexDirection: 'row',
              alignContent: 'stretch',
            }}
            onPress={() => {
              if (text.length != 0) {
                sendMessage(route.params.contact, `${text}`).then(() => {
                  onChangeText('');
                });
              }
            }}
          >
            <MaterialCommunityIcons
              name="send"
              size={28}
              color="blue"
              style={{
                alignSelf: "center",
                textAlignVertical: "center",
                paddingLeft: 0,
                paddingRight: 14,
                paddingBottom: 4,
              }}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </Screen>
  );
}
