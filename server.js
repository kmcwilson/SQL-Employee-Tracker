const inquirer = require('inquirer');
const db = require('./db/connections')

const PORT = process.env.PORT || 3001;

//Using console.table to greet the user upon starting the application
console.table(
    "\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n"
);
//This function goes through the initial questions for the user
const firstQuestions = async () => {
    try {
        console.log('\n\n')
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
            case 'Exit Application':
                process.exit();
        }
        
        // firstQuestions();

    }
    catch (err) { console.log("error" + err) };
};

//Adding a department to the departments table using inquirer prompt and sequel
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


//Adding a role to the roles table using inquirer prompt and sequel insert
const addRole = async () => {

    try {
        console.log('Adding to roles');
        //Selecting from department in order to use to add to the role 
        const departments = (await db.promise().query('SELECT * FROM departments'))[0];
        const departmentChoices = departments.map(dep => { return { name: dep.department_name, id: dep.id } });
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
                //Grabbing the department id to add to the roles table
                db.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES('${roleData.title}', '${roleData.salary}', '${depId[0][0].id}')`)
                    .then(res => { console.log('result:', res) });
            });

        console.log(`${roleData.title} added to the roles table!`)
        console.log('\n');
        firstQuestions();
    }
    catch (err) {
        console.log("error3" + err);
    }
};

//Adding an employee to the employees table using inquirer prompt and sequel insert
const addEmployee = async () => {

    try {
        console.log('Adding to employees');
        //Selecting all from roles and grabbing the name and role id
        const roles = (await db.promise().query('SELECT * FROM roles'))[0];
        const roleChoices = roles.map(roles => { return ({ name: roles.title, id: roles.id }) });
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
        //Using the select option to grab the id in order to add this into the employee table
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

//Select all in sql in order to view all of the roles within the database
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
//Select all in sql in order to view all of the roles within the database
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
//Select all in sql in order to view all of the employees within the database, concatinizing their name so that it shows both first and last in the table and adding the manager section
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
//Updating the employee that already exists in the database 
const updateEmployeeRole = async () => {

    try {
        console.log('Update an employee');
        //Selecting all from employees and grabbing the information for name and value
        const employees = (await db.promise().query('SELECT * FROM employees'))[0];
        const employeeChoices = employees.map(employees => { return { name: employees.first_name + " " + employees.last_name, value: employees.id } });
         //Selecting all from roles and grabbing the information for name and value
        const roles = (await db.promise().query('SELECT * FROM roles'))[0];
        const roleChoices = roles.map(roles => { return { name: roles.title, value: roles.id } });
        const roleData = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Choose the Employee you would like to update',
                choices: employeeChoices
            },
            {
                name: 'role',
                type: 'list',
                message: 'Choose a new role for the employee',
                choices: roleChoices
            }
        ]);
        //Using the information that was grabbed in the previous employeeChoices and roleChoices variables and using them to update the employee
        console.log('role data:', roleData)
        const result = await db.promise().query(`UPDATE employees SET role_id= ? WHERE id = ?`, [roleData?.role, roleData?.employee])
        console.log('result:', result);
        firstQuestions();

    }
    catch (err) {
        console.log("error5" + err);
    }
};


firstQuestions();
