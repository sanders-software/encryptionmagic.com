/* 
 * This is free and unencumbered software released by encryptionmagic.com and sanders.software into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Questions?  Comments?  Contact us at: encryptionmagic.com@gmail.com
 * 
 * Minification provided by: https://minify-js.com/ and is covered by these same terms.  https://encryptionmagic.com/encryptionmagic.com.min.js
 */

const BINARY_DELIMITER_BYTES = new Uint8Array([110, 210, 151, 56, 82, 118, 22, 72, 150, 251, 135, 49, 98, 211, 231, 27, 48, 68, 131, 8, 136, 172, 193, 73, 164, 251, 184, 9, 157, 190, 128, 204]);
const ITERATIONS = 10000;
const HASH_ALGORITHM = "SHA-256";
const PBKDF2_KEY_SIZE = 640;

function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function decodeHexString(doubleHexString) {
    let result = '';
    for (let i = 0; i < doubleHexString.length; i += 2) {
        let hs = doubleHexString.substring(i, i + 2);
        let char = String.fromCharCode(parseInt(hs, 16));
        result += char;
    }
    return result;
}

function bytesFromHex(hexString) {
    let bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes;
}

function pad(data) {
    const blockSize = 16;
    const padSize = blockSize - (data.byteLength % blockSize);
    const paddedData = new Uint8Array(data.byteLength + padSize);
    paddedData.set(data);
    for (let i = data.byteLength; i < paddedData.byteLength; i++) {
        paddedData[i] = padSize;
    }
    return paddedData;
}

function unpad(buffer, blockSize, hasPadding) {
    if (!hasPadding) {
        return buffer;
    }
    let padding = buffer[buffer.length - 1];
    if (padding < 1 || padding > blockSize) {
        throw new Error('Invalid padding');
    }
    for (let i = 0; i < padding; i++) {
        if (buffer[buffer.length - 1 - i] !== padding) {
            throw new Error('Invalid padding');
        }
    }
    return buffer.slice(0, buffer.length - padding);
}

function hasPadding(buffer, blockSize) {
    let lastByte = buffer[buffer.length - 1];
    if (lastByte < 1 || lastByte > blockSize) {
        return false; // No padding
    }
    for (let i = 0; i < lastByte; i++) {
        if (buffer[buffer.length - 1 - i] !== lastByte) {
            return false; // Invalid padding
        }
    }
    return true; // Valid padding
}

function indexAll(array, pattern, startIndex = 0) {
    let indexes = [];
    let i = startIndex;
    let j = 0;
    let n = array.length;
    let m = pattern.length;

    while (i < n) {
        if (array[i] === pattern[j]) {
            j++;
        } else {
            j = 0;
        }
        i++;

        if (j === m) {
            indexes.push(i - m);
            j = 0;
        }
    }

    return indexes;
}

function checkPasswordType_AndDecodePassword(password) {

    function isCustomEncoded(password) {
        const customBase64Characters = 'ABCDEFGHIJKLMN*PQRSTUVWXYZabcdefghijk$mnopqrstuvwxyz0123456789&~=';
        for (let i = 0; i < password.length; i++) {
            if (!customBase64Characters.includes(password[i])) {
                return false;
            }
        }
        return true;
    }
    
    function isAsciiSet(password) {
        const asciiSetCharacters = '!@#$%^&*()-+<>/?;:"{[]}\\|`~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=';
        for (let i = 0; i < password.length; i++) {
            if (!asciiSetCharacters.includes(password[i])) {
                return false;
            }
        }
        return true;
    }
    
    // New function to validate and check padding
    function isValidCustomBase64(password) {
        try {
            const base64String = password
                .replace(/\*/g, 'O')
                .replace(/\$/g, 'l')
                .replace(/~/g, '/')
                .replace(/&/g, '+');
            // Decode base64 to check validity
            window.atob(base64String);
            return true;
        } catch (e) {
            return false;
        }
    }

    function fromBase64enmEncToBytes(customBase64) {
        // Reverse custom serialization
        const base64String = customBase64
            .replace(/\*/g, 'O')
            .replace(/\$/g, 'l')
            .replace(/~/g, '/')
            .replace(/&/g, '+');
    
        function base64ToUint8Array(base64) {
            const binaryString = window.atob(base64);
            const length = binaryString.length;
            const bytes = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        }
    
        // Decode base64 string to byte array using custom function
        const byteArray = base64ToUint8Array(base64String);
    
        return byteArray;
    }

    const mightBeCustom = isCustomEncoded(password) && isValidCustomBase64(password);
    if (mightBeCustom)
    {
        let base64Bytes = fromBase64enmEncToBytes(password);
        if (base64Bytes && base64Bytes.length === 32)
            return ['customBase64', base64Bytes];
    }

    const isAscii = isAsciiSet(password);

    if (isAscii) {
        return ['asciiSet', password];
    } else {
        return ['unknown', password];
    }
}

