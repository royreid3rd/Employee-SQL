# Employee Tracker

## Description

Employee Tracker is a command-line application built with Node.js and MySQL that allows businesses to manage their employee database. It provides functionalities to view, add, update, and delete departments, roles, and employees within the organization.

The application uses Inquirer for interactive command-line prompts and MySQL for database operations. It follows a structured schema for storing department, role, and employee information, facilitating efficient organization and management of company resources.

## Getting Started

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your MySQL database and execute the schema and seeds SQL scripts provided in the `db` directory.
4. Update the database connection settings in `index.js` with your MySQL credentials.
5. Run the application using `node index`.

## Usage

Once the application is running, you can perform the following actions:

- View all departments, roles, and employees.
- Add a new department, role, or employee.
- Update an employee's role.
- Delete a department, role, or employee.

Follow the command-line prompts to navigate through the application and interact with the database.

## Technologies Used

- Node.js
- Inquirer
- MySQL
