const Database = require('better-sqlite3');

module.exports = resolve => {
    const { filePath = 'core.db' } = resolve('settings').db;
    return new Database(filePath);
};
