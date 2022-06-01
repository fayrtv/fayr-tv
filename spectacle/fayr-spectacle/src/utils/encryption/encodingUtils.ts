export const base64EncodeBuffer = (buffer: Uint8Array): string => {
    const resultView = Array.from(buffer);
    const encryptedDataStringified = resultView
        .map((byte) => String.fromCharCode(byte))
        .join("");

    const base64EncodedResult = window.btoa(encryptedDataStringified);

    return base64EncodedResult;
}

export const base64DecodeToBuffer = (base64EncodedPayload: string) => {    
    const base64DecodedData = window.atob(base64EncodedPayload);

    const decodedBuffer = new Uint8Array(base64DecodedData.length);
    for (let i = 0; i < base64DecodedData.length; i++) {
        decodedBuffer[i] = base64DecodedData.charCodeAt(i);
    }

    return decodedBuffer;
}