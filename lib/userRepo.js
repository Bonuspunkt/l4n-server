const debug = require('debug')('l4n:server:userRepo');
const hashPassword = require('./hashPassword');
const { EventEmitter } = require('events');

const createTable = `
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    steamId TEXT,
    battleNetId TEXT,
    password TEXT,
    salt TEXT,
    iterations INTEGER
);`;

class UserRepo extends EventEmitter {
    constructor(resolve) {
        super();

        const db = resolve('db');

        db.exec(createTable);

        this.statements = {
            byId: db.prepare(`SELECT * FROM User WHERE Id = $id`),
            byName: db.prepare(`SELECT * FROM User WHERE LOWER(name) = LOWER($name)`),
            verify: db.prepare(`SELECT id, name FROM User WHERE LOWER(name) = LOWER($name) AND password = $password`),
            insertUser: db.prepare(`
                INSERT INTO User (name, steamId, battleNetId, password, salt, iterations)
                VALUES ($name, $steamId, $battleNetId, $password, $salt, $iterations);`),
        };
    }

    async register(user) {
        const { byName, insertUser, byId } = this.statements;

        if (user.password) {
            const { hash, salt, iterations } = await hashPassword(user.password);
            user = {
                ...user,
                password: hash.toString('hex'),
                salt: salt.toString('hex'),
                iterations
            };
        }
        user = { steamId: null, battleNetId: null, password: null, salt: null, iterations: null, ...user };

        const savedUser = byName.get({ name: user.name });
        if (savedUser) {
            throw Error('username already registered');
        }
        const { lastInsertROWID } = insertUser.run(user);
        return byId.get({ id: lastInsertROWID });
    }

    byId(id) {
        const { byId } = this.statements;

        return byId.get({ id });
    }

    async verify(name, password) {
        const { byName } = this.statements;

        const user = byName.get({ name });
        if (!user) { return null; }

        const salt = Buffer.from(user.salt, 'hex');
        const { hash } = await hashPassword(password, salt, user.iterations);
        const hashedPassword = hash.toString('hex');
        return hashedPassword === user.password
            ? user
            : null;
    }
}

module.exports = UserRepo;
