import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Container,
    TextField,
    Button,
    Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { format } from 'date-fns';

const MembershipRenewal = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const [membershipTypes, setMembershipTypes] = useState({}); 
    const [renewalDurations, setRenewalDurations] = useState({}); 
    const [individualCosts, setIndividualCosts] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`/customer/user/${auth.userId}`);
                const customerId = response.data.customerID;
                setCustomerID(customerId);
            } catch (error) {
                console.error('Error fetching customerID:', error);
            }
        };

        if (auth.userId) {
            fetchCustomer();
        }
    }, [auth]);

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await axios.get(`/membership/customer/${customerID}`);
                setMemberships(response.data);
            } catch (error) {
                console.error('Error fetching memberships:', error);
            }
        };

        if (customerID) {
            fetchMemberships();
        }
    }, [customerID, refreshTrigger]);

    useEffect(() => {
        const fetchMembershipTypes = async () => {
            try {
                const response = await axios.get(`/membershipType`);
                const types = response.data.reduce((acc, type) => {
                    acc[type.membershipTypeCode] = type.membershipType;
                    return acc;
                }, {});
                setMembershipTypes(types);
            } catch (error) {
                console.error('Error fetching membership types:', error);
            }
        };

        fetchMembershipTypes();
    }, []);

    const handleRenewalDurationChange = (membershipID, value) => {
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setRenewalDurations((prev) => ({
                ...prev,
                [membershipID]: parsedValue,
            }));
        }
    };

    const membershipRates = {
        1: 50,  
        2: 90,  
        3: 30,  
        4: 45,  
        5: 125,
        6: 45   
    };

    const calculateTotalCost = (membershipType, numOfMonths) => {
        const rate = membershipRates[membershipType] || 0;
        const monthlyRate = Math.ceil(rate / 7); // Calculate per month rate based on the original rate
        return monthlyRate * numOfMonths; // Total cost for the given membership type and months
    };

    useEffect(() => {
        memberships.forEach((membership) => {
            const duration = renewalDurations[membership.membershipID] || 0;
            const cost = calculateTotalCost(membership.membershipType, duration);
            setIndividualCosts((prev) => ({
                ...prev,
                [membership.membershipID]: cost,
            }));
        });
    }, [renewalDurations, memberships]);

    const calculateNewEndDate = (currentEndDate, duration) => {
        const endDate = new Date(currentEndDate);
        if (isNaN(endDate.getTime())) {
            console.error('Invalid currentEndDate:', currentEndDate);
            return '';
        }

        const hours = endDate.getHours();
        const minutes = endDate.getMinutes();
        const seconds = endDate.getSeconds();
        const milliseconds = endDate.getMilliseconds();

        endDate.setHours(0, 0, 0, 0);
        endDate.setMonth(endDate.getMonth() + duration); // Add months to the current end date
        endDate.setHours(hours, minutes, seconds, milliseconds);

        return endDate.toISOString();
    };

    const handleRenewal = async (membershipID, currentEndDate) => {
        const duration = renewalDurations[membershipID];
        if (!duration || duration <= 0) {
            alert('Please select a valid positive renewal duration.');
            return;
        }

        const endDate = calculateNewEndDate(currentEndDate, duration);
        const renewDate = endDate;
        try {
            const response = await axios.put(`/membership/${membershipID}/renew`, {
                renewDate,
                endDate,
            });
            alert('Membership renewed successfully!');
        } catch (error) {
            console.error('Error renewing membership:', error);
            alert('Failed to renew membership.');
        }
        setRefreshTrigger(!refreshTrigger);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom align="center">
                Membership Renewal
            </Typography>
            <Typography variant="h6" gutterBottom>
                Current Memberships
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Membership ID</TableCell>
                        <TableCell>Membership Type</TableCell>
                        <TableCell>Rate (per month)</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Renewal Duration (Months)</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {memberships.map((membership) => (
                        <TableRow key={membership.membershipID}>
                            <TableCell>{membership.membershipID}</TableCell>
                            <TableCell>
                                {membershipTypes[membership.membershipType] || 'Unknown'}
                            </TableCell>
                            <TableCell>${Math.ceil(membershipRates[membership.membershipType] / 7) || 'N/A'}</TableCell>
                            <TableCell>{membership.startDate ? format(new Date(membership.startDate), 'yyyy-MM-dd') : ''}</TableCell>
                            <TableCell>{membership.endDate ? format(new Date(membership.endDate), 'yyyy-MM-dd') : ''}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={renewalDurations[membership.membershipID] || ''}
                                    onChange={(e) =>
                                        handleRenewalDurationChange(membership.membershipID, e.target.value)
                                    }
                                    placeholder="Months"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    sx={{ width: 120 }}
                                />
                            </TableCell>
                            <TableCell>
                                ${individualCosts[membership.membershipID] || 0}
                            </TableCell>
                            <TableCell>
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleRenewal(membership.membershipID, membership.endDate)}
                                        sx={{ marginTop: 1 }}
                                    >
                                        Renew
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default MembershipRenewal;
