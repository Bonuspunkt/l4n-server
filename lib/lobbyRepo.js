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
        debug('started');

        this.statements = {
            insertLobby: db.prepare(`
                INSERT INTO Lobby (name, provider, game, publicInfo, privateInfo)
                VALUES ($name, $provider, $game, $publicInfo, $privateInfo);`),
            insertLobbyUser: db.prepare(`
                INSERT INTO LobbyUser (lobbyId, userId)
                VALUES ($lobbyId, $userId);`),

            byId: db.prepare('SELECT * FROM Lobby WHERE id = $id'),
            byIdUsers: db.prepare(`
                 SELECT User.id, User.name
                   FROM LobbyUser
                   JOIN User
                     ON User.Id = LobbyUser.UserId
                  WHERE LobbyUser.left is null
                    AND LobbyUser.lobbyId = $lobbyId`),

            byUserId: db.prepare(`
                 SELECT Lobby.*
                   FROM Lobby
                   JOIN LobbyUser
                     ON LobbyUser.lobbyId = Lobby.id
                    AND LobbyUser.left is null
                  WHERE LobbyUser.userId = $userId`),

            allOpen: db.prepare(`
                 SELECT Lobby.id, Lobby.provider, Lobby.game, Lobby.name,
                        count(*) as players,
                        count(Me.userId) as participating
                   FROM Lobby
                   JOIN LobbyUser
                     ON LobbyUser.lobbyId = Lobby.id
                    AND LobbyUser.left is null
                   LEFT JOIN LobbyUser Me
                     ON Me.lobbyId = Lobby.id
                    AND Me.userId = $userId
                    AND Me.left is null
                  GROUP BY Lobby.id, Lobby.provider, Lobby.game, Lobby.name`),

            usersLobbies: db.prepare(`
                 SELECT lobbyId
                   FROM LobbyUser
                  WHERE UserId = $userId
                    AND left is null`),

            leaveLobby: db.prepare(`
                 UPDATE LobbyUser
                    SET Left = CURRENT_TIMESTAMP
                  WHERE UserId = $userId
                    AND Left is null`)
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

        this.checkAlreadyInLobby({ userId: user.id });

        const lobbyId = insertLobby.run({
            name: lobby.name,
            provider: lobby.provider,
            userId: lobby.userId,
            game: lobby.game,
            publicInfo: lobby.publicInfo,
            privateInfo: lobby.privateInfo,
        }).lastInsertROWID;

        debug(`lobby for ${ lobby.provider }/${ lobby.game } ${ lobbyId } created`);

        insertLobbyUser.run({ lobbyId, userId: user.id });

        return lobbyId;
    }

    byId(lobbyId) {
        const { byId, byIdUsers } = this.statements;

        const lobby = byId.get({ id: lobbyId });
        const users = byIdUsers.all({ lobbyId });

        return { ...lobby, users };
    }

    byUserId(userId) {
        const { byUserId } = this.statements;
        return byUserId.get({ userId });
    }

    allOpen(userId) {
        const { allOpen } = this.statements;
        return allOpen.all({ userId });
    }

    join({ lobbyId, userId }) {
        const { insertLobbyUser } = this.statements;

        this.checkAlreadyInLobby({ userId });
        insertLobbyUser.run({ lobbyId, userId });
    }

    leave({ userId }) {
        const { leaveLobby } = this.statements;

        const { changes } = leaveLobby.run({ userId });
        if (changes !== 1) {
            debug(`leave UserId ${ userId } returned ${ changes } changes`);
        }
    }
};

module.exports = LobbyRepo;
