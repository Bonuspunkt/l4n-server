const sqlite3 = require('sqlite3');

const transform = (object) => Object.assign(
    {},
    ...Object.keys(object).map(key => ({ ['$' + key]: object[key] }))
);


module.exports = (resolve) => {
    const { filePath } = resolve('settings').db;
    const db = new sqlite3.Database(filePath);

    const method = (method) => (sql, params = {}) => new Promise((resolve, reject) => {
        db[method](
            sql, transform(params),
            (err, result) => err ? reject(err) : resolve(result)
        );
    });

    return {
        run: method('run'),
        get: method('get'),
        all: method('all'),
    };

};
