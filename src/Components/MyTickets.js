import {
    Box,
    Container,
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
    const [tickets, setTickets] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);

    // Log userID to ensure it's being passed correctly
    useEffect(() => {
        console.log('userID:', userID);
    }, [userID]);

    // Fetch tickets and ticket statuses on component mount
    useEffect(() => {
        if (!userID) {
            console.log('No userID provided');
            return; // Exit early if no userID
        }

        const fetchTickets = async () => {
            try {
                const response = await axios.get('/ticket');
                console.log('Fetched Tickets:', response.data);
                setTickets(response.data); // Assuming the tickets data structure is correct
            } catch (error) {
                console.error('Error fetching tickets.', error);
            }
        };

        const fetchTicketStatuses = async () => {
            try {
                const response = await axios.get('/ticketStatus');
                console.log('Fetched Ticket Statuses:', response.data);
                setTicketStatuses(response.data); // Assuming this has ticketStatusCode and ticketStatus
            } catch (error) {
                console.error('Error fetching ticket statuses.', error);
            }
        };

        fetchTickets();
        fetchTicketStatuses();
    }, [userID]); // Ensure effect runs only when userID is available

    // Filter tickets when both tickets and userID are available
    useEffect(() => {
        if (!userID || tickets.length === 0) return;  // Exit early if userID or tickets are unavailable

        // Filter tickets by matching customerID
        const filtered = tickets.filter(ticket => {
            const ticketCustomerID = String(ticket.customerID).trim();
            const userCustomerID = String(userID).trim();
            return ticketCustomerID === userCustomerID;
        });

        console.log('Filtered Tickets:', filtered); // Log filtered tickets
        setFilteredTickets(filtered);
    }, [userID, tickets]); // Run whenever tickets or userID changes

    // Get the ticket status based on ticketStatusCode
    const getTicketStatus = (ticketStatusCode) => {
        const ticketStatus = ticketStatuses.find(status => status.ticketStatusCode === ticketStatusCode);
        return ticketStatus ? ticketStatus.ticketStatus : 'N/A';
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4">My Tickets</Typography>
                {filteredTickets.length === 0 ? (
                    <Typography variant="h6">No tickets found.</Typography>
                ) : (
                    <>
                        <Typography variant="h6">Found - {filteredTickets.length} tickets</Typography>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="tickets">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ticket ID</TableCell>
                                        <TableCell>Event Date</TableCell>
                                        <TableCell>Time Slot</TableCell>
                                        <TableCell>Ticket Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTickets.map(ticket => (
                                        <TableRow key={ticket.ticketID}>
                                            <TableCell>{ticket.ticketID}</TableCell>
                                            <TableCell>{ticket.eventDate}</TableCell>
                                            <TableCell>{ticket.timeSlot}</TableCell>
                                            <TableCell>{getTicketStatus(ticket.ticketStatus)}</TableCell>
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
