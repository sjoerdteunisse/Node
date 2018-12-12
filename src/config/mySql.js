const mysql = require('mysql2');


//Password shouldn't be set remove it.
//set DB_PASSWORD='password'& npm start

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'nodeDB_user',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'nodedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

var connectionPool = mysql.createPool(dbConfig);

console.log(`Database connection established to '${dbConfig.database}' on ip-adress: '${dbConfig.host}'`);

module.exports = connectionPool;