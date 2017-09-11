const crypto = require('crypto');

const SALT_LENGTH = 16;
const OUTPUT_LENGTH = 32;
const ITERATIONS = 40e3;

const generateSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(SALT_LENGTH, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });

const pbkdf2 = (password, salt, iterations) =>
    new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, OUTPUT_LENGTH, 'sha256', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve(derivedKey);
            }
        });
    });

module.exports = async (password, salt, iterations = ITERATIONS) => {
    salt = salt || (await generateSalt());
    const hash = await pbkdf2(password, salt, iterations);

    return { iterations, salt, hash };
};
