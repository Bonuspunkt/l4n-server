const hashPassword = require('./hashPassword');
const { EventEmitter } = require('events');

const createTable = `
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
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
            byId: db.prepare(`SELECT * FROM User WHERE id = $id`),
            byName: db.prepare(`SELECT * FROM User WHERE LOWER(name) = LOWER($name)`),
            verify: db.prepare(
                `SELECT * FROM User WHERE LOWER(name) = LOWER($name) AND password = $password`,
            ),
            insertUser: db.prepare(`
                INSERT INTO User (name, password, salt, iterations)
                VALUES ($name, $password, $salt, $iterations);`),
            insertSystemUser: db.prepare(`
                INSERT INTO User (id, name, bio)
                VALUES ($id, $name, $bio);`),
            all: db.prepare(`SELECT * FROM User`),
            updateBio: db.prepare(`UPDATE User SET bio = $bio WHERE id = $userId`),
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
                iterations,
            };
        }
        user = {
            password: null,
            salt: null,
            iterations: null,
            ...user,
        };

        const savedUser = byName.get({ name: user.name });
        if (savedUser) {
            throw Error('username already registered');
        }
        const { lastInsertROWID } = insertUser.run(user);
        const result = byId.get({ id: lastInsertROWID });

        this.emit('add', result);

        return result;
    }

    byId(id) {
        const { byId } = this.statements;

        return byId.get({ id });
    }

    async verify(name, password) {
        const { byName } = this.statements;

        const user = byName.get({ name });
        if (!user) {
            return null;
        }

        const salt = Buffer.from(user.salt, 'hex');
        const { hash } = await hashPassword(password, salt, user.iterations);
        const hashedPassword = hash.toString('hex');
        return hashedPassword === user.password ? user : null;
    }

    all() {
        const { all } = this.statements;
        return all.all();
    }

    updateBio({ userId, bio }) {
        const { updateBio, byId } = this.statements;

        const { changes } = updateBio.run({ userId, bio });
        if (changes !== 1) {
            throw Error('update did not pass');
        }

        const user = byId.get({ id: userId });
        this.emit('change', user);
    }

    registerSystemUser(user) {
        if (!user.id || user.id >= 0) {
            throw Error('system user must have an id and it must be less than null');
        }

        user = {
            name: null,
            bio: null,
            ...user,
        };

        const { insertSystemUser, byId } = this.statements;
        insertSystemUser.run(user);

        const result = byId.get({ id: user.id });

        this.emit('add', result);

        return result;
    }
}

module.exports = UserRepo;
