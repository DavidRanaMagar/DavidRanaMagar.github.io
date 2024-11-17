

# Museum-Database Frontend

Museum Database: The Museum of Fine Arts (MFA), Houston needs a
database to keep track of their art collections, exhibitions, ticket sales and gift
shop revenue. Consider all aspects of what it takes to run a Museum and the
data you need to collect, to be able to produce reports regarding the
successful functioning of the museum.

This program acts as the frontend end user view. We created this program using javascript
framework React.js. This program request the data from our backend server using http endpoints.


## Getting started

### 1. Install Node.js
Download [Node.js](https://nodejs.org/en/download/package-manager)

### 2. Clone the project
   Clone the repository:
   ```bash
    git clone https://github.com/DavidRanaMagar/DavidRanaMagar.github.io.git
   ```
### 3. Get in the project file and install all the dependencies
   ```bash
   cd DavidRanaMagar.github.io
   ```
   
#### `npm install`

### 4. Configuration
   Currently, App is hitting hosted server api for data. If you have hosted backend server locally and want to get access to locally
hosted server. you have to make few changes in package.json file and /src/api/axios.js file

you have to change 
```jsunicoderegexp
"proxy": "http://3.94.130.218:3001"
```
to 
```jsunicoderegexp
"proxy": "http://localhost:3001"
```

and in axios.js
```javascript
baseURL: 'http://3.94.130.218:3001'
```
to

```javascript
baseURL: 'http://localhost:3001'
```

### 5. Usage
#### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser

### Customer View:

- Book Ticket
- My Tickets
- Products
- Gift Shop Purchase History
- Membership Signup
- Membership Status
- View Exhibitions
- Donate


### Admin

- View/Create Departments
- View/Create Employees
- View/Create Exhibitions
- View/Create Customers
- View/Record Loan
- View/Modify Departments
- View/Modify Artifacts
- View/Modify Gift Shop Item
- Employee Hours Report
- Ticket Sales Report
- Gift Shop Sales Report
- Donations Report
- Visitors Report
- Ticketing

### Manager
- Employee Hours Report
- View/Create Employees
- Ticketing

### Curator
- View/Create Exhibitions

### Collections Manager
- View/Modify Artifacts
- View/Record Loan

### Gift Shop Inventory Manager
- View/Modify Gift Shop Item
- Gift Shop Sales Report

### Staff
- Ticketing

## Reports and Queries
### Ticket Sales Report
- Ticket ID
- Customer ID
- Ticket Type
- Purchase Date
- Event Date
- Time Slot
- Ticket Status
- Ticket Price

### Gift Shop Sales Report
- Product ID
- Name
- Category
- Price

### Visitors Report
#### EXHIBITION VISITOR COUNT
- Exhibition: Number Of Visitors

#### TOTAL VISITORS AND VISITORS LIST
- Last Name
- CustomerID
- Sex
- Age
- Event
- Ticket Type
- Event Date

