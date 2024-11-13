import React, { useState } from 'react';
import { Button, Typography, Container, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Grid2 } from '@mui/material';
import axios from '../api/axios';

const DonationsReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [donations, setDonations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(null);

    const defaultStartDate = new Date(1900, 0, 1); // January 1, 1900
    const defaultEndDate = new Date(2999, 11, 31); // December 31, 2999

    const fetchDonation = async () => {
        try {
            const response = await axios.get('/donation');
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations.', error);
        }
    };

    const generateReportByDates = async (startDate, endDate) => {
        // Check if startDate or endDate is empty, then use defaults
        const start = startDate ? new Date(startDate) : defaultStartDate;
        const end = endDate ? new Date(endDate) : defaultEndDate;

        if (start > end) {
            alert('Please choose a valid date range.');
            return;
        }

        try {
            const response = await axios.post('/donation/dateRange', { 
                startDate: start, 
                endDate: end 
            });
            setDonations(response.data);

            const total = response.data.reduce(
                (sum, donation) => sum + donation.donation, 0
            );
            setTotalAmount(total);
            console.log('Total Amount:', total);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const handleGenerateClick = () => {
        generateReportByDates(startDate, endDate);
    };

    // Reset total amount when date range changes
    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
        setTotalAmount(null);
    };

    return (
        <Container maxWidth="md">
            <Grid2 >
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <TextField
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={handleDateChange(setStartDate)}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={handleDateChange(setEndDate)}
                    />
                </Box>
            </Grid2>

            <Button variant="contained" onClick={handleGenerateClick}>
                Generate Report
            </Button>

            {totalAmount !== null && (
                <Typography variant="h4" gutterBottom sx={{ whiteSpace: 'pre-line' }}>
                    {'\n'}  
                    Total Donation Amount: ${totalAmount}
                    {'\n'}
                    {'\n'}
                    <Typography variant= "h4" sx={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
                    -- Donations List --
                    </Typography>
                    
                </Typography>
            )}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tickets">
                    <TableHead>
                        <TableRow>
                            <TableCell>Donations ID</TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Donation Date</TableCell>
                            <TableCell>Donation Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donations.map(donation => (
                            <TableRow key={donation.donationID}>
                                <TableCell>{donation.donationID}</TableCell>
                                <TableCell>{donation.customerID}</TableCell>
                                <TableCell>{donation.donationDate}</TableCell>
                                <TableCell>${donation.donation}</TableCell> 
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DonationsReport;
