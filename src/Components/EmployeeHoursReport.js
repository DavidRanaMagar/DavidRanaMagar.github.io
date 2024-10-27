import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const EmployeeHoursReport = () => {
    const [employeeHours, setEmployeeHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeHours = async () => {
            try {
                const response = await axios.get('/employeeHours/40'); // Adjust the URL to match your backend endpoint
                setEmployeeHours(response.data);
            } catch (error) {
                setError('Failed to fetch employee hours data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeHours();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

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
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h6" style={{ padding: '16px' }}>Employee Hours Report</Typography>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Work Date</TableCell>
                                <TableCell>Hours Worked</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeHours.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{record.employeeID}</TableCell>
                                    <TableCell>{record.workDate}</TableCell>
                                    <TableCell>{record.hoursWorked}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Paper style={{ padding: '16px' }}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>Hours Worked Over Time</Typography>
                    <Line data={chartData} options={chartOptions} />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default EmployeeHoursReport;
