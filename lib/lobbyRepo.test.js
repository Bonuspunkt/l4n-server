require('tap').mochaGlobals();
const { expect } = require('chai');
const { Spy } = require('l4n-common');

const Database = require('better-sqlite3');
const UserRepo = require('./userRepo');
const LobbyRepo = require('./lobbyRepo');

describe('lobbyRepo', () => {
    let db, resolve;

    beforeEach(() => {
        db = new Database('memory', { memory: true });
        resolve = name => {
            switch (name) {
                case 'db':
                    return db;
                default:
                    throw Error('not supported');
            }
        };
    });
    afterEach(() => {
        db.close();
    });

    it('create / join / destroy', async () => {
        const userRepo = new UserRepo(resolve);
        const lobbyRepo = new LobbyRepo(resolve);

        const createSpy = Spy();
        lobbyRepo.on('create', createSpy);
        const joinSpy = Spy();
        lobbyRepo.on('join', joinSpy);
        const leaveSpy = Spy();
        lobbyRepo.on('leave', leaveSpy);
        const destroySpy = Spy();
        lobbyRepo.on('destroy', destroySpy);

        const user1 = await userRepo.register({ name: 'a', password: 'a' });
        const user2 = await userRepo.register({ name: 'b', password: 'b' });
        const user3 = await userRepo.register({ name: 'c', password: 'c' });

        const createLobby = {
            game: 'myGame',
            userId: user1.id,
            name: 'lobbyName',
            minPlayers: 4,
        };

        const lobbyId = lobbyRepo.create({ lobby: createLobby, user: user1 });
        expect(createSpy.called.length).to.equal(1);
        const [[createdLobby]] = createSpy.called;
        expect(createdLobby.game).to.equal(createLobby.game);
        expect(createdLobby.name).to.equal(createLobby.name);
        expect(createdLobby.minPlayers).to.equal(createLobby.minPlayers);
        expect(createdLobby.userId).to.equal(createLobby.userId);
        expect(createdLobby.users).to.deep.equal(createdLobby.users);

        const initialLobby = lobbyRepo.byId(lobbyId);
        expect(initialLobby.game).to.equal(createLobby.game);
        expect(initialLobby.userId).to.equal(createLobby.userId);
        expect(initialLobby.name).to.equal(createLobby.name);
        expect(initialLobby.minPlayers).to.equal(createLobby.minPlayers);

        lobbyRepo.join({ lobbyId, userId: user2.id });
        expect(joinSpy.called.length).to.equal(1);

        lobbyRepo.join({ lobbyId, userId: user3.id });
        expect(joinSpy.called.length).to.equal(2);

        const [[join1Arg], [join2Arg]] = joinSpy.called;
        expect(join1Arg.lobbyId).to.equal(lobbyId);
        expect(join1Arg.userId).to.equal(user2.id);
        expect(join2Arg.lobbyId).to.equal(lobbyId);
        expect(join2Arg.userId).to.equal(user3.id);

        const lobby = lobbyRepo.byId(lobbyId);

        expect(lobby.users).to.deep.equal([user1.id, user2.id, user3.id]);

        expect(() => lobbyRepo.leave({ userId: user1.id })).to.throw();

        lobbyRepo.leave({ userId: user3.id });
        expect(leaveSpy.called.length).to.equal(1);
        const [[leaveArg]] = leaveSpy.called;
        expect(leaveArg.lobbyId).to.equal(lobbyId);
        expect(leaveArg.userId).to.equal(user3.id);

        lobbyRepo.destroy({ lobbyId, userId: user1.id });
        expect(destroySpy.called.length).to.equal(1);
        const [[destroyedLobbyId]] = destroySpy.called;
        expect(destroyedLobbyId).to.equal(lobbyId);

        const destroyedLobby = lobbyRepo.byId(lobbyId);

        expect(destroyedLobby.users.length).to.equal(0);
    });
});
