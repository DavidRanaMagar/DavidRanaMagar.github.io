import React, { useState } from 'react';
import { Button, Typography, Container, TextField, Box } from '@mui/material';
import axios from '../api/axios';

const EarningsReport = () => {
    const [startDate, setStartDate] = useState(''); // State for start date
    const [endDate, setEndDate] = useState(''); // State for end date
    const [totalAmount, setTotalAmount] = useState(null); // Initially null for conditional rendering

    // New function that takes the start and end dates as input and fetches the corresponding transactions
    const generateReportByDates = async (startDate, endDate) => {
        try {
            const response = await axios.get('/transaction', {
                params: { startDate, endDate } // Assuming your API accepts date parameters
            });
            const transactions = response.data; // Assuming response.data is an array

            const total = transactions.reduce(
                (sum, transaction) => sum + transaction.transactionAmount, 0
            );

            setTotalAmount(total); // Set the total amount based on filtered transactions

            console.log('Total Amount:', total);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleGenerateClick = () => {
        if (startDate && endDate) {
            generateReportByDates(startDate, endDate);
        } else {
            console.error('Please select both start and end dates.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="space-between" mb={2}>
                {/* Start Date Picker */}
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                {/* End Date Picker */}
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Box>

            <Button variant="contained" onClick={handleGenerateClick}>
                Generate Report
            </Button>

            {totalAmount !== null && ( // Conditionally render total amount only after clicking the button
                <Typography variant="h4" gutterBottom>
                    Total Sales Amount from {startDate} to {endDate}: ${totalAmount}
                </Typography>
            )}
        </Container>
    );
};

export default EarningsReport;
