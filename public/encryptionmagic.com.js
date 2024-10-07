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

async function encrypt(fileContent, password) {
    if (!fileContent) {
        throw new Error("File content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    const passwordBytes = new TextEncoder().encode(password);
    const derivedKey = await window.crypto.subtle.importKey(
        "raw",
        passwordBytes,
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const salt = crypto.getRandomValues(new Uint8Array(32));
    const concatKey = await window.crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt,
            iterations: 10000,
            hash: "SHA-256"
        },
        derivedKey,
        640
    );

    const cipherKey = concatKey.slice(0, 32);
    const hmacKey = concatKey.slice(32, 64);
    let nonce = concatKey.slice(64);

    // Encryption with AES-CTR
    const aesCipher = await window.crypto.subtle.importKey(
        "raw",
        cipherKey,
        {name: "AES-CTR", length: 256},
        false,
        ["encrypt"]
    );

    const bytesToEncrypt = new TextEncoder().encode(fileContent);
    const encryptedBytes = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: nonce,
            length: 64
        },
        aesCipher,
        bytesToEncrypt
    );

    const hmacSha256 = await window.crypto.subtle.importKey(
        "raw",
        hmacKey,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["sign"]
    );

    const hmacTemp = await window.crypto.subtle.sign(
        "HMAC",
        hmacSha256,
        encryptedBytes
    );

    const cipherTextJoined = [buf2hex(salt), buf2hex(new Uint8Array(hmacTemp)), buf2hex(new Uint8Array(encryptedBytes))].join('\n');
    const cipherTextEncodedUtf8 = new TextEncoder().encode(cipherTextJoined);
    const cipherText = buf2hex(cipherTextEncodedUtf8);

    // Output in ANSIBLE_VAULT format.
    let counter = 0;
    let ansibleEncryption = "$ANSIBLE_VAULT;1.1;AES256\n";

    for (const c of cipherText) {
        ansibleEncryption += c;
        counter += 1;
        if (counter % 80 === 0) {
            ansibleEncryption += "\n";
        }
    }

    return ansibleEncryption;
}

function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
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
        throw new Error("Currently only 1.1 and 1.2 is supported by this tool");
    }

    const linesJoined = vaultLines.slice(1).join('').trim();
    const [saltHexString, hmacHexString, encryptedHexBytesString] = linesJoined.toLowerCase().split("0a");

    const salt = bytesFromHex(decodeHexString(saltHexString));
    const hmacHex = bytesFromHex(decodeHexString(hmacHexString));
    const encryptedBytes = bytesFromHex(decodeHexString(encryptedHexBytesString));

    const derivedKey = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const concatKey = await window.crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt,
            iterations: 10000,
            hash: "SHA-256"
        },
        derivedKey,
        640
    );

    const cipherKey = concatKey.slice(0, 32);
    const hmacKey = concatKey.slice(32, 64);
    let nonce = concatKey.slice(64);

    const hmacSha256 = await window.crypto.subtle.importKey(
        "raw",
        hmacKey,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["verify"]
    );

    const isValid = await window.crypto.subtle.verify(
        "HMAC",
        hmacSha256,
        hmacHex,
        encryptedBytes
    );

    if (!isValid) {
        throw new Error("HMAC verification failed, did you enter the wrong password?");
    }

    const aesCipher = await window.crypto.subtle.importKey(
        "raw",
        cipherKey,
        {name: "AES-CTR", length: 256},
        false,
        ["decrypt"]
    );

    const decryptedBytes = await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: nonce,
            length: 64
        },
        aesCipher,
        encryptedBytes
    );

    const isPadded = hasPadding(new Uint8Array(decryptedBytes), 16); // Assuming block size of 16
    const unpaddedBytes = unpad(new Uint8Array(decryptedBytes), 16, isPadded);

    const decryptedString = new TextDecoder().decode(unpaddedBytes);

    return decryptedString;
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

