require('tap').mochaGlobals();
const { expect } = require('chai');

const hashPassword = require('./hashPassword');

describe('encrypt password', () => {
    it('should generate salt and hash', async () => {
        const result = await hashPassword('123456');

        expect(result.salt.length).to.equal(16);
        expect(result.hash.length).to.equal(32);
        expect(result.iterations).to.equal(40e3);
    });

    it('should generate same hash', async () => {
        const iterations = 10;
        const salt = 'f60532b5464d0ed3f59c3175ef3c454550b81b6877ed21a787b614d07149d1d8';
        const result1 = await hashPassword('123456', salt, iterations);
        expect(result1.salt).to.equal(salt);
        expect(result1.iterations).to.equal(iterations);

        const result2 = await hashPassword('123456', salt, iterations);
        expect(result2).to.deep.equal(result1);
    });
});
