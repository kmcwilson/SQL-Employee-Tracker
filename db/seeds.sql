INSERT INTO departments (names)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles(title, salary, department_name)
VALUES ('Salesperson', '80000', 'Sales'), 
('Lead Engineer', '150000', 'Engineering'),
('Software Engineer', '120000', 'Engineering'),
('Account Manager', '160000', 'Finance'),
('Accountant', '125000', 'Finance'),
('Legal Team Lead', '250000', 'Legal'),
('Lawyer', '190000', 'Legal');

INSERT INTO employees(title, first_name, last_name)
VALUES('Salesperson','Mike', 'Chan'), 
('Lead Engineer','Ashley', 'Rodriguez'), 
('Software Engineer','Kevin', 'Tupik'),
('Account Manager','Kunal', 'Singh'),
('Accountant','Malia','Brown'),
('Legal Team Lead','Sarah', 'Lourd'),
('Lawyer','Tom', 'Allen');