function getRandomUint32() {
    const byteArray = new Uint8Array(32);   // Create a Uint8Array with 32 bytes
    crypto.getRandomValues(byteArray);      // Fill the byteArray with cryptographically secure random values
    return byteArray;
}

async function verify_and_decrypt(encodedPassword, salt_bytes, hmac_hex_bytes, encrypted_bytes) {

    const pbkdf2Key = await window.crypto.subtle.importKey(
        "raw",
        encodedPassword,
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt_bytes,
            iterations: 10000,
            hash: "SHA-256"
        },
        pbkdf2Key,
        640
    );

    const encryptionKey = derivedBits.slice(0, 32);
    const signingKey = derivedBits.slice(32, 64);
    let aesCounter = derivedBits.slice(64);

    const hmacKey = await window.crypto.subtle.importKey(
        "raw",
        signingKey,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["verify"]
    );

    const isValid = await window.crypto.subtle.verify(
        "HMAC",
        hmacKey,
        hmac_hex_bytes,
        encrypted_bytes
    );

    const aesKey = isValid ? await window.crypto.subtle.importKey(
        "raw",
        encryptionKey,
        {name: "AES-CTR", length: 256},
        false,
        ["decrypt"]
    ): null;

    const decryptedBytes = isValid ? await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: aesCounter,
            length: 64
        },
        aesKey,
        encrypted_bytes
    ) : null;

    return [isValid, decryptedBytes];
}

function getRandomBase64Password() {
    const randomUint32 = getRandomUint32();
    const customBase64 = bytesToBase64enmEnc(randomUint32);
    return customBase64;
}

function generateRandomPassword(length) {
    const characters = '!@#$%^&*()-+<>/?;:\'"{[]}\\|`~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomCharacters = [];
  
    while (randomCharacters.length < length) {
      const byte = crypto.getRandomValues(new Uint8Array(1))[0];
      const character = characters[byte % characters.length];
      randomCharacters.push(character);
    }
  
    return randomCharacters.join('');
}

async function main_encryption(encodedPassword, bytesToEncrypt)
{
    const pbkdf2Key = await window.crypto.subtle.importKey(
        "raw",
        encodedPassword,
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(32));
    const derivedBits = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: ITERATIONS,
            hash: HASH_ALGORITHM
        },
        pbkdf2Key,
        PBKDF2_KEY_SIZE
    );

    const encryptionKey = derivedBits.slice(0, 32);
    const signingKey = derivedBits.slice(32, 64);
    const aesCounter = derivedBits.slice(64);

    // Encryption with AES-CTR
    const aesKey = await window.crypto.subtle.importKey(
        "raw",
        encryptionKey,
        {name: "AES-CTR", length: 256},
        false,
        ["encrypt"]
    );

    bytesToEncrypt = pad(bytesToEncrypt); // Add padding
    const encryptedBytes = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: aesCounter,
            length: 64
        },
        aesKey,
        bytesToEncrypt
    );

    const hmacKey = await window.crypto.subtle.importKey(
        "raw",
        signingKey,
        {name: "HMAC", hash: HASH_ALGORITHM},
        false,
        ["sign"]
    );
    const hmacSignature = await window.crypto.subtle.sign(
        "HMAC",
        hmacKey,
        encryptedBytes
    );

    return [new Uint8Array(salt), new Uint8Array(hmacSignature), new Uint8Array(encryptedBytes)];
}

