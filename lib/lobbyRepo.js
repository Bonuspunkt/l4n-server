const debug = require('debug')('l4n:server:lobbyRepo');
const { EventEmitter } = require('events');

const createTables = `
CREATE TABLE IF NOT EXISTS Lobby (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    userId INTEGER NOT NULL,
    game TEXT NOT NULL,
    mode TEXT,
    minPlayers INTEGER NOT NULL,
    maxPlayers INTEGER NOT NULL,
    publicInfo TEXT,
    privateInfo TEXT,
    state INTEGER NOT NULL DEFAULT 0,
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

const STATE = {
    WAITING: 0,
    LAUNCHING: 1,
    OPEN: 2,
};

class LobbyRepo extends EventEmitter {
    constructor(resolve) {
        super();

        const db = resolve('db');

        db.exec(createTables);

        this.statements = {
            insertLobby: db.prepare(`
                INSERT INTO Lobby (name, userId, game, mode, minPlayers, maxPlayers, publicInfo, privateInfo)
                VALUES ($name, $userId, $game, $mode, $minPlayers, $maxPlayers, $publicInfo, $privateInfo);`),
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
            userById: db.prepare(
                `SELECT * FROM LobbyUser WHERE left is null and lobbyId = $lobbyId`,
            ),

            allOpen: db.prepare(`
                 SELECT *
                   FROM Lobby
                  WHERE EXISTS (
                         SELECT * FROM LobbyUser
                          WHERE Lobby.id = lobbyId AND left is null
                        )`),
            allUsers: db.prepare(`SELECT * FROM LobbyUser WHERE left is null`),
            allLobbyUsers: db.prepare(
                `SELECT count(*) as count FROM LobbyUser WHERE left is null AND lobbyId = $lobbyId`,
            ),

            usersLobbies: db.prepare(`
                 SELECT lobbyId
                   FROM LobbyUser
                  WHERE userId = $userId
                    AND left is null`),

            spaceInLobby: db.prepare(`
                 SELECT *
                   FROM Lobby
                  WHERE id = $lobbyId
                    AND maxPlayers > (
                         SELECT count(*)
                           FROM LobbyUser
                          WHERE lobbyId = $lobbyId
                            AND left is null
                        )`),

            leaveLobby: db.prepare(`
                 UPDATE LobbyUser
                    SET left = CURRENT_TIMESTAMP
                  WHERE lobbyId = $lobbyId
                    AND userId = $userId
                    AND left is null`),

            destroyLobby: db.prepare(`
                 UPDATE LobbyUser
                    SET left = CURRENT_TIMESTAMP
                  WHERE lobbyId = $lobbyId
                    AND left is null`),

            updateState: db.prepare(`
                 UPDATE Lobby
                    SET state = $state
                  WHERE id = $lobbyId
            `),
        };
    }

    checkAlreadyInLobby({ userId }) {
        const { usersLobbies } = this.statements;
        const lobbies = usersLobbies.all({ userId });

        if (lobbies.length) {
            throw Error('already in lobby');
        }
    }
    checkSpaceInLobby({ lobbyId }) {
        const { spaceInLobby } = this.statements;
        const lobby = spaceInLobby.get({ lobbyId });
        if (!lobby) {
            throw Error('lobby is full');
        }
    }
    checkLobbyNotEmpty({ lobbyId }) {
        const { allLobbyUsers } = this.statements;
        const { count } = allLobbyUsers.get({ lobbyId });
        if (!count) throw Error('lobby is closed');
    }

    create({ lobby, user }) {
        const { insertLobby, insertLobbyUser } = this.statements;

        this.checkAlreadyInLobby({ userId: user.id });

        const lobbyId = insertLobby.run({
            name: lobby.name,
            userId: lobby.userId,
            game: lobby.game,
            mode: lobby.mode,
            minPlayers: lobby.minPlayers,
            maxPlayers: lobby.maxPlayers,
            publicInfo: lobby.publicInfo,
            privateInfo: lobby.privateInfo,
        }).lastInsertROWID;

        debug(`lobby for ${lobby.userId}/${lobby.game} ${lobbyId} created`);

        insertLobbyUser.run({ lobbyId, userId: user.id });

        const result = this.byId(lobbyId);
        this.emit('create', result);

        return result;
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
            users: lobbyUsers.filter(u => u.lobbyId === lobby.id).map(u => u.userId),
        }));
    }

    join({ lobbyId, userId }) {
        const { insertLobbyUser } = this.statements;

        this.checkAlreadyInLobby({ userId });
        this.checkSpaceInLobby({ lobbyId });
        this.checkLobbyNotEmpty({ lobbyId });
        insertLobbyUser.run({ lobbyId, userId });

        this.emit('join', { lobbyId, userId });
    }

    leave({ lobbyId, userId }) {
        const { byUserId, leaveLobby } = this.statements;

        const lobby = byUserId.get({ userId });
        if (lobby.userId == userId) {
            throw Error('lobby must be destroyed');
        }

        const { changes } = leaveLobby.run({ lobbyId, userId });
        if (changes !== 1) {
            debug(`leave UserId ${userId} returned ${changes} changes`);
        }
        this.emit('leave', { lobbyId: lobby.id, userId });
    }

    changeState({ lobbyId, newState, userId }) {
        const { byId, updateState } = this.statements;
        const lobby = byId.get({ lobbyId });

        if (lobby.userId !== userId) throw Error('user must be owner');

        if (
            (lobby.state === STATE.WAITING && newState === STATE.LAUNCHING) ||
            (lobby.state === STATE.LAUNCHING && newState === STATE.OPEN)
        ) {
            updateState.run({ lobbyId, state: newState });
            this.emit('state', { lobbyId, state: newState });
        } else {
            throw Error('invalid state transition');
        }
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

    kick({ lobbyId, byUserId, kickUserId }) {
        const { byId, leaveLobby } = this.statements;
        const lobby = byId.get({ lobbyId });

        if (lobby.userId !== byUserId) throw Error('insufficent rights');

        leaveLobby.run({ lobbyId, userId: kickUserId });

        this.emit('leave', { lobbyId: lobby.id, userId: kickUserId });
    }
}

module.exports = LobbyRepo;
