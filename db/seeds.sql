
INSERT INTO departments (department_name)
VALUES('Engineering'), 
('Finance'), 
('Sales'), 
('Legal');


INSERT INTO roles (title, salary, department_id)
VALUES
('Front End Developer', 90000, 1), 
('Software Engineer', 150000, 1), 
('Accountant', 100000, )2, 
('Account Manager', 150000, 2),
('Sales Manager', 120000, 3), 
('Sales respresentative', 80000, 3), 
('Legal Team Lead', 200000, 4), 
('Lawyer', 120000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Michael', 'Scarn', 5, NULL), 
('Oscar', 'Martinez', 4, NULL), 
('Kienan', 'Wilson', 2, NULL), 
('Brendan', 'McArthur', 7, NULL), 
('Selena', 'Myer',8, 4),
('Angela', 'Smith', 3, 2), 
('Kevin', 'Malone', 3, 2), 
('Jim', 'Halpert', 6, 1), 
('Dwight', 'Schrute', 6, 1), 
('Jacob', 'Stevens', 1, 3);

