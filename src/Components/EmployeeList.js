import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Container,
    IconButton,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // Track create mode

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/employee');
                setEmployees(response.data);
            } catch (err) {
                console.error('Error fetching employee data:', err);
            }
        };
        fetchEmployees();
    }, []);

    // Open form for editing
    const handleRowClick = (employeeID) => {
        setSelectedEmployeeID(employeeID);
        setIsCreating(false); // Disable create mode when editing
    };

    // Open form for creating new employee
    const handleCreateEmployee = () => {
        setSelectedEmployeeID(null);
        setIsCreating(true); // Enable create mode
    };

    // Clear selection and close form
    const clearSelection = () => {
        setSelectedEmployeeID(null);
        setIsCreating(false); // Exit create mode when form is closed
    };

    const handleDelete = async (employeeID) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`/employee/${employeeID}`);
                setEmployees(employees.filter(employee => employee.employeeID !== employeeID));
                alert('Employee deleted successfully!');
            } catch (err) {
                console.error('Error deleting employee:', err);
                alert('Failed to delete employee');
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Employee Information
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateEmployee}>
                    Create New Employee
                </Button>
            </Box>
            {!selectedEmployeeID && !isCreating ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">First Name</Typography></TableCell>
                                <TableCell><Typography variant="h6">Last Name</Typography></TableCell>
                                <TableCell><Typography variant="h6">Gender</Typography></TableCell>
                                <TableCell><Typography variant="h6">Hire Date</Typography></TableCell>
                                <TableCell><Typography variant="h6">Job Title</Typography></TableCell>
                                <TableCell><Typography variant="h6">Department</Typography></TableCell>
                                <TableCell><Typography variant="h6">Email</Typography></TableCell>
                                <TableCell><Typography variant="h6">Action</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.employeeID} hover>
                                    <TableCell>{employee.firstName}</TableCell>
                                    <TableCell>{employee.lastName}</TableCell>
                                    <TableCell>{employee.employeeGender?.sex}</TableCell>
                                    <TableCell>{employee.hireDate}</TableCell>
                                    <TableCell>{employee.job?.title}</TableCell>
                                    <TableCell>{employee.dept?.title}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleRowClick(employee.employeeID)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(employee.employeeID)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection}
                            style={{marginBottom: '10px'}}>
                        Back to List
                    </Button>
                    <EmployeeForm
                        employeeID={selectedEmployeeID}
                        setSelectedEmployeeID={setSelectedEmployeeID}
                        clearSelection={clearSelection}
                        isCreating={isCreating} // Pass down create mode status
                    />
                </>
            )}
        </Container>
    );
};

export default EmployeeList;
