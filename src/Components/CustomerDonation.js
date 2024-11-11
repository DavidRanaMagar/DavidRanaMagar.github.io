import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const CustomerDonation = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
    const [isFocused, setIsFocused] = useState(false);

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

        if (!customerID) {
            console.log('No customer ID');
            return;
        }

        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            setSnackbarMessage('Please enter a valid donation amount.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const today = new Date();

            // create new transaction record and get transactionID
            const transactionResponse = await axios.post('/transaction', {
                customerID: customerID,
                transactionAmount: donationAmount,
                paymentMethod: 'Credit Card',
                transactionDate: today,
                createdBy: 'online user',
                updatedBy: 'online user'
            });

            const transactionID = transactionResponse.data.transactionID;

            // Create a new donation record with transactionID
            await axios.post('/donation', {
                customerID: customerID,
                transactionID: transactionID,
                donation: donationAmount,
                donationDate: today,
                createdBy: 'online user',
                updatedBy: 'online user',
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    InputLabelProps={{
                        style: {
                            display: isFocused || donationAmount ? 'none' : 'block',
                        },
                    }}
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
