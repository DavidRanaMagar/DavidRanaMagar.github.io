import {
    Box,
    Button, Checkbox,
    Container, Grid2,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const TicketsReport = () => {

    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [eventDateRange, setEventDateRange] = useState(['', '']);
    const [purchaseDateRange, setPurchaseDateRange] = useState(['', '']);
    const [timeSlotRange, setTimeSlotRange] = useState(['', '']);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState(new Set());
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [selectedTicketStatuses, setSelectedTicketStatuses] = useState(new Set());


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('/ticket');
                setTickets(response.data);
                setFilteredTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets.', error);
            }
        }

        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get('/ticketType');
                setTicketTypes(response.data);

                setSelectedTicketTypes(response.data.reduce((acc, type) => {
                    acc.add(type.ticketTypeCode);
                    return acc;
                }, new Set()));
            } catch (error) {
                console.error('Error fetching ticket types.', error);
            }
        }

        const fetchTicketStatuses = async () => {
            try {
                const response = await axios.get('/ticketStatus');
                setTicketStatuses(response.data);

                setSelectedTicketStatuses(response.data.reduce((acc, status) => {
                    acc.add(status.ticketStatusCode);
                    return acc;
                }, new Set()));
            } catch (error) {
                console.error('Error fetching ticket Statuses.', error);
            }
        }

        fetchTickets();
        fetchTicketTypes();
        fetchTicketStatuses();

    }, []);

    //uses Date object to store times for time comparisons
    const timeStringToDate = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const handleTypeCheckboxChange = (ticketTypeCode) => {
        setSelectedTicketTypes((prev) => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(ticketTypeCode)) {
                updatedSet.delete(ticketTypeCode);
            } else {
                updatedSet.add(ticketTypeCode);
            }
            return updatedSet;
        });
    };

    const handleStatusCheckboxChange = (StatusCode) => {
        setSelectedTicketStatuses((prev) => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(StatusCode)) {
                updatedSet.delete(StatusCode);
            } else {
                updatedSet.add(StatusCode);
            }
            return updatedSet;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        const eventDateLower = new Date(eventDateRange[0]);
        const eventDateUpper = new Date(eventDateRange[1]);
        const purchaseDateLower = new Date(purchaseDateRange[0]);
        const purchaseDateUpper = new Date(purchaseDateRange[1]);
        const timeSlotLower = timeStringToDate(timeSlotRange[0]).getTime();
        const timeSlotUpper = timeStringToDate(timeSlotRange[1]).getTime();

        console.log({selectedTicketTypes, selectedTicketStatuses})

        const filtered = tickets.filter(ticket => {
            const eventDate = new Date(ticket.eventDate);
            const purchaseDate = new Date(ticket.purchaseDate);
            const ticketTime = timeStringToDate(ticket.timeSlot).getTime();

            // isNaN's allow invalid dates to be ignored
            const isEventDateInRange =
                (eventDate >= eventDateLower || isNaN(eventDateLower.getTime())) &&
                (eventDate <= eventDateUpper || isNaN(eventDateUpper.getTime()));
            const isPurchaseDateInRange =
                (purchaseDate >= purchaseDateLower || isNaN(purchaseDateLower.getTime())) &&
                (purchaseDate <= purchaseDateUpper || isNaN(purchaseDateUpper.getTime()));
            const isTimeSlotInRange =
                (ticketTime >= timeSlotLower || isNaN(timeSlotLower)) &&
                (ticketTime >= timeSlotUpper || isNaN(timeSlotUpper));


            const isTypeSelected = selectedTicketTypes.has(ticket.ticketType);
            const isStatusSelected = selectedTicketStatuses.has(ticket.ticketStatus);

            return isEventDateInRange && isPurchaseDateInRange && isTimeSlotInRange && isTypeSelected && isStatusSelected;
        });


        // Set the filtered tickets state
        setFilteredTickets(filtered);
    }

    return (
        <Container maxWidth="md">
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Box mb={0} mt={4}>
                        <Typography variant="h4" gutterBottom>
                            Ticket Filters
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <Grid2 container spacing={4}>
                            <Grid2 size={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Apply Filters
                                </Button>
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    label="Event Date After:"
                                    InputLabelProps={{ shrink: true }}
                                    value={eventDateRange[0]}
                                    onChange={(e) =>
                                        setEventDateRange((prev) => [
                                            e.target.value,
                                            prev[1],
                                        ])}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    label="Event Date Before:"
                                    InputLabelProps={{ shrink: true }}
                                    value={eventDateRange[1]}
                                    onChange={(e) =>
                                        setEventDateRange((prev) => [
                                            prev[0],
                                            e.target.value,
                                        ])}
                                    fullWidth
                                />
                            </Grid2>

                            <Grid2 size={3}>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    label="Purchase Date After:"
                                    InputLabelProps={{ shrink: true }}
                                    value={purchaseDateRange[0]}
                                    onChange={(e) =>
                                        setPurchaseDateRange((prev) => [
                                            e.target.value,
                                            prev[1]
                                        ])}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    label="Purchase Date Before:"
                                    InputLabelProps={{ shrink: true }}
                                    value={purchaseDateRange[1]}
                                    onChange={(e) =>
                                        setPurchaseDateRange((prev) => [
                                            prev[0],
                                            e.target.value,
                                        ])}
                                    fullWidth
                                />
                            </Grid2>

                            <Grid2 size={3}>
                                <TextField
                                    type="time"
                                    variant="outlined"
                                    label="Time Slot Before:"
                                    InputLabelProps={{ shrink: true }}
                                    value={timeSlotRange[0]}
                                    onChange={(e) =>
                                        setTimeSlotRange((prev) => [
                                            e.target.value,
                                            prev[1],
                                        ])}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    type="time"
                                    variant="outlined"
                                    label="Time Slot Before:"
                                    InputLabelProps={{ shrink: true }}
                                    value={timeSlotRange[1]}
                                    onChange={(e) =>
                                        setTimeSlotRange((prev) => [
                                            prev[0],
                                            e.target.value
                                        ])}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 container size={3} spacing={1}>
                                {ticketTypes.map((ticketType) => (
                                    <React.Fragment key={ticketType.ticketTypeCode}>
                                        <Grid2 size={3}>
                                            <Checkbox
                                                checked={selectedTicketTypes.has(ticketType.ticketTypeCode)}
                                                onChange={() => handleTypeCheckboxChange(ticketType.ticketTypeCode)}
                                            />
                                        </Grid2>
                                        <Grid2 container alignItems="center" size={9}>
                                            <Typography variant="body1">{ticketType.ticketType}</Typography>
                                        </Grid2>
                                    </React.Fragment>
                                ))}
                            </Grid2>
                            <Grid2 container size={3} spacing={1}>
                                {ticketStatuses.map((ticketStatus) => (
                                    <React.Fragment key={ticketStatus.ticketStatusCode}>
                                        <Grid2 container alignItems="center" size={3}>
                                            <Checkbox
                                                checked={selectedTicketStatuses.has(ticketStatus.ticketStatusCode)}
                                                onChange={() => handleStatusCheckboxChange(ticketStatus.ticketStatusCode)}
                                            />
                                        </Grid2>
                                        <Grid2 container alignItems="center" size={9}>
                                            <Typography variant="body1">{ticketStatus.ticketStatus}</Typography>
                                        </Grid2>
                                    </React.Fragment>
                                ))}
                            </Grid2>
                        </Grid2>
                    </form>
                </Grid2>
                <Grid2 size={12}>
                    <Box mb={4} mt={4}>
                        <Typography variant="h4" gutterBottom>
                            Tickets - {filteredTickets.length}
                        </Typography>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="tickets">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticket Id</TableCell>
                                    <TableCell>Customer Id</TableCell>
                                    <TableCell>Ticket Type</TableCell>
                                    <TableCell>Purchase Date</TableCell>
                                    <TableCell>Event Date</TableCell>
                                    <TableCell>Time Slot</TableCell>
                                    <TableCell>Ticket Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.ticketID}>
                                        <TableCell>{ticket.ticketID}</TableCell>
                                        <TableCell>{ticket.customerID}</TableCell>
                                        <TableCell>{ticket.ticketType}</TableCell>
                                        <TableCell>{ticket.purchaseDate}</TableCell>
                                        <TableCell>{ticket.eventDate}</TableCell>
                                        <TableCell>{ticket.timeSlot}</TableCell>
                                        <TableCell>{ticket.ticketStatus}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default TicketsReport;