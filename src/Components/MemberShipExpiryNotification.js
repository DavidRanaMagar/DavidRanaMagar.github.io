import { Button, Grid, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";

const MembershipExpiryNotification = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [messages, setMessages] = useState([]); // Store messages as an array
    const [membershipID, setMembershipID] = useState(null);

    useEffect(() => {
        if (!auth.userId) {
            console.log('No userID provided');
            return;
        }

        const fetchCustomerAndMembership = async () => {
            try {
                // Fetch customer data
                const customerResponse = await axios.get(`/customer/user/${auth.userId}`);
                const customer = customerResponse.data;

                // Log customer data to check if it's correct
                console.log('Customer Data:', customer);

                setCustomerID(customer.customerID);
                setCustomerName(`${customer.firstName} ${customer.lastName}`);

                // Fetch membership expiry notification data
                const membershipResponse = await axios.get(`/membershipExpiryNotification/${customer.customerID}`);

                // Log the membership response to check its structure
                console.log('Membership Response:', membershipResponse.data);

                const membershipData = membershipResponse.data;

                // If multiple messages exist, set them in the state
                if (membershipData && Array.isArray(membershipData)) {
                    setMessages(membershipData.map(item => item.message)); // Extracting messages
                } else if (membershipData && membershipData.message) {
                    setMessages([membershipData.message]); // In case only one message exists
                } else {
                    console.log('No messages found in the membership data.');
                }

            } catch (error) {
                console.error('Error fetching customer or membership data:', error);
            }
        };

        fetchCustomerAndMembership();
    }, [auth]);

    // If customer data or messages are not available, display loading message
    if (!customerID && messages.length === 0) {
        return <Typography variant="h6">Loading membership details...</Typography>;
    } else if (messages.length === 0) {
        return <Typography variant="h6">No Membership Notifications</Typography>;
    }


    return (
        <Container maxWidth="md">
            <Typography variant="h4">Membership Status</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h6">Customer Name: {customerName}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {/* Display all messages from the membershipExpiryNotification table */}
                    {messages.map((message, index) => (
                        <Typography key={index} variant="body1" color="textSecondary">
                            <strong>Message {index + 1}:</strong> {message}
                        </Typography>
                    ))}
                </Grid>
                <Grid item xs={12}>
    <Button
        variant="contained"
        color="primary"
        component="a"
        href="/membershiprenewal"
    >
        Renew Membership
    </Button>
</Grid>
  
            </Grid>
        </Container>
    );
};

export default MembershipExpiryNotification;
