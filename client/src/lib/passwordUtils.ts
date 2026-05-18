/**
 * Password encryption utility for admin authentication
 * Uses simple base64 encoding + XOR cipher for obfuscation
 * This is client-side security - not cryptographically secure but prevents casual inspection
 */

const SECRET_KEY = "FitzelPot2026Auto";

// Simple XOR cipher for additional obfuscation
function xorEncrypt(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function xorDecrypt(text: string, key: string): string {
  return xorEncrypt(text, key); // XOR is symmetric
}

export function encryptPassword(password: string): string {
  const xored = xorEncrypt(password, SECRET_KEY);
  return btoa(xored); // Base64 encode
}

export function decryptPassword(encrypted: string): string {
  try {
    const decoded = atob(encrypted); // Base64 decode
    return xorDecrypt(decoded, SECRET_KEY);
  } catch {
    return "";
  }
}

export function verifyPassword(inputPassword: string, encryptedPassword: string): boolean {
  return encryptPassword(inputPassword) === encryptedPassword;
}
