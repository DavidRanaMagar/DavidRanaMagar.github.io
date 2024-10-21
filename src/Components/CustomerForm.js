import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, MenuItem } from '@mui/material';
import axios from 'axios';

const CustomerForm = ({ customerID, setSelectedCustomerID }) => {
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        sex: '',
        creditCardNumber: '',
        expiryDate: '',
        cvv: '',
        customerAddress: { // Nest the address object
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });
    const [sexOptions, setSexOptions] = useState([]);

    // Fetch sex options from the server
    useEffect(() => {
        const fetchSexOptions = async () => {
            try {
                const response = await axios.get('/sex');
                setSexOptions(response.data);
            } catch (error) {
                console.error('Error fetching sex options:', error);
            }
        };

        fetchSexOptions();
    }, []);

    // Fetch customer data if customerID is provided
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (customerID) {
                try {
                    const response = await axios.get(`/customer/${customerID}`);
                    setCustomer({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        phone: response.data.phone,
                        dob: response.data.dob,
                        sex: response.data.sex.gender.sexCode, // Assuming sexCode is in the gender object
                        creditCardNumber: response.data.creditCardNumber,
                        expiryDate: response.data.expiryDate,
                        cvv: response.data.cvv,
                        customerAddress: {
                            streetAddress: response.data.customerAddress.streetAddress,
                            city: response.data.customerAddress.city,
                            state: response.data.customerAddress.state,
                            postalCode: response.data.customerAddress.postalCode,
                            country: response.data.customerAddress.country,
                        }
                    });
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                }
            } else {
                // Reset form for new customer
                setCustomer({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    dob: '',
                    sex: '',
                    creditCardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    customerAddress: {
                        streetAddress: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                    }
                });
            }
        };

        fetchCustomerData();
    }, [customerID]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in customer.customerAddress) {
            // If the input is related to the customer address, update the address object
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                customerAddress: {
                    ...prevCustomer.customerAddress,
                    [name]: value
                }
            }));
        } else {
            // Otherwise, update the main customer object
            setCustomer({ ...customer, [name]: value });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...customer,
                // Ensure customerAddress is in the right format when sending
                customerAddress: customer.customerAddress 
            };

            if (customerID) {
                // Update existing customer
                await axios.put(`/customer/${customerID}`, dataToSend);
                alert('Customer updated successfully!');
            } else {
                // Create new customer
                await axios.post('/customer', dataToSend);
                alert('Customer created successfully!');
            }
            setSelectedCustomerID(null); // Reset selected customer
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Failed to save customer');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {customerID ? 'Edit Customer' : 'Customer Form'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Customer Details */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={customer.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={customer.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={customer.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={customer.phone}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={customer.dob}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Sex"
                            name="sex"
                            value={customer.sex}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        >
                            {sexOptions.map((option) => (
                                <MenuItem key={option.sexCode} value={option.sexCode}>
                                    {option.sex}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Address Fields */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Address</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Street Address"
                            name="streetAddress"
                            value={customer.customerAddress.streetAddress}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            name="city"
                            value={customer.customerAddress.city}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="State"
                            name="state"
                            value={customer.customerAddress.state}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Postal Code"
                            name="postalCode"
                            value={customer.customerAddress.postalCode}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Country"
                            name="country"
                            value={customer.customerAddress.country}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>

                    {/* Credit Card Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Payment Details</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Credit Card Number"
                            name="creditCardNumber"
                            value={customer.creditCardNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Expiry Date"
                            name="expiryDate"
                            type="month"
                            value={customer.expiryDate}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={customer.cvv}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                    {customerID ? 'Update Customer' : 'Submit'}
                </Button>
            </form>
        </Container>
    );
};

export default CustomerForm;
