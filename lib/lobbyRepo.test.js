require('tap').mochaGlobals()
const { expect } = require('chai');

const Database = require('better-sqlite3');
const UserRepo = require('./userRepo');
const LobbyRepo = require('./lobbyRepo');

describe('lobbyRepo', () => {
    let db, resolve;

    beforeEach(() => {
        db = new Database('memory', { memory: true });
        resolve = (name) => {
            switch (name) {
                case 'db':
                    return db;
                default:
                    throw Error('not supported');
            }
        };
    });
    afterEach(() => { db.close(); });

    it('register / verify lifecycle', async () => {
        const userRepo = new UserRepo(resolve);
        const lobbyRepo = new LobbyRepo(resolve);

        const user1 = await userRepo.register({ name: 'a', password: 'a' });
        const user2 = await userRepo.register({ name: 'b', password: 'b' });

        const createLobby = {
            game: 'myGame',
            userId: user1.id,
            name: 'lobbyName',
            minPlayers: 4
        };

        const lobbyId = lobbyRepo.create({ lobby: createLobby, user: user1 });

        const initialLobby = lobbyRepo.byId(lobbyId);
        expect(initialLobby.game).to.equal(createLobby.game);
        expect(initialLobby.userId).to.equal(createLobby.userId);
        expect(initialLobby.name).to.equal(createLobby.name);
        expect(initialLobby.minPlayers).to.equal(createLobby.minPlayers);

        lobbyRepo.join({ lobbyId: initialLobby.id, userId: user2.id });

        const lobby = lobbyRepo.byId(lobbyId);

        expect(lobby.users).to.be.an('array');
        expect(lobby.users.length).to.equal(2);
        expect(lobby.users.every(user => ['a', 'b'].includes(user.name))).to.equal(true);

        expect(() => lobbyRepo.leave({ userId: user1.id })).to.throw();

        lobbyRepo.destroy({ lobbyId, userId: user1.id });

        const destroyedLobby = lobbyRepo.byId(lobbyId);

        expect(destroyedLobby.users.length).to.equal(0);
    });
});
