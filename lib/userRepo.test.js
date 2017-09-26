require('tap').mochaGlobals();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const { expect } = chai;

const { Spy } = require('l4n-common');

const Database = require('better-sqlite3');
const UserRepo = require('./userRepo');

const getResolve = () => {
    const db = new Database(String(Date.now()), { memory: true });
    return name => {
        switch (name) {
            case 'db':
                return db;
            default:
                throw Error('not supported');
        }
    };
};

describe('userRepo', () => {
    it('register / verify lifecycle', async () => {
        const resolve = getResolve();
        const userRepo = new UserRepo(resolve);
        const spy = Spy();

        userRepo.on('add', spy);

        const name = 'test';
        const password = '123456';

        const user = await userRepo.register({ name, password });
        expect(user).to.have.property('id');
        expect(user.name).to.equal(name);
        expect(user.password).to.not.equal(password);

        expect(spy.called.length).to.equal(1);
        const [args] = spy.called;
        expect(args).to.deep.equal([user]);

        const verifiedUser = await userRepo.verify(name, password);
        expect(verifiedUser).to.deep.equal(user);
    });

    it('should return null if verify failed', async () => {
        const resolve = getResolve();
        const userRepo = new UserRepo(resolve);

        const user = await userRepo.verify('a', 'b');
        expect(user).to.equal(null);
    });

    it('should not be possible to register same username twice', async () => {
        const password = 'a';
        const resolve = getResolve();
        const userRepo = new UserRepo(resolve);
        await userRepo.register({ name: 'abc', password });

        expect(userRepo.register({ name: 'abc', password })).to.be.rejectedWith(Error);
        expect(userRepo.register({ name: 'ABC', password })).to.be.rejectedWith(Error);
    });

    it('should be possible to register system user', () => {
        const resolve = getResolve();
        const spy = new Spy();
        const userRepo = new UserRepo(resolve);
        userRepo.on('add', spy);

        const createUser = {
            id: -1,
            name: 'test',
            bio: '# test',
        };

        const user = userRepo.registerSystemUser(createUser);

        expect(user.id).to.equal(createUser.id);
        expect(user.name).to.equal(createUser.name);
        expect(user.bio).to.equal(createUser.bio);

        expect(spy.called.length).to.equal(1);
    });

    it('should not be possible to register system user with id greater or equal to 0', () => {
        const resolve = getResolve();
        const userRepo = new UserRepo(resolve);

        expect(() => userRepo.registerSystemUser({ id: 0, name: 'system' })).to.throw();
    });
});
