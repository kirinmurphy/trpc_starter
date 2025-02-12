import crypto from 'crypto';

export function getUniqueToken() {
  return crypto.randomBytes(32).toString('base64url');
}
