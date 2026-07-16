const crypto = require("crypto");

const algorithm = "aes-256-gcm";

const encryptionKey = Buffer.from(
    process.env.TC_ENCRYPTION_KEY,
    "hex"
);

const encryptTcNo = (tcNo) => {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        algorithm,
        encryptionKey,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(tcNo, "utf8"),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex")
    ].join(":");
};

const decryptTcNo = (encryptedTcNo) => {
    try{
        const [
            ivHex,
            authTagHex,
            encryptedHex
        ] = encryptedTcNo.split(":");

        const iv = Buffer.from(ivHex, "hex");

        const authTag = Buffer.from(authTagHex, "hex");

        const encrypted = Buffer.from(encryptedHex, "hex");

        const decipher = crypto.createDecipheriv(
            algorithm,
            encryptionKey,
            iv
        );

        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

        return decrypted.toString("utf8");
    }
    catch(err){
        const error = new Error("TC No çözümlenemedi") ;
        error.statusCode = 500 ;
        throw error ;
    }
};

const createTcHash = (tcNo) => {
    return crypto
        .createHmac(
            "sha256",
            process.env.TC_HASH_KEY
        )
        .update(tcNo)
        .digest("hex");
};

module.exports = {
    encryptTcNo,
    decryptTcNo,
    createTcHash
};