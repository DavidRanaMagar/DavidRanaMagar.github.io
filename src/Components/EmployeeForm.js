import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Grid2, MenuItem, InputLabel, FormControl} from '@mui/material';
import axios from 'axios';

const EmployeeForm = ({employeeID, setSelectedEmployeeID}) => {
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        hireDate: '',
        jobTitle: '',
        salary: '',
        phoneNumber: '',
        email: '',
        department: '',
        gender: '',
        employeeAddress: {
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const [jobTitles, setJobTitles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobResponse, deptResponse, genderResponse] = await Promise.all([
                    axios.get('/jobTitle'),
                    axios.get('/department'),
                    axios.get('/sex')
                ]);

                setJobTitles(jobResponse.data);
                setDepartments(deptResponse.data);
                setGenders(genderResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (employeeID) {
                try {
                    const response = await axios.get(`/employee/${employeeID}`);
                    console.log('employee info', response.data);
                    setEmployee({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        dateOfBirth: response.data.dateOfBirth,
                        hireDate: response.data.hireDate,
                        jobTitle: response.data.jobTitle,
                        salary: response.data.salary,
                        phoneNumber: response.data.phoneNumber,
                        email: response.data.email,
                        department: response.data.department,
                        gender: response.data.gender,
                        employeeAddress: {
                            streetAddress: response.data.employeeAddress.streetAddress,
                            city: response.data.employeeAddress.city,
                            state: response.data.employeeAddress.state,
                            postalCode: response.data.employeeAddress.postalCode,
                            country: response.data.employeeAddress.country,
                        }
                    });
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                }
            } else {
                setEmployee({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    hireDate: '',
                    jobTitle: '',
                    salary: '',
                    phoneNumber: '',
                    email: '',
                    department: '',
                    gender: '',
                    employeeAddress: {
                        streetAddress: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                    }
                });
            }
        };

        fetchEmployeeData();
    }, [employeeID]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name in employee.employeeAddress) {
            setEmployee(prev => ({
                ...prev,
                employeeAddress: {...prev.employeeAddress, [name]: value}
            }));
        } else {
            setEmployee({...employee, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (employeeID) {
                await axios.put(`/employee/${employeeID}`, employee);
                alert('Employee updated successfully!');
            } else {
                await axios.post('/employee', employee);
                alert('Employee created successfully!');
            }
            setSelectedEmployeeID(null);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {employeeID ? 'Edit Employee' : 'Employee Form'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={employee.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={employee.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="Date of Birth" shrink>
                                Date of Birth
                            </InputLabel>
                            <TextField
                                id="Date of Birth"
                                name="Date of Birth"
                                type="date"
                                value={employee.dateOfBirth}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 item size={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="Hire Date" shrink>
                                Hire Date
                            </InputLabel>
                            <TextField
                                id="Hire Date"
                                name="Hire Date"
                                type="date"
                                value={employee.hireDate}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            select
                            label="Gender"
                            name="gender"
                            value={employee.gender}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {genders.map((g) => (
                                <MenuItem key={g.sexCode} value={g.sexCode}>
                                    {g.sex}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                </Grid2>

                <Typography variant="h6" gutterBottom sx={{mt: 2}}>Contact Information</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={employee.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={employee.email}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid2>
                </Grid2>

                <Typography variant="h6" gutterBottom sx={{mt: 2}}>Address</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item size={12}>
                        <TextField
                            label="Street Address"
                            name="streetAddress"
                            value={employee.employeeAddress.streetAddress}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="City"
                            name="city"
                            value={employee.employeeAddress.city}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="State"
                            name="state"
                            value={employee.employeeAddress.state}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Postal Code"
                            name="postalCode"
                            value={employee.employeeAddress.postalCode}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Country"
                            name="country"
                            value={employee.employeeAddress.country}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                </Grid2>

                <Typography variant="h6" gutterBottom sx={{mt: 2}}>Job Details</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                        <TextField
                            select
                            label="Job Title"
                            name="jobTitle"
                            value={employee.jobTitle}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        >
                            {jobTitles.map((job) => (
                                <MenuItem key={job.jobTitleID} value={job.jobTitleID}>
                                    {job.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Salary"
                            name="salary"
                            value={employee.salary}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            select
                            label="Department"
                            name="department"
                            value={employee.department}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.departmentID} value={dept.departmentID}>
                                    {dept.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                </Grid2>

                <Button variant="contained" color="primary" type="submit" sx={{mt: 3}}>
                    {employeeID ? 'Update Employee' : 'Create Employee'}
                </Button>
            </form>
        </Container>
    );
};

export default EmployeeForm;
