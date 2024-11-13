import {Button, Grid2, MenuItem, TextField, Typography, Container} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {

    const navigate = useNavigate();
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
        user: {
            username: '',
            password: '',
            role: 0, //default for customer role
            createdBy: 'new user',
            updatedBy: 'new user'
        },
        customerAddress: {
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in customer.customerAddress) {
            // If the input is related to the customer address, update the address object
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                customerAddress: { ...prevCustomer.customerAddress, [name]: value}
            }));
        } else if (name in customer.user) {
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                user: { ...prevCustomer.user, [name]: value }
            }));
        } else {
            // Otherwise, update the main customer object
            setCustomer({ ...customer, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/user/register', {
                username: customer.user.username,
            });

            if (response.data.userExists === "true") {
                alert('This username is already taken');
            } else {
                const dataToSend = {
                    ...customer,
                    customerAddress: customer.customerAddress, // Ensure right format
                    user: customer.user
                };

                await axios.post('/customer', dataToSend);
                alert('Account created successfully!');
                navigate('/login')
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Failed to create account');
        }
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>

                    {/* Customer User Credentials */}
                    <Grid2 item size={12}>
                        <Typography variant="h6">Account Credentials</Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Username"
                            name="username"
                            value={customer.user.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Password"
                            name="password"
                            value={customer.user.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>

                    {/* Customer Details */}
                    <Grid2 item size={12}>
                        <Typography variant="h6">Account Details</Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={customer.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={customer.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={customer.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid2>
                    <Grid2 item size={4}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={customer.phone}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid2>
                    <Grid2 item size={4}>
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={customer.dob}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={4}>
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
                            <MenuItem key={0} value={0}>
                                Male
                            </MenuItem>
                            <MenuItem key={1} value={1}>
                                Female
                            </MenuItem>
                            <MenuItem key={2} value={2}>
                                Non-Binary
                            </MenuItem>
                            <MenuItem key={3} value={3}>
                                Other
                            </MenuItem>
                            <MenuItem key={4} value={4}>
                                Prefer not to say
                            </MenuItem>
                        </TextField>
                    </Grid2>

                    {/* Address Fields */}
                    <Grid2 item size={12}>
                        <Typography variant="h6">Address</Typography>
                    </Grid2>
                    <Grid2 item size={12}>
                        <TextField
                            label="Street Address"
                            name="streetAddress"
                            value={customer.customerAddress.streetAddress}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={3}>
                        <TextField
                            label="City"
                            name="city"
                            value={customer.customerAddress.city}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={3}>
                        <TextField
                            label="State"
                            name="state"
                            value={customer.customerAddress.state}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={3}>
                        <TextField
                            label="Postal Code"
                            name="postalCode"
                            value={customer.customerAddress.postalCode}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={3}>
                        <TextField
                            label="Country"
                            name="country"
                            value={customer.customerAddress.country}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>

                    {/* Credit Card Details */}
                    <Grid2 item size={12}>
                        <Typography variant="h6">Payment Details</Typography>
                    </Grid2>
                    <Grid2 item size={4}>
                        <TextField
                            label="Credit Card Number"
                            name="creditCardNumber"
                            value={customer.creditCardNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={4}>
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
                    </Grid2>
                    <Grid2 item size={4}>
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={customer.cvv}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                </Grid2>
                <Button variant="contained" color="primary" type="submit" sx={{mt: 2}}>
                    Register
                </Button>
            </form>
        </Container>
    )
}

export default Register;