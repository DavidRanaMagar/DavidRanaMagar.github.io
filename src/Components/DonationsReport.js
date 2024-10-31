import React, { useState } from 'react';
import { Button, Typography, Container, TextField, Box } from '@mui/material';
import axios from '../api/axios';

const DonationsReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalAmount, setTotalAmount] = useState(null);

    const generateReportByDates = async (startDate, endDate) => {

        if (startDate > endDate) {
            alert('Please choose a valid date range.')
            return;
        }

        try {
            const response = await axios.post('/donation/dateRange', {
                startDate,
                endDate
            });
            const donations = response.data;

            const total = donations.reduce(
                (sum, donation) => sum + donation.donation, 0
            );

            setTotalAmount(total);

            console.log('Total Amount:', total);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const handleGenerateClick = () => {


        if (startDate && endDate) {
            generateReportByDates(new Date(startDate), new Date(endDate));
        } else {
            alert('Please select both start and end dates.');
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

export default DonationsReport;
