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

    it('create / join / leave / destroy', async () => {
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
        const user4 = await userRepo.register({ name: 'd', password: 'd' });
        const user5 = await userRepo.register({ name: 'e', password: 'e' });

        const createLobby = {
            game: 'myGame',
            userId: user1.id,
            name: 'lobbyName',
            minPlayers: 2,
            maxPlayers: 4,
        };

        const lobbyId = lobbyRepo.create({ lobby: createLobby, user: user1 });
        expect(createSpy.called.length).to.equal(1);
        const [[createdLobby]] = createSpy.called;
        expect(createdLobby.game).to.equal(createLobby.game);
        expect(createdLobby.name).to.equal(createLobby.name);
        expect(createdLobby.userId).to.equal(createLobby.userId);
        expect(createdLobby.minPlayers).to.equal(createLobby.minPlayers);
        expect(createdLobby.maxPlayers).to.equal(createLobby.maxPlayers);
        expect(createdLobby.state).to.deep.equal(0);
        expect(createdLobby.users).to.deep.equal([user1.id]);

        const initialLobby = lobbyRepo.byId(lobbyId);
        expect(initialLobby).to.deep.equal(createdLobby);

        lobbyRepo.join({ lobbyId, userId: user2.id });
        expect(joinSpy.called.length).to.equal(1);

        lobbyRepo.join({ lobbyId, userId: user3.id });
        expect(joinSpy.called.length).to.equal(2);

        lobbyRepo.join({ lobbyId, userId: user4.id });
        expect(joinSpy.called.length).to.equal(3);

        const [[join1Arg], [join2Arg], [join3Arg]] = joinSpy.called;
        expect(join1Arg).to.deep.equal({ lobbyId, userId: user2.id });
        expect(join2Arg).to.deep.equal({ lobbyId, userId: user3.id });
        expect(join3Arg).to.deep.equal({ lobbyId, userId: user4.id });

        expect(() => lobbyRepo.join({ lobbyId, userId: user5.id })).to.throw();

        const lobby = lobbyRepo.byId(lobbyId);

        expect(lobby.users).to.deep.equal([user1.id, user2.id, user3.id, user4.id]);

        expect(() => lobbyRepo.leave({ lobbyId, userId: user1.id })).to.throw();

        lobbyRepo.leave({ lobbyId, userId: user2.id });
        expect(leaveSpy.called.length).to.equal(1);

        expect(() =>
            lobbyRepo.kick({ lobbyId, byUserId: user3.id, kickUserId: user4.id }),
        ).to.throw();

        lobbyRepo.kick({ lobbyId, byUserId: user1.id, kickUserId: user3.id });
        expect(leaveSpy.called.length).to.equal(2);

        const [[leave1Arg], [leave2Arg]] = leaveSpy.called;
        expect(leave1Arg).to.deep.equal({ lobbyId, userId: user2.id });
        expect(leave2Arg).to.deep.equal({ lobbyId, userId: user3.id });

        lobbyRepo.destroy({ lobbyId, userId: user1.id });
        expect(destroySpy.called.length).to.equal(1);
        const [[destroyedLobbyId]] = destroySpy.called;
        expect(destroyedLobbyId).to.equal(lobbyId);

        const destroyedLobby = lobbyRepo.byId(lobbyId);

        expect(destroyedLobby.users.length).to.equal(0);
    });
});
