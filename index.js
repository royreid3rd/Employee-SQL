// Import required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'BigBootyBitches6969',
  database: 'employee_tracker_db',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
  // Start the application
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log('Invalid action.');
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query(
    `SELECT role.id, role.title, role.salary, department.name AS department
     FROM role
     INNER JOIN department ON role.department_id = department.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to view all employees
function viewAllEmployees() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name,
            role.title AS job_title, department.name AS department,
            role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee manager ON employee.manager_id = manager.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully.');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  // Fetch department names for role creation
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for this role:',
        },
        {
          name: 'department',
          type: 'list',
          message: 'Select the department for this role:',
          choices: departments.map((dept) => dept.name),
        },
      ])
      .then((answers) => {
        const chosenDept = departments.find((dept) => dept.name === answers.department);
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answers.title,
            salary: answers.salary,
            department_id: chosenDept.id,
          },
          (err) => {
            if (err) throw err;
            console.log('Role added successfully.');
            startApp();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Fetch roles and employees for employee creation
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:",
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:",
          },
          {
            name: 'role',
            type: 'list',
            message: "Select the employee's role:",
            choices: roles.map((role) => role.title),
          },
          {
            name: 'manager',
            type: 'list',
            message: "Select the employee's manager:",
            choices: ['None'].concat(
              employees.map((emp) => `${emp.first_name} ${emp.last_name}`)
            ),
          },
        ])
        .then((answers) => {
          let roleId = roles.find((role) => role.title === answers.role).id;
          let managerId = null;
          if (answers.manager !== 'None') {
            const manager = employees.find(
              (emp) => `${emp.first_name} ${emp.last_name}` === answers.manager
            );
            managerId = manager.id;
          }

          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: answers.first_name,
              last_name: answers.last_name,
              role_id: roleId,
              manager_id: managerId,
            },
            (err) => {
              if (err) throw err;
              console.log('Employee added successfully.');
              startApp();
            }
          );
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  // Fetch employees and roles for role update
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employees.map((emp) => `${emp.first_name} ${emp.last_name}`),
          },
          {
            name: 'newRole',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const chosenEmployee = employees.find(
            (emp) => `${emp.first_name} ${emp.last_name}` === answers.employee
          );
          const newRoleId = roles.find((role) => role.title === answers.newRole).id;

          connection.query(
            'UPDATE employee SET ? WHERE ?',
            [{ role_id: newRoleId }, { id: chosenEmployee.id }],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully.');
              startApp();
            }
          );
        });
    });
  });
}
