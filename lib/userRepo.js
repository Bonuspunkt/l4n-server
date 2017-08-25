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

const byName = `
SELECT * FROM User WHERE LOWER(name) = LOWER($name)`;
const insertUser = `
INSERT INTO User (name, steamId, battleNetId, password, salt, iterations)
VALUES ($name, $steamId, $battleNetId, $password, $salt, $iterations);`
const byId = `
 SELECT id, name, steamId, battleNetId
   FROM User
  WHERE Id = $id`;
const verify = `
 SELECT id, name
   FROM User
  WHERE LOWER(name) = LOWER($name)
    AND password = $password`;

module.exports = (resolve) => {
    const db = resolve('db');

    db.run(createTable)
        .then(() => debug('table created'))
        .catch(error => debug(error));

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

            const savedUser = await db.get(byName, { name: user.name });
            if (savedUser) {
                throw Error('username already registered');
            }
            await db.run(insertUser, user);
            return db.get(byName, { name: user.name });
        },

        byId: (id) => {
            return db.get('SELECT id, name, steamId, battleNetId FROM User WHERE Id = $id', { id });
        },
        verify: async (name, password) => {
            const user = await db.get(byName, { name });
            if (!user) { return null; }

            const salt = Buffer.from(user.salt, 'hex');
            const { hash } = await hashPassword(password, salt, user.iterations);
            const hashPassword = hash.toString('hex');
            return hashPassword === user.password
                ? user
                : null;
        }

    }
}
