import {
    Box, Button,
    Container, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const MyTickets = ({ userID }) => {
    const [customerID, setCustomerID] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [refetchTrigger, setRefetchTrigger] = useState(false);

    // fetch types on mount, no dependants so it gets its own effect
    useEffect(() => {
        const fetchTicketStatuses = async () => {
            try {
                const response = await axios.get('/ticketStatus');

                setTicketStatuses(response.data); // Assuming this has ticketStatusCode and ticketStatus
            } catch (error) {
                console.error('Error fetching ticket statuses.', error);
            }
        };

        fetchTicketStatuses();
    }, []);

    // Fetch customer when userID updates / page mounts
    useEffect(() => {
        if (!userID) {
            console.log('No userID provided');
            return;
        }

        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`/customer/user/${userID}`);

                setCustomerID(response.data.customerID);
            } catch (error) {
                console.error('Error fetching customerID:', error);
            }
        };

        fetchCustomer();
    }, [userID]);

    // fetch tickets when customerID updates
    useEffect(() => {
        if (!customerID) {
            console.log('No customerID provided');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await axios.get(`/ticket/customer/${customerID}`);

                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets.', error);
            }
        };

        fetchTickets();
    }, [customerID, refetchTrigger]);

    // Get the ticket status based on ticketStatusCode
    const getTicketStatus = (ticketStatusCode) => {
        const ticketStatus = ticketStatuses.find(status => status.ticketStatusCode === ticketStatusCode);
        return ticketStatus ? ticketStatus.ticketStatus : 'N/A';
    };

    const handleRefund = async (ticketID) => {
        if (window.confirm('Are you sure you want to refund this?')) {
            try {
                await axios.put(`/ticket/${ticketID}/status`, {
                    ticketStatus: 4
                });

                alert('Your account has been refunded.');
                setRefetchTrigger(prev => !prev);
            } catch (error) {
                console.error('Error fetching tickets.', error);
            }
        }
    }

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4">My Tickets</Typography>
                {tickets.length === 0 ? (
                    <Typography variant="h6">No tickets found.</Typography>
                ) : (
                    <>
                        <Typography variant="h6">Found - {tickets.length} tickets</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="tickets">
                                <TableHead>
                                    <TableRow>
                                        <TableCell variant="h5">Ticket ID</TableCell>
                                        <TableCell variant="h5">Event</TableCell>
                                        <TableCell variant="h5">Event Date</TableCell>
                                        <TableCell variant="h5">Time Slot</TableCell>
                                        <TableCell variant="h5">Ticket Status</TableCell>
                                        <TableCell variant="h5">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tickets.map(ticket => (
                                        <TableRow key={ticket.ticketID}>
                                            <TableCell>{ticket.ticketID}</TableCell>
                                            <TableCell>{ticket.exhibition.title}</TableCell>
                                            <TableCell>{ticket.eventDate}</TableCell>
                                            <TableCell>{ticket.timeSlot}</TableCell>
                                            <TableCell>{getTicketStatus(ticket.ticketStatus)}</TableCell>
                                            <TableCell>
                                                {getTicketStatus(ticket.ticketStatus) === "Active" ? (
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => handleRefund(ticket.ticketID)}>
                                                        Refund
                                                    </Button>
                                                ) : (
                                                    <TableCell></TableCell>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default MyTickets;
