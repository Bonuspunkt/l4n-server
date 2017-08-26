const debug = require('debug')('l4n:server:userRepo');
const hashPassword = require('./hashPassword');

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

const verify = `
 SELECT id, name
   FROM User
  WHERE LOWER(name) = LOWER($name)
    AND password = $password`;

module.exports = (resolve) => {
    const db = resolve('db');
    db.exec(createTable);
    debug('started');

    const byId = db.prepare(`SELECT * FROM User WHERE Id = $id`);
    const byName = db.prepare(`SELECT * FROM User WHERE LOWER(name) = LOWER($name)`);
    const verify = db.prepare(`SELECT id, name FROM User WHERE LOWER(name) = LOWER($name) AND password = $password`);
    const insertUser = db.prepare(`
    INSERT INTO User (name, steamId, battleNetId, password, salt, iterations)
    VALUES ($name, $steamId, $battleNetId, $password, $salt, $iterations);`);

    return {
        register: async (user) => {
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
        },

        byId: (id) => {
            return byId.get({ id });
        },
        verify: async (name, password) => {
            const user = byName.get({ name });
            if (!user) { return null; }

            const salt = Buffer.from(user.salt, 'hex');
            const { hash } = await hashPassword(password, salt, user.iterations);
            const hashedPassword = hash.toString('hex');
            return hashedPassword === user.password
                ? user
                : null;
        }
    };
};
