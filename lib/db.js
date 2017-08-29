const Database = require('better-sqlite3');

module.exports = (resolve) => {
    const { filePath } = resolve('settings').db;
    return new Database(filePath);
};
