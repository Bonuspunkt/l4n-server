const debug = require('debug')('l4n:server:lobbyRepo');
const { EventEmitter } = require('events');

const createTables = `
CREATE TABLE IF NOT EXISTS Lobby (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    provider TEXT, -- null for CUSTOM lobby,
    userId INTEGER, -- not null for CUSTOM
    game TEXT NOT NULL,
    minPlayers INTEGER NOT NULL,
    maxPlayers INTEGER,
    publicInfo TEXT,
    privateInfo TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(userId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS LobbyUser (
    lobbyId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left TIMESTAMP,

    FOREIGN KEY(lobbyId) REFERENCES Lobby(id),
    FOREIGN KEY(userId) REFERENCES User(id)
);`;

class LobbyRepo extends EventEmitter {

    constructor(resolve) {
        super();

        const db = resolve('db');

        db.exec(createTables);

        this.statements = {
            insertLobby: db.prepare(`
                INSERT INTO Lobby (name, provider, userId, game, minPlayers, publicInfo, privateInfo)
                VALUES ($name, $provider, $userId, $game,  $minPlayers, $publicInfo, $privateInfo);`),
            insertLobbyUser: db.prepare(`
                INSERT INTO LobbyUser (lobbyId, userId)
                VALUES ($lobbyId, $userId);`),

            byUserId: db.prepare(`
                 SELECT Lobby.*
                   FROM Lobby
                   JOIN LobbyUser
                     ON LobbyUser.lobbyId = Lobby.id
                    AND LobbyUser.left is null
                  WHERE LobbyUser.userId = $userId`),

            byId: db.prepare(`SELECT * FROM Lobby WHERE id = $lobbyId`),
            userById: db.prepare(`SELECT * FROM LobbyUser WHERE left is null and lobbyId = $lobbyId`),


            allOpen: db.prepare(`
                 SELECT * FROM Lobby WHERE EXISTS (
                         SELECT * FROM LobbyUser WHERE Lobby.id = lobbyId AND left is null
                        )`),
            allUsers: db.prepare(`SELECT * FROM LobbyUser WHERE left is null`),

            usersLobbies: db.prepare(`
                 SELECT lobbyId
                   FROM LobbyUser
                  WHERE UserId = $userId
                    AND left is null`),

            leaveLobby: db.prepare(`
                 UPDATE LobbyUser
                    SET left = CURRENT_TIMESTAMP
                  WHERE userId = $userId
                    AND left is null`),

            destroyLobby: db.prepare(`
                 UPDATE LobbyUser
                    SET left = CURRENT_TIMESTAMP
                  WHERE lobbyId = $lobbyId
                    AND left is null`)
        };
    }

    checkAlreadyInLobby({ userId }) {
        const { usersLobbies } = this.statements;
        const lobbies = usersLobbies.all({ userId });

        if (lobbies.length) {
            throw Error('already in lobby');
        }
    }

    create({ lobby, user }) {
        const { insertLobby, insertLobbyUser } = this.statements;

        this.checkAlreadyInLobby({ userId: user.id });

        if (!lobby.provider && !lobby.userId) {
            throw Error('provider or user must be provided')
        }

        const lobbyId = insertLobby.run({
            name: lobby.name,
            provider: lobby.provider,
            userId: lobby.userId,
            game: lobby.game,
            minPlayers: lobby.minPlayers,
            publicInfo: lobby.publicInfo,
            privateInfo: lobby.privateInfo,
        }).lastInsertROWID;

        debug(`lobby for ${ lobby.provider }/${ lobby.game } ${ lobbyId } created`);

        insertLobbyUser.run({ lobbyId, userId: user.id });

        this.emit('create', this.byId(lobbyId));

        return lobbyId;
    }

    byId(lobbyId) {
        const { byId, userById } = this.statements;
        const lobby = byId.get({ lobbyId });
        const users = userById.all({ lobbyId }).map(u => u.userId);

        return { ...lobby, users };
    }

    allOpen() {
        const { allOpen, allUsers } = this.statements;
        const lobbies = allOpen.all();
        const lobbyUsers = allUsers.all();

        return lobbies.map(lobby => ({
            ...lobby,
            users: lobbyUsers
                .filter(u => u.lobbyId === lobby.id)
                .map(u => u.userId)
        }));
    }

    join({ lobbyId, userId }) {
        const { insertLobbyUser } = this.statements;

        this.checkAlreadyInLobby({ userId });
        insertLobbyUser.run({ lobbyId, userId });

        this.emit('join', { lobbyId, userId });
    }

    leave({ userId }) {
        const { byUserId, leaveLobby } = this.statements;

        const lobby = byUserId.get({ userId });
        if (lobby.userId == userId) {
            throw Error('lobby must be destroyed')
        }

        const { changes } = leaveLobby.run({ userId });
        if (changes !== 1) {
            debug(`leave UserId ${ userId } returned ${ changes } changes`);
        }
        this.emit('leave', { lobbyId: lobby.id, userId });
    }

    destroy({ lobbyId, userId }) {
        const { byId, destroyLobby } = this.statements;

        const lobby = byId.get({ lobbyId });
        if (lobby.userId !== userId) {
            throw Error('you must host the lobby to destroy it');
        }
        destroyLobby.run({ lobbyId });

        this.emit('destroy', lobbyId);
    }
};

module.exports = LobbyRepo;
