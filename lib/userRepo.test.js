require('tap').mochaGlobals()
const { expect } = require('chai');

const Database = require('better-sqlite3');
const UserRepo = require('./userRepo');

describe('userRepo', () => {
    let db, resolve;

    beforeEach(() => {
        db = new Database('memory', { memory: true });
        resolve = (name) => {
            switch (name) {
                case 'db':
                    return db;
                default:
                    return undefined;
            }
        };
    });
    afterEach(() => { db.close(); });

    it('register / verify lifecycle', async () => {
        const userRepo = new UserRepo(resolve);

        const name = 'test';
        const password = '123456';

        const user = await userRepo.register({ name, password });
        expect(user).to.have.property('id');
        expect(user.name).to.equal(name);
        expect(user.password).to.not.equal(password);

        const verifiedUser = await userRepo.verify(name, password);
        expect(verifiedUser).to.deep.equal(user);
    });

    it('verify failed', async () => {
        const userRepo = new UserRepo(resolve);

        const user = await userRepo.verify('a', 'b');
        expect(user).to.equal(null);
    })
});
