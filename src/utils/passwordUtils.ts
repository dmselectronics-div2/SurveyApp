// Simple password hashing for local offline storage
// This is NOT a replacement for server-side bcrypt - it's only for local SQLite storage
// to avoid storing plain-text passwords on device

export const hashPassword = (password: string): string => {
  // Simple hash using a basic algorithm for local storage only
  let hash = 0;
  const salt = 'SurveyApp_2024_Salt';
  const salted = salt + password + salt;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Convert to hex and pad
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  // Double hash for extra safety
  let hash2 = 0;
  const doubled = hex + password + hex;
  for (let i = 0; i < doubled.length; i++) {
    const char = doubled.charCodeAt(i);
    hash2 = ((hash2 << 7) - hash2 + char) | 0;
  }
  return hex + (hash2 >>> 0).toString(16).padStart(8, '0');
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  return hashPassword(password) === storedHash;
};
