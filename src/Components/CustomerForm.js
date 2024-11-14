
import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Grid2, MenuItem} from '@mui/material';
import axios from '../api/axios';

const CustomerForm = ({customerID, setSelectedCustomerID}) => {
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        sex: '',
    });

    // Fetch customer data if customerID is provided
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (customerID) {
                try {
                    const response = await axios.get(`/customer/${customerID}`);
                    setCustomer({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        email: response.data.email || '',
                        phone: response.data.phone || '',
                        dob: response.data.dob || '',
                        sex: response.data.sex || '',
                    });
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                }
            } else {
                setCustomer({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    dob: '',
                    sex: '',
                });
            }
        };
        fetchCustomerData();
    }, [customerID]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCustomer({...customer, [name]: value});
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...customer,
            };

            if (customerID) {
                // Update existing customer
                await axios.put(`/customer/${customerID}`, dataToSend);
                alert('Customer updated successfully!');
            } else {
                // Create new customer
                await axios.post('/customer/naUser', dataToSend);
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
                <Grid2 container spacing={2}>
                    {/* Customer Details */}
                    <Grid2 size={6}>
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
                    <Grid2 size={6}>
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
                    <Grid2 size={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={customer.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={customer.phone}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={customer.dob}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            select
                            label="Sex"
                            name="sex"
                            value={customer.sex}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            <MenuItem key={5} value={5}>
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
                </Grid2>
                <Button variant="contained" color="primary" type="submit" sx={{mt: 2}}>
                    {customerID ? 'Update Customer' : 'Create Customer'}
                </Button>
            </form>
        </Container>
    );
};

export default CustomerForm;