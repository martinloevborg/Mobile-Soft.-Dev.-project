import * as aesjs from 'aes-js';
import { Buffer } from 'buffer';
import { sha256 } from './hash';

const counter = 5;

async function deriveKey(password: string) {
  return Buffer.from(await sha256(password)).slice(0, 32);
}

async function getEncryptionObject(password: string) {
  const key = await deriveKey(password);
  return new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(counter));
}

export async function encrypt(text: string, password: string) {
  const aesCtr = await getEncryptionObject(password);
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

export async function decrypt(encryptedHex: string, password: string) {
  const aesCtr = await getEncryptionObject(password);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}
