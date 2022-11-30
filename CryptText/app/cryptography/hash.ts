import * as Crypto from 'expo-crypto';

export function sha256(str: string): Promise<string> {
	return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, str);
}
