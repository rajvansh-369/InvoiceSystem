const crypto = require('crypto');

// Algorithm and constants
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = 'my_very_secret_key'; // This can be any key
const HASHED_SECRET_KEY = crypto.createHash('sha256').update(SECRET_KEY).digest(); // Ensure 32 bytes
const IV_LENGTH = 16; // AES requires a 16-byte IV

// Function to encrypt data
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv(ALGORITHM, HASHED_SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Return IV + encrypted data
}

// Function to decrypt data
function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':'); // Extract IV and encrypted data
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, HASHED_SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Export the utility functions
module.exports = { encrypt, decrypt };
