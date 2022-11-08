const inquirer = require('inquirer');
const fs = require('fs');
const consoleTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db.')
)

console.table(
    "\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n"
);


const firstQuestions = async () => {
    try {
        await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add a department', 'Add a role', 'Add an employee', 'View all roles', 'View all departments', 'View all employees', 'Update an employee role'],
        });
        switch (action.choices) {
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Update an employee role':
                updateEmployee();
                break;

        }
    }
    catch (err) { console.log(err) };
    firstQuestions();
};

const addDepartment = async () => {
    try {
        console.log('Adding to departments');
        await inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the new department?'
            }
        ]);
        await db.query('INSERT INTO departments SET ?', {
            departments_names: department.message
        });
        console.log(`${department.message} added to the departments table!`)
        firstQuestions();
    }
    catch (err) {
            console.log(err);
        }
    };



const addRole =
    db.query('INSERT INTO roles (title)', (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(`${result} added to roles!`);
    });

const addEmployee =
    db.query('INSERT INTO employees (title, first_name, last_name)', (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(`${result} added to employee list!`);
    });

const viewRoles =
    db.query('SELECT * FROM roles', (err, result) => {
        console.log(result);
    });

const viewDepartments =
    db.query('SELECT * FROM departments', (err, result) => {
        console.log(result);
    });

const viewEmployees =
    db.query('SELECT * FROM employees', (err, result) => {
        console.log(result);
    });

const updateEmployee =
    db.query(`UPDATE employees SET name = ${inserted.name}`, (err, result) => {
        console.log(result);
    })


