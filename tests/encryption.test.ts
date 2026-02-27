import { describe, it, expect } from 'vitest';
import {
  encrypt,
  decrypt,
  encryptJSON,
  decryptJSON,
  deriveKey,
  generateSalt,
  createSentinel,
  verifySentinel,
} from '../src/storage/encryption.js';

describe('encryption', () => {
  const passphrase = 'test-passphrase-123';
  const salt = generateSalt();
  const key = deriveKey(passphrase, salt, 1000); // Low iterations for test speed

  it('should encrypt and decrypt a string', () => {
    const plaintext = 'Hello, REBT world!';
    const encrypted = encrypt(plaintext, key);

    expect(encrypted.ciphertext).not.toBe(plaintext);
    expect(encrypted.iv).toBeTruthy();
    expect(encrypted.authTag).toBeTruthy();

    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  it('should encrypt and decrypt JSON', () => {
    const data = { feeling: 'anxious', intensity: 75, beliefs: ['I must be perfect'] };
    const encrypted = encryptJSON(data, key);
    const decrypted = decryptJSON(encrypted, key);
    expect(decrypted).toEqual(data);
  });

  it('should fail decryption with wrong key', () => {
    const wrongKey = deriveKey('wrong-passphrase', salt, 1000);
    const encrypted = encrypt('secret data', key);

    expect(() => decrypt(encrypted, wrongKey)).toThrow();
  });

  it('should produce different ciphertexts for same plaintext (random IV)', () => {
    const plaintext = 'same input';
    const enc1 = encrypt(plaintext, key);
    const enc2 = encrypt(plaintext, key);

    expect(enc1.ciphertext).not.toBe(enc2.ciphertext);
    expect(enc1.iv).not.toBe(enc2.iv);
  });

  it('should generate unique salts', () => {
    const s1 = generateSalt();
    const s2 = generateSalt();
    expect(s1).not.toBe(s2);
    expect(s1.length).toBe(64); // 32 bytes hex
  });

  it('should derive deterministic keys from same passphrase+salt', () => {
    const k1 = deriveKey(passphrase, salt, 1000);
    const k2 = deriveKey(passphrase, salt, 1000);
    expect(k1.equals(k2)).toBe(true);
  });

  it('should create and verify sentinel', () => {
    const sentinel = createSentinel(key);
    expect(verifySentinel(sentinel, key)).toBe(true);
  });

  it('should reject sentinel with wrong key', () => {
    const sentinel = createSentinel(key);
    const wrongKey = deriveKey('wrong', salt, 1000);
    expect(verifySentinel(sentinel, wrongKey)).toBe(false);
  });

  it('should handle empty string encryption', () => {
    const encrypted = encrypt('', key);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe('');
  });

  it('should handle unicode text', () => {
    const plaintext = '感情: 不安 😰 — "I must be perfect" → preference';
    const encrypted = encrypt(plaintext, key);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });
});
