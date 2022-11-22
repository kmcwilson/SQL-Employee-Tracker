
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: '',
        password: '',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db.')
)
db.connect();

module.exports = db