async function encryptBytes(fileContent, password)
{
    if (!fileContent) {
        throw new Error("File content is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    //const bytesToEncrypt = fileContent;
    const salt = crypto.getRandomValues(new Uint8Array(32));

    // Make keys
    const derivedKey = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const concatKey = await window.crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt,
            iterations: 10000,
            hash: "SHA-256"
        },
        derivedKey,
        640
    );

    const cipherKey = concatKey.slice(0, 32);
    const hmacKey = concatKey.slice(32, 64);
    let nonce = concatKey.slice(64);

    // Encryption with PBKDF2
    const aesCipher = await window.crypto.subtle.importKey(
        "raw",
        cipherKey,
        {name: "AES-CTR", length: 256},
        false,
        ["encrypt"]
    );

    const encryptedArrayBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: nonce,
            length: 64
        },
        aesCipher,
        fileContent
    );
    const encryptedBytes = new Uint8Array(encryptedArrayBuffer);

    const hmacSha256 = await window.crypto.subtle.importKey(
        "raw",
        hmacKey,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["sign"]
    );

    const hmacTempBuffer = await window.crypto.subtle.sign(
        "HMAC",
        hmacSha256,
        encryptedBytes
    );

    const hmacTemp = new Uint8Array(hmacTempBuffer);

    // Create a new Uint8Array to hold all the data
    let encrypted_data = new Uint8Array(salt.length + BINARY_DELIMITER_BYTES.length + hmacTemp.length + BINARY_DELIMITER_BYTES.length + encryptedBytes.length);

    // Set the values
    encrypted_data.set(salt);
    encrypted_data.set(BINARY_DELIMITER_BYTES, salt.length);
    encrypted_data.set(new Uint8Array(hmacTemp), salt.length + BINARY_DELIMITER_BYTES.length);
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

    let salt = new Uint8Array(index1);
    let hmac_hex_bytes = new Uint8Array(index2 - index1 - BINARY_DELIMITER_BYTES.length);
    let encrypted_bytes = new Uint8Array(encryptedFileBytes.length - index2 - BINARY_DELIMITER_BYTES.length);

    salt.set(encryptedFileBytes.subarray(0, salt.length));
    hmac_hex_bytes.set(encryptedFileBytes.subarray(index1 + BINARY_DELIMITER_BYTES.length, index1 + BINARY_DELIMITER_BYTES.length + hmac_hex_bytes.length));
    encrypted_bytes.set(encryptedFileBytes.subarray(index2 + BINARY_DELIMITER_BYTES.length, index2 + BINARY_DELIMITER_BYTES.length + encrypted_bytes.length));

    const derivedKey = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );

    const concatKey = await window.crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt,
            iterations: 10000,
            hash: "SHA-256"
        },
        derivedKey,
        640
    );

    const cipherKey = concatKey.slice(0, 32);
    const hmacKey = concatKey.slice(32, 64);
    let nonce = concatKey.slice(64);

    const hmacSha256 = await window.crypto.subtle.importKey(
        "raw",
        hmacKey,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["verify"]
    );

    const isValid = await window.crypto.subtle.verify(
        "HMAC",
        hmacSha256,
        hmac_hex_bytes,
        encrypted_bytes
    );

    if (!isValid) {
        throw new Error("HMAC verification failed, did you enter the wrong password?");
    }

    const aesCipher = await window.crypto.subtle.importKey(
        "raw",
        cipherKey,
        {name: "AES-CTR", length: 256},
        false,
        ["decrypt"]
    );

    const decryptedBytes = await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: nonce,
            length: 64
        },
        aesCipher,
        encrypted_bytes
    );

    const isPadded = hasPadding(new Uint8Array(decryptedBytes), 16); // Assuming block size of 16
    const unpaddedBytes = unpad(new Uint8Array(decryptedBytes), 16, isPadded);

    return unpaddedBytes;
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

window.encrypt = encrypt;
window.encryptBytes = encryptBytes;
window.decrypt = decrypt;
window.decryptBytes = decryptBytes;