const inquirer = require('inquirer');
const fs = require('fs');
const sql = require('./db/scheme.sql');
const { isAsyncFunction } = require('util/types');
const { allowedNodeEnvironmentFlags } = require('process');


console.table(
    "\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n"
)


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