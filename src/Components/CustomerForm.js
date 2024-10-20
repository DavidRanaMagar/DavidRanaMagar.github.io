import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, MenuItem } from '@mui/material';
import axios from 'axios';

const CustomerForm = () => {
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
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [sexOptions, setSexOptions] = useState([]);

    useEffect(() => {
        const fetchSexOptions = async () => {
            try {
                const response = await axios.get('http://3.94.130.218:3001/sex');
                setSexOptions(response.data);
            } catch (error) {
                console.error('Error fetching sex options:', error);
            }
        };

        fetchSexOptions();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://3.94.130.218:3001/customer', customer);
            alert('Customer created successfully!');
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Failed to create customer');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Customer Form
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
                            value={customer.streetAddress}
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
                            value={customer.city}
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
                            value={customer.state}
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
                            value={customer.postalCode}
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
                            value={customer.country}
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
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default CustomerForm;
