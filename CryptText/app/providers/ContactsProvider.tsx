import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useFirstRender } from '../components/useFirstRender';
import { sha256 } from '../cryptography/hash';

export interface Contact {
  name: string;
  publicKey: string;
  sharedSecret: string;
  timestamp: number;
  conversationId: string;
}

type ContactsContextType = {
  getContacts(): Promise<void>;
  loadingComplete: boolean;

  contacts: Contact[];
  saveContacts(newContacts: Contact[]): Promise<void>;
  getContact(publicKey: string): Promise<Contact | undefined>;
  createContact: (publicKey: string, sharedSecret: string) => Promise<Contact>;
  setContact(contact: Contact): Promise<void>;
};

export const ContactsContext = React.createContext({} as ContactsContextType);

interface ContactsProviderProps {}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({
  children,
}) => {
  const [contacts, setContactsState] = useState<Contact[]>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const firstRender = useFirstRender();

  useEffect(() => {
    if (!firstRender) {
      setLoadingComplete(true);
    }
  }, [contacts]);

  const saveContacts = async (newContacts: Contact[]) => {
    setContactsState(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const getContacts = async () => {
    //await AsyncStorage.clear();

    var stored_contacts = await AsyncStorage.getItem('contacts');

    if (!stored_contacts) {
      await saveContacts([]);
      setContactsState([]);
    } else {
      setContactsState(JSON.parse(stored_contacts));
    }
  };

  const getContact = async (publicKey: string) => {
    return contacts.find((contact) => contact.publicKey == publicKey);
  };

  const createContact = async (
    publicKey: string,
    sharedSecret: string
  ): Promise<Contact> => {
    const contactExists = await getContact(publicKey);
    if (contactExists) {
      console.log('Contact already exists!');
      return contactExists;
    }

    const contact: Contact = {
      name: 'New contact',
      publicKey,
      sharedSecret,
      timestamp: new Date().getTime(),
      conversationId: await sha256(sharedSecret),
    };

    const newContacts = contacts;
    newContacts.push(contact);
    await saveContacts(newContacts);

    return contact;
  };

  const setContact = async (contact: Contact) => {
    const newContacts = contacts.map((c) => {
      return { ...c };
    });

    // Update contact name in the array
    const contact_index = newContacts.findIndex(
      (c) => c.publicKey == contact.publicKey
    );

    newContacts[contact_index] = contact;

    await saveContacts(newContacts);
  };

  return (
    <ContactsContext.Provider
      value={{
        getContacts,
        loadingComplete,

        contacts,
        saveContacts,
        getContact,
        createContact,
        setContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
