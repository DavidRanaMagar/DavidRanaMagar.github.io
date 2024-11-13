import { Button, Grid, MenuItem, TextField, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";

const MembershipSignup = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [membershipType, setMembershipType] = useState('');
    const [membershipLength, setMembershipLength] = useState('');
    const [membershipTypes, setMembershipTypes] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    // Example rates: The yearly rate is set here.
    const membershipRates = {
        1: 50,  // Individual
        2: 90,  // Family
        3: 30,  // Student
        4: 45,  // Senior
        5: 125, // Patron
        6: 45   // Military
    };

    useEffect(() => {
        if (!auth.userId) {
            console.log('No userID provided');
            return;
        }

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

    useEffect(() => {
        const fetchMembershipTypes = async () => {
            try {
                const response = await axios.get(`/membershipType`);
                setMembershipTypes(response.data);
            } catch (error) {
                console.error('Error fetching membership types:', error);
            }
        };

        fetchMembershipTypes();
    }, []);

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const calculateEndDate = (startDate, length) => {
        const endDate = new Date(startDate);
        if (length === 'Year') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        return formatDate(endDate);
    };

    // Calculate the total cost based on monthly or yearly rates
    const calculateTotalCost = () => {
        const rate = membershipRates[membershipType] || 0;
        if (membershipLength === 'Year') {
            // For yearly, we multiply the rate by 1
            setTotalCost(rate * 1);
        } else {
            // For monthly, we divide the rate by 12 and round up
            const monthlyRate = Math.ceil(rate / 12) +20;
            setTotalCost(monthlyRate);
        }
    };

    useEffect(() => {
        if (membershipType && membershipLength) {
            calculateTotalCost();
        }
    }, [membershipType, membershipLength]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!customerID) {
            console.log('No customerID provided');
            return;
        }

        const startDate = formatDate(new Date());
        const endDate = calculateEndDate(new Date(startDate), membershipLength);

        const dataToSend = {
            customerID: customerID || '',
            membershipType: membershipType,
            rate: totalCost,
            startDate: startDate,
            endDate: endDate,
            renewalDate: endDate,  // assuming renewal on the end date
            createdBy: 'online user',
            updatedBy: 'online user'
        };

        console.log(dataToSend);

        try {
            await axios.post('/membership', dataToSend);
            alert('Sign Up Successful');
        } catch (error) {
            console.error('Error Signing Up:', error);
            alert('Failed to Sign Up');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4">Membership Signup</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Type"
                            value={membershipType}
                            onChange={(e) => setMembershipType(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        >
                            {membershipTypes.map((type) => (
                                <MenuItem key={type.membershipTypeCode} value={type.membershipTypeCode}>
                                    {type.membershipType}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Length"
                            value={membershipLength}
                            onChange={(e) => setMembershipLength(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="Month">Month</MenuItem>
                            <MenuItem value="Year">Year</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Total Cost: ${totalCost}
                        </Typography>
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                    Sign Up
                </Button>
            </form>
        </Container>
    );
};

export default MembershipSignup;
