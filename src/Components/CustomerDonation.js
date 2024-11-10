import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const CustomerDonation = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [message, setMessage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`/customer/user/${auth.userId}`);
                setCustomerID(response.data.customerID);
            } catch (error) {
                console.error('Error fetching customerID:', error);
            }
        };
        fetchCustomer();
    }, [auth]);

    const handleDonateClick = async (e) => {
        e.preventDefault();

        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            setSnackbarMessage('Please enter a valid donation amount.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const today = new Date();

            // Create a new sale record for the donation
            const saleResponse = await axios.post('/sale', {
                totalPrice: donationAmount,
                createdBy: 'online user',
                updatedBy: 'online user',
                employeeID: '163' // Placeholder 
            });

            const saleID = saleResponse.data.saleID;

            // Record the transaction
            await axios.post('/saleTransaction', {
                customerID: customerID,
                transactionAmount: donationAmount,
                paymentMethod: 'Credit Card',
                transactionDate: today,
                saleID: saleID,
                createdBy: 'online user',
                updatedBy: 'online user'
            });

            setSnackbarMessage(`Thank you for your donation of $${donationAmount}!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setDonationAmount('');
        } catch (error) {
            console.error("Error submitting donation:", error);
            setSnackbarMessage('An error occurred while processing your donation.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4} mb={2} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Make a Donation
                </Typography>
                <Typography variant="h6" color="textSecondary" paragraph>
                    Your contribution helps support the museum. Thank you!
                </Typography>
            </Box>

            <Box mb={3}>
                <TextField
                    label="Donation Amount"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                        },
                        '& .MuiInputBase-input': {
                            color: '#000', // Change the text (number) color to black
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '#333', // Change placeholder color to gray for visibility
                        },
                        '& .MuiFormLabel-root': {
                            color: '#333', // Change label color to dark gray
                        },
                    }}
                    placeholder="Enter donation amount"
                />
            </Box>

            <Box display="flex" justifyContent="center" mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDonateClick}
                    sx={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                >
                    Donate Now
                </Button>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerDonation;
