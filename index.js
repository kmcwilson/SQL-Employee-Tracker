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
                updateEmployeeRole();
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
        const departments = (await db.promise().query('SELECT * FROM departments'))[0];
        const departmentChoices = departments.map(dep => { return { name: dep.department_name, id: dep.id } });
        console.log(departmentChoices)
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
        db.promise().query(`SELECT id FROM departments WHERE departments.department_name = '${roleData.department}'`)
            .then(depId => {
                console.log('department:', depId)
                db.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES('${roleData.title}', '${roleData.salary}', '${depId[0][0].id}')`)
                    .then(res => { console.log('result:', res) });
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
        const roles = (await db.promise().query('SELECT * FROM roles'))[0];
        const roleChoices = roles.map(roles => { return ({name: roles.title, id: roles.id}) });
        const employeeData = await inquirer.prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is the first name of the new employee?'
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is the last name of the new employee?'

            },
            {
                name: 'title',
                type: 'list',
                message: 'Choose from list of roles for the employee',
                choices: roleChoices
            }
        ]);
        db.promise().query(`SELECT id FROM roles WHERE roles.title = '${employeeData.title}'`)
            .then(rolesId => {
                db.promise().query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeData.first}', '${employeeData.last}', '${rolesId[0][0].id}') `)
                    .then(res => { console.log('result:', res) });
            });
        console.log(`${employeeData.first, employeeData.last, employeeData.title} added to the table!`)
        firstQuestions();
    }
    catch (err) {
        console.log("error4" + err);
    }
};


const viewRoles = function () {
    db.query('SELECT * FROM roles INNER JOIN departments ON roles.department_id=departments.id', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log('\n');
        console.table(result);
    })
    firstQuestions();
};

const viewDepartments = function () {
    db.query('SELECT * FROM departments', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log('\n')
        console.table(result);
    })
    firstQuestions();
};

const viewEmployees = function () {
    db.query(`SELECT 
                e.id, e.first_name, e.last_name, 
                r.title, r.salary, 
                d.department_name AS department, 
                CONCAT(m.first_name,' ' , m.last_name) AS manager 
                FROM employees e 
                INNER JOIN roles r ON e.role_id= r.id
                INNER JOIN departments d ON r.department_id= d.id
                LEFT JOIN employees m ON e.manager_id = m.id 
                ORDER BY e.last_name`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log('\n')
        console.table(result);
    })
    firstQuestions();
};

// const updateEmployee = async () => {
//     try {
//         console.log('Update an employee');
//         const employeeUpdate = (await db.promise().query('SELECT * FROM employees'));

//         const departments = (await db.promise().query('SELECT * FROM departments'))[0];
//         const employeeChoices = employees.map(employees => { return { first_name: employees.first_name, last_name: employees.last_name } });

//         const departmentChoices = departments.map(dep => { return { name: dep.department_name, id: dep.id } });
//         const employeeInfo = await inquirer.prompt([
//             {
//                 name: 'update',
//                 type: 'list',
//                 message: 'Choose what you would like to update',
//                 choices: ['Employee Role', 'Employee Department', 'Employee Salary', 'Employee First Name', 'Employee Last Name']

//             }
//         ]);
//         switch (update) {
//             case 'Employee Role':
//                 UpdateRole();
//                 break;
//             case 'Employee Department':
//                 UpdateDepartment();
//                 break;
//             case 'Employee Salary':
//                 UpdateSalary();
//                 break;
//             case 'Employee First Name':
//                 UpdateFirstName();
//                 break;
//             case 'Employee Last Name':
//                 UpdateLastName();
//                 break;
//             default: process.exit();
//         }
//     }
//     catch (err) { console.log("error" + err) };
// };

const updateEmployeeRole = async () => {

    try {
        console.log('Update an employee');
        const employees = (await db.promise().query('SELECT * FROM employees'));
        const roleUpdate = (await db.promise().query('SELECT * FROM roles'));
        const employeeChoices = employees.map(employees => { return { first_name: employees.first_name, last_name: employees.last_name } });
        const roleChoices = roleUpdate.map(roleUpdate => { return { names: roleUpdate.title, id: roleUpdate.id } });
        const roleData = await inquirer.prompt[(
            {
                name: 'employee',
                type: 'list',
                message: 'Choose the Employee you would like to update',
                choices: employeeChoices
            },
            {
                name: 'role',
                type: 'list',
                message: 'Choose the role you would like to update',
                choices: roleChoices
            },
            {
                name: 'update',
                type: 'input',
                message: 'Choose a new role for the employee',
                choices: roleChoices
            }
        )];
        // db.promise().query(`UPDATE roles SET title = ${roleData.update} WHERE id = ?`)

    }
    catch (err) {
        console.log("error5" + err);
    }
};


firstQuestions();
