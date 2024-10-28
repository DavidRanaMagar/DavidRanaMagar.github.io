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
    Typography,
    Grid2,
    Divider,
    TextField,
    Button,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const EmployeeHoursReport = ({ employeeID }) => {
    const [employeeHours, setEmployeeHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        // Fetch employee hours on initial render
        fetchEmployeeHours();
    }, [employeeID]);

    // Function to fetch employee hours
    const fetchEmployeeHours = async () => {
        try {
            const response = await axios.get(`/employeeHours/${employeeID}`);
            setEmployeeHours(response.data);
        } catch (error) {
            setError('Failed to fetch employee hours data.');
        } finally {
            setLoading(false);
        }
    };

    // Function to search employee hours by date
    const handleSearch = async () => {
        try {
            const response = await axios.get('/employeeHours/search', {
                params: {
                    employeeID,
                    startDate,
                    endDate,
                },
            });
            setEmployeeHours(response.data); // Update state with search results
        } catch (error) {
            setError('Failed to fetch employee hours for the selected dates.');
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    // Extract employee details from the first record
    const employee = employeeHours.length > 0 ? employeeHours[0].employee : {};

    // Transform data for chart
    const dates = employeeHours.map(record => record.workDate);
    const hours = employeeHours.map(record => record.hoursWorked);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Hours Worked',
                data: hours,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Hours Worked',
                },
            },
        },
    };

    return (
        <Grid2 container spacing={4} size={12}>
            <Grid2 item size={12}>
                <Typography variant="h6" style={{ padding: '16px' }}>Employee Hours Report</Typography>
            </Grid2>
            <Grid2 item size={12}>
                <TextField
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: '16px' }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    variant="outlined"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: '16px' }}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Grid2>
            <Grid2 item size={12}>
                <Typography variant="h6" gutterBottom>Employee Details</Typography>
                <Divider />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">First Name: </Typography> {employee.firstName} {employee.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Job Title: </Typography> {employee.jobTitle}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Email: </Typography> {employee.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Department: </Typography> {employee.department}</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Grid2>
            <Grid2 item size={12}>
                <Typography variant="h6" gutterBottom>Employee Hours</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Work Date</TableCell>
                                <TableCell>Hours Worked</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeHours.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{record.workDate}</TableCell>
                                    <TableCell>{record.hoursWorked}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
            <Grid2 item size={12}>
                <Paper style={{ padding: '16px' }}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>Hours Worked Over Time</Typography>
                    <Line data={chartData} options={chartOptions} />
                </Paper>
            </Grid2>
        </Grid2>
    );
};

export default EmployeeHoursReport;
