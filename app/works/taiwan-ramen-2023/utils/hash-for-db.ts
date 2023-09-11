import crypto from 'crypto';

export const hashForDB = async function (message: string | undefined) {
    if (message === undefined) {
        console.error("undefined message to encrypt");
        return "";
    }
    // Convert the message to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    // Compute the hash using the SHA-256 algorithm
    const hash = await crypto.subtle.digest("SHA-256", data);
    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex; // Output the hash
}
