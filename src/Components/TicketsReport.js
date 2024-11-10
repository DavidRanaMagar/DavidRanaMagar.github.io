import {
    Box,
    Button, Checkbox,
    Container, Grid2, MenuItem,
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
    const [aggregates, setAggregates] = useState([]);

    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [selectedTicketStatuses, setSelectedTicketStatuses] = useState([]);

    const [eventDateRange, setEventDateRange] = useState(['', '']);
    const [purchaseDateRange, setPurchaseDateRange] = useState(['', '']);
    const [timeSlotRange, setTimeSlotRange] = useState(['', '']);
    const [periodType, setPeriodType] = useState('');
    const [displayedPeriodType, setDisplayedPeriodType] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('/ticket');

                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets.', error);
            }
        };

        const fetchTicketStatuses = async () => {
            try {
                const response = await axios.get('/ticketStatus');

                setTicketStatuses(response.data);
            } catch (error) {
                console.error('Error fetching ticket Statuses.', error);
            }
        }

        const fectchTicketTypes = async () => {
            try {
                const ticketTypeResponse = await axios.get('/ticketType');

                setTicketTypes(ticketTypeResponse.data);
            } catch (error) {
                console.error('Error fetching sales or ticket data.', error);
            }
        };

        fetchTickets();
        fetchTicketStatuses();
        fectchTicketTypes();
    }, []);


    const getTicketPrice = (ticketTypeCode) => {
        const ticketType = ticketTypes.find((type) => type.ticketTypeCode === ticketTypeCode);
        return ticketType ? ticketType.ticketPrice : 'N/A';
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        if (isNaN(date)) {
            return null;
        }

        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleTypeCheckboxChange = (type) => {
        setSelectedTicketTypes((prev) => {
            const updatedArray = [...prev];
            if (updatedArray.includes(type)) {
                return updatedArray.filter(code => code !== type);
            } else {
                return [...updatedArray, type];
            }
        });
    };

    const handleStatusCheckboxChange = (status) => {
        setSelectedTicketStatuses((prev) => {
            const updatedArray = [...prev];
            if (updatedArray.includes(status)) {
                return updatedArray.filter(code => code !== status);
            } else {
                return [...updatedArray, status];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisplayedPeriodType(periodType);
        const eventDateLower = new Date(eventDateRange[0]);
        const eventDateUpper = new Date(eventDateRange[1]);
        const purchaseDateLower = new Date(purchaseDateRange[0]);
        const purchaseDateUpper = new Date(purchaseDateRange[1]);
        const timeSlotLower = formatTime(timeSlotRange[0]);
        const timeSlotUpper = formatTime(timeSlotRange[1]);

        if (eventDateLower > eventDateUpper) {
            alert("Please choose a valid event date range.")
            return;
        } else if (purchaseDateLower > purchaseDateUpper) {
            alert("Please choose a valid purchase date range.")
            return;
        } else if (timeSlotLower > timeSlotUpper) {
            alert("Please choose a valid time slot range.")
            return;
        }

        try {

            const body = {
                eventDateLower,
                eventDateUpper,
                purchaseDateLower,
                purchaseDateUpper,
                timeSlotLower,
                timeSlotUpper,
                selectedTicketTypes,
                selectedTicketStatuses
            }

            const [ticketsResponse, aggregatesResponse] = await Promise.all([
                axios.post('/ticket/filter', body),
                periodType === 'monthly'
                    ? axios.post('/ticket/filter/monthly', body)
                    : periodType === 'quarterly'
                        ? axios.post('/ticket/filter/quarterly', body)
                        : periodType === 'yearly'
                            ? axios.post('/ticket/filter/yearly', body)
                            : Promise.resolve({ data: [] })
            ]);

            setAggregates(aggregatesResponse.data);
            setTickets(ticketsResponse.data)
        } catch (error) {
            console.error('Error fetching filtered tickets.', error);
        }
    };

    return (
        <Container maxWidth="md">
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Apply Filters
                        </Button>
                    </Grid2>
                    <Grid2 size={3}>
                        <TextField
                            select
                            variant="outlined"
                            label="Period Type"
                            InputLabelProps={{ shrink: true }}
                            value={periodType}
                            onChange={(e) => setPeriodType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value={'monthly'}>Monthly</MenuItem>
                            <MenuItem value={'quarterly'}>Quarterly</MenuItem>
                            <MenuItem value={'yearly'}>Yearly</MenuItem>
                        </TextField>
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
                            label="Time Slot After:"
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
                    <Grid2 size={3}/>
                    <Grid2 container size={3} spacing={1}>
                        {ticketTypes.map((ticketType) => (
                            <React.Fragment key={ticketType.ticketTypeCode}>
                                <Grid2 size={3}>
                                    <Checkbox
                                        checked={selectedTicketTypes.includes(ticketType.ticketTypeCode)}
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
                                        checked={selectedTicketStatuses.includes(ticketStatus.ticketStatusCode)}
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
            <Box mt={4}>
                <Typography variant="h4">Ticket Sale Results</Typography>

                {displayedPeriodType === 'monthly' ? (
                    <Typography variant="h5">--Monthly Sales--</Typography>
                ) : displayedPeriodType === 'quarterly' ? (
                    <Typography variant="h5">--Quarterly Sales--</Typography>
                ) : displayedPeriodType === 'yearly' ? (
                    <Typography variant="h5">--Yearly Sales--</Typography>
                ) : null}

                {aggregates.map((entry) =>
                    <Typography key={entry.period} variant="h6" sx={{ color: '#e0e0e0' }}>Period: {entry.period} - Tickets Sold: {entry.ticketCount} - Total Earnings: ${entry.totalAmount}</Typography>
                )}

                <Typography variant="h4">
                    &nbsp;
                </Typography>

                <Typography variant="h5">--Total Sales and Ticket List--</Typography>
                <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Found - {tickets.length} tickets</Typography>
                <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Total Sales - ${tickets.reduce((sum, ticket) => sum + (ticketTypes.find(t => t.ticketTypeCode === ticket.ticketType)?.ticketPrice || 0), 0)}.00</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="tickets">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticket ID</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell>Ticket Type</TableCell>
                                <TableCell>Purchase Date</TableCell>
                                <TableCell>Event Date</TableCell>
                                <TableCell>Time Slot</TableCell>
                                <TableCell>Ticket Status</TableCell>
                                <TableCell>Ticket Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.map(ticket => {
                                return (
                                    <TableRow key={ticket.ticketID}>
                                        <TableCell>{ticket.ticketID}</TableCell>
                                        <TableCell>{ticket.customerID}</TableCell>
                                        <TableCell>{ticketTypes.find((type) => type.ticketTypeCode === ticket.ticketType)?.ticketType}</TableCell>
                                        <TableCell>{ticket.purchaseDate}</TableCell>
                                        <TableCell>{ticket.eventDate}</TableCell>
                                        <TableCell>{ticket.timeSlot}</TableCell>
                                        <TableCell>{ticketStatuses.find((status) => status.ticketStatusCode === ticket.ticketStatus)?.ticketStatus}</TableCell>
                                        <TableCell>${getTicketPrice(ticket.ticketType)}.00</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default TicketsReport;