async function encrypt(textToEncrypt, password) {
    if (!textToEncrypt) {
        throw new Error("File content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password);
    if (passwordType_DecodedPassword[0] === "customBase64")
    {
        password = passwordType_DecodedPassword[1];
        console.log('Using special case for base64 encoded 32 byte pw.');
    }

    const encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already
    
    let [salt, hmacSignature, encryptedBytes] = await main_encryption(encodedPassword, new TextEncoder().encode(textToEncrypt));

    const cipherTextJoined = [
        buf2hex(salt),
        buf2hex(hmacSignature),
        buf2hex(encryptedBytes)
    ].join('\n');
    const cipherTextEncodedUtf8 = new TextEncoder().encode(cipherTextJoined);
    const finalCipherText = buf2hex(cipherTextEncodedUtf8);

    // Output in ANSIBLE_VAULT format.
    let counter = 0;
    let ansibleEncryption = "$ANSIBLE_VAULT;1.1;AES256\n";

    for (const c of finalCipherText) {
        ansibleEncryption += c;
        counter += 1;
        if (counter % 80 === 0) {
            ansibleEncryption += "\n";
        }
    }

    return ansibleEncryption;
}

async function decrypt(encryptedFileContent, password) {
    if (!encryptedFileContent) {
        throw new Error("Encrypted file content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    if (!encryptedFileContent.startsWith("$ANSIBLE_VAULT")) {
        throw new Error("Vault text does not start with the header `$ANSIBLE_VAULT;`");
    }

    const vaultLines = encryptedFileContent.split('\n');
    const header = vaultLines[0].trim().split(';');
    const versionStr = header[1].trim();
    if (versionStr !== "1.1" && versionStr !== "1.2") {
        throw new Error("Currently only versions 1.1 and 1.2 are supported by this tool.");
    }

    const linesJoined = vaultLines.slice(1).join('').trim();
    const [saltHexString, hmacHexString, encryptedHexBytesString] = linesJoined.toLowerCase().split("0a");

    const salt_bytes = bytesFromHex(decodeHexString(saltHexString));
    const hmac_hex_bytes = bytesFromHex(decodeHexString(hmacHexString));
    const encrypted_bytes = bytesFromHex(decodeHexString(encryptedHexBytesString));
    let encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already

    // Try the pw without decoding 
    let [isValid, decryptedBytes] = await verify_and_decrypt(encodedPassword, salt_bytes, hmac_hex_bytes, encrypted_bytes);

    if (isValid)
    {
        const isPadded = hasPadding(new Uint8Array(decryptedBytes), 16); // Assuming block size of 16
        const unpaddedBytes = unpad(new Uint8Array(decryptedBytes), 16, isPadded);
        return new TextDecoder().decode(unpaddedBytes);
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password); 
    if (passwordType_DecodedPassword[0] === 'customBase64') {
        let [isValid2, decryptedBytes2] = await verify_and_decrypt(passwordType_DecodedPassword[1], salt_bytes, hmac_hex_bytes, encrypted_bytes);
        if (!isValid2) {
            throw new Error("HMAC verification failed, do you have the wrong password?");
        }
        console.log('Using special case for base64 encoded 32 byte pw.');

        const isPadded = hasPadding(new Uint8Array(decryptedBytes2), 16); // Assuming block size of 16
        const unpaddedBytes = unpad(new Uint8Array(decryptedBytes2), 16, isPadded);
        return new TextDecoder().decode(unpaddedBytes);
    }

    throw new Error("HMAC verification failed, do you have the wrong password?");
}

async function encryptBytes(fileContent, password)
{
    if (!fileContent) {
        throw new Error("File content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password);
    if (passwordType_DecodedPassword[0] === "customBase64")
    {
        password = passwordType_DecodedPassword[1];
        console.log('Using special case for base64 encoded 32 byte pw.');
    }

    const encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already

    let [salt, hmacSignature, encryptedBytes] = await main_encryption(encodedPassword, fileContent);

    const hmacTemp = new Uint8Array(hmacSignature);

    // Create a new Uint8Array to hold all the data
    let encrypted_data = new Uint8Array(salt.length + BINARY_DELIMITER_BYTES.length + hmacTemp.length + BINARY_DELIMITER_BYTES.length + encryptedBytes.byteLength);

    // Set the values
    encrypted_data.set(salt, 0);
    encrypted_data.set(BINARY_DELIMITER_BYTES, salt.length);
    encrypted_data.set(hmacTemp, salt.length + BINARY_DELIMITER_BYTES.length);
    encrypted_data.set(BINARY_DELIMITER_BYTES, salt.length + BINARY_DELIMITER_BYTES.length + hmacTemp.length);
    encrypted_data.set(new Uint8Array(encryptedBytes), salt.length + BINARY_DELIMITER_BYTES.length + hmacTemp.length + BINARY_DELIMITER_BYTES.length);

    return encrypted_data;
}

async function decryptBytes(encryptedFileBytes, password) {
    if (!encryptedFileBytes) {
        throw new Error("Encrypted file content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    const delimiterIndexes = indexAll(encryptedFileBytes, BINARY_DELIMITER_BYTES);

    if (delimiterIndexes.length !== 2)
    {
        throw new Error("Invalid file to decrypt.");
    }

    let index1 = delimiterIndexes[0];
    let index2 = delimiterIndexes[1];

    let salt_bytes = new Uint8Array(index1);
    let hmac_hex_bytes = new Uint8Array(index2 - index1 - BINARY_DELIMITER_BYTES.length);
    let encrypted_bytes = new Uint8Array(encryptedFileBytes.length - index2 - BINARY_DELIMITER_BYTES.length);

    salt_bytes.set(encryptedFileBytes.subarray(0, salt_bytes.length));
    hmac_hex_bytes.set(encryptedFileBytes.subarray(index1 + BINARY_DELIMITER_BYTES.length, index1 + BINARY_DELIMITER_BYTES.length + hmac_hex_bytes.length));
    encrypted_bytes.set(encryptedFileBytes.subarray(index2 + BINARY_DELIMITER_BYTES.length, index2 + BINARY_DELIMITER_BYTES.length + encrypted_bytes.length));
    const encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already

    // Try the pw without decoding 
    let [isValid, decryptedBytes] = await verify_and_decrypt(encodedPassword, salt_bytes, hmac_hex_bytes, encrypted_bytes);

    if (isValid)
    {
        const isPadded = hasPadding(new Uint8Array(decryptedBytes), 16); // Assuming block size of 16
        return unpad(new Uint8Array(decryptedBytes), 16, isPadded);
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password); 
    if (passwordType_DecodedPassword[0] === 'customBase64') {
        let [isValid2, decryptedBytes2] = await verify_and_decrypt(passwordType_DecodedPassword[1], salt_bytes, hmac_hex_bytes, encrypted_bytes);
        if (!isValid2) {
            throw new Error("HMAC verification failed, do you have the wrong password?");
        }
        console.log('Using special case for base64 encoded 32 byte pw.');

        const isPadded = hasPadding(new Uint8Array(decryptedBytes2), 16); // Assuming block size of 16
        return unpad(new Uint8Array(decryptedBytes2), 16, isPadded);
    }

    throw new Error("HMAC verification failed, do you have the wrong password?");
}

async function encryptBytesToText(fileName, fileContent, password)
{
    if (!fileContent) {
        throw new Error("File content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password);
    if (passwordType_DecodedPassword[0] === "customBase64")
    {
        password = passwordType_DecodedPassword[1];
        console.log('Using special case for base64 encoded 32 byte pw.');
    }

    const encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already
    
    let [salt, hmacSignature, encryptedBytes] = await main_encryption(encodedPassword, fileContent);

    const cipherTextJoined = [
        buf2hex(salt),
        buf2hex(hmacSignature),
        buf2hex(encryptedBytes)
    ].join('\n');
    const cipherTextEncodedUtf8 = new TextEncoder().encode(cipherTextJoined);
    const finalCipherText = buf2hex(cipherTextEncodedUtf8);

    // Output in ENCRYPTION_MAGIC_VAULT format.
    let counter = 0;
    let encryptionMagicVaultText = `$ENCRYPTION_MAGIC_VAULT;1.0;AES256;;${fileName}\n`;

    for (const c of finalCipherText) {
        encryptionMagicVaultText += c;
        counter += 1;
        if (counter % 80 === 0) {
            encryptionMagicVaultText += "\n";
        }
    }

    return encryptionMagicVaultText;
}

async function decryptTextToBytes(encryptedFileContent, password) {
    if (!encryptedFileContent) {
        throw new Error("Encrypted file content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    if (!encryptedFileContent.startsWith("$ENCRYPTION_MAGIC_VAULT")) {
        throw new Error("File content must be in `$ENCRYPTION_MAGIC_VAULT` format for this operation to work.");
    }

    const vaultLines = encryptedFileContent.split('\n');

    if (vaultLines.length < 5) {
        throw new Error("Header is not in the correct format.");
    }

    const header = vaultLines[0].trim().split(';');
    const versionStr = header[1].trim();
    if (versionStr !== "1.0") {
        throw new Error("Currently only version 1.0 is supported by this tool.");
    }

    const fileName = header[4]

    const linesJoined = vaultLines.slice(1).join('').trim();
    const [saltHexString, hmacHexString, encryptedHexBytesString] = linesJoined.toLowerCase().split("0a");

    const salt_bytes = bytesFromHex(decodeHexString(saltHexString));
    const hmac_hex_bytes = bytesFromHex(decodeHexString(hmacHexString));
    const encrypted_bytes = bytesFromHex(decodeHexString(encryptedHexBytesString));
    const encodedPassword = password instanceof Uint8Array ? password : new TextEncoder().encode(password); // convert password to Uint8Array if not already

    let [isValid, decryptedBytes] = await verify_and_decrypt(encodedPassword, salt_bytes, hmac_hex_bytes, encrypted_bytes);

    if (isValid)
    {
        const isPadded = hasPadding(new Uint8Array(decryptedBytes), 16); // Assuming block size of 16
        const unpaddedBytes = unpad(new Uint8Array(decryptedBytes), 16, isPadded);
        return [unpaddedBytes, fileName];
    }

    let passwordType_DecodedPassword = checkPasswordType_AndDecodePassword(password); 
    if (passwordType_DecodedPassword[0] === 'customBase64') {
        let [isValid2, decryptedBytes2] = await verify_and_decrypt(passwordType_DecodedPassword[1], salt_bytes, hmac_hex_bytes, encrypted_bytes);
        if (!isValid2) {
            throw new Error("HMAC verification failed, do you have the wrong password?");
        }
        console.log('Using special case for base64 encoded 32 byte pw.');

        const isPadded = hasPadding(new Uint8Array(decryptedBytes2), 16); // Assuming block size of 16
        const unpaddedBytes = unpad(new Uint8Array(decryptedBytes2), 16, isPadded);
        return [unpaddedBytes, fileName];
    }

    throw new Error("HMAC verification failed, do you have the wrong password?");
}

function bytesToBase64enmEnc(byteArray) {

    function uint8ArrayToBase64(uint8Array) {
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binary);
    }

    const base64String = uint8ArrayToBase64(byteArray);

    const customBase64 = base64String
        .replace(/O/g, '*')
        .replace(/l/g, '$')
        .replace(/\//g, '~')
        .replace(/\+/g, '&');

    return customBase64;
}

window.encrypt = encrypt;
window.encryptBytes = encryptBytes;
window.encryptBytesToText = encryptBytesToText;

window.decrypt = decrypt;
window.decryptBytes = decryptBytes;
window.decryptTextToBytes = decryptTextToBytes;

window.getRandomBase64Password = getRandomBase64Password;
window.generateRandomPassword = generateRandomPassword;
