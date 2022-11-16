const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connections')

const PORT = process.env.PORT || 3001;


console.table(
    "\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n"
);

const firstQuestions = async () => {
    try {
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Add a department', 'Add a role', 'Add an employee', 'View all roles', 'View all departments', 'View all employees', 'Update an employee role', 'Exit Application'],
        });
        switch (choice) {
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
            default: process.exit();
        }
    }
    catch (err) { console.log("error" + err) };
};


const addDepartment = async () => {
    try {
        console.log('Adding to departments');
        const departmentData = await inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the new department?'
            }
        ]);
        db.query(`INSERT INTO departments (department_name) VALUES ('${departmentData.department}')`, {
        });
        console.log(`${departmentData.department} added to the departments table!`)
        firstQuestions();
    }
    catch (err) {
        console.log("error2" + err);
    }
};



const addRole = async () => {

    try {
        console.log('Adding to roles');
        const departments= (await db.promise().query('SELECT * FROM departments'))[0];    
        const departmentChoices= departments.map(dep=>{return{name: dep.department_name, id: dep.id}});
        console.log(departmentChoices);
        const roleData = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the new role?'

            }, 
            {
                name: 'department', 
                type: 'list', 
                message: 'Choose from the list of departments',
                choices: departmentChoices
            }
        ]);
        //How to get the depertment id from the user choice in a function
       db.query(`INSERT INTO roles (title, salary, department_id) VALUES('${roleData.title}', '${roleData.salary}', '')`, {
            title: roleData.title, 
            salary: roleData.salary,
           
        });
        console.log(`${roleData.title} added to the roles table!`)
        firstQuestions();
    }
    catch (err) {
        console.log("error3" + err);
    }
};

const addEmployee = async () => {

    try {
        console.log('Adding to employees');
        const roles= (await db.promise().query('SELECT * FROM roles'));    
        const roleChoices= roles.map(roles=>{return{names: roles.title, id: roles.id}});
        console.log(roleChoices);
        const employeeData= await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Choose from list of roles for the employee',
                choices: roleChoices
            },
            {
                name: 'first',
                type: 'input',
                message: 'What is the first name of the new employee?'
            },
            {
                name: 'last', 
                type: 'input', 
                message: 'What is the last name of the new employee?'

            }
        ]);
       db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeData.first_name}', '${employeeData.last_name}', '${employeeData.title}') `);
        console.log(`${employeeData.first_name, employeeData.last_name, employeeData.title} added to the new employee to table table!`)
        firstQuestions();
    }
    catch (err) {
        console.log("error4" + err);
    }
};


const viewRoles = function (){
    db.query('SELECT * FROM roles INNER JOIN departments ON roles.department_id=departments.id', (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result);
    })
    firstQuestions();
};

const viewDepartments = function () {
    db.query('SELECT * FROM departments', (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result);
    })
    firstQuestions();
};

const viewEmployees = function () {
    db.query('SELECT * FROM employees INNER JOIN roles ON employees.role_id= roles.id', (err, result) => {
        if(err){
            console.log(err)
        }
        console.log(result);
    })
    firstQuestions();
};

// const updateEmployee =

firstQuestions();
