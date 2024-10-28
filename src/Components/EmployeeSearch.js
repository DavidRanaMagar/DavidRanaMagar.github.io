import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    Grid2,
} from '@mui/material';
import EmployeeHoursReport from "./EmployeeHoursReport";

const EmployeeSearch = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/employee/search', { params: searchParams });
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch employee data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Automatically fetch employees every time searchParams changes
    useEffect(() => {
        handleSearch();
    }, [searchParams]);

    const handleRowClick = (employeeID) => {
        setSelectedEmployeeID(employeeID); // Update selected employee ID
    };

    const clearSelection = () => {
        setSelectedEmployeeID(null); // Clear selection
    };

    return (
        <Container maxWidth="lg">
            {/* If an employee is selected, show the EmployeeHoursReport, else show the search form and results */}
            {selectedEmployeeID ? (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection} style={{ marginBottom: '10px' }}>
                        Back to Search
                    </Button>
                    <EmployeeHoursReport
                        employeeID={selectedEmployeeID}
                        clearSelection={clearSelection}
                    />
                </>
            ) : (
                <>
                    <Typography variant="h6" style={{ padding: '16px' }}>Search Employees</Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} sm={6} md={3}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                value={searchParams.firstName}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 xs={12} sm={6} md={3}>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                value={searchParams.lastName}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 xs={12} sm={6} md={3}>
                            <TextField
                                name="email"
                                label="Employee Email"
                                variant="outlined"
                                fullWidth
                                value={searchParams.email}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 xs={12} sm={6} md={3}>
                            <TextField
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                fullWidth
                                value={searchParams.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid2>
                        <Grid2 xs={12} container justifyContent="center">
                            <Button variant="contained" color="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2} style={{ marginTop: '20px' }}>
                        {loading && <Typography>Loading...</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography variant="h6">Employee ID</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Employee Name</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Employee Email</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Date of Birth</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.length > 0 ? (
                                        employees.map((employee) => (
                                            <TableRow key={employee.employeeID} hover onClick={() => handleRowClick(employee.employeeID)}>
                                                <TableCell>{employee.employeeID}</TableCell>
                                                <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>{employee.dateOfBirth}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No employees found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid2>
                </>
            )}
        </Container>
    );
};

export default EmployeeSearch;
