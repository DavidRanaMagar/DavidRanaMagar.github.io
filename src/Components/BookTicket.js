import React, {useEffect, useState} from 'react';
import {Container, Typography, Grid2, TextField, MenuItem, Button} from '@mui/material';
import useAuth from "../hooks/useAuth";
import axios from '../api/axios';

const BookTicket = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [tickets, setTickets] = useState({});
    const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

    useEffect(() => {

        console.log(auth);

        const fetchTypes = async () => {
            try {
                const response = await axios.get('/ticketType');
                setTicketTypes(response.data);

                const initialTickets = response.data.reduce((acc, ticket) => {
                    acc[ticket.ticketTypeCode] = 0;
                    return acc;
                }, {});
                setTickets(initialTickets);
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };

        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`/customer/user/${auth.userId}`);
                setCustomerID(response.data.customerID);
            } catch (error) {
                console.error('Error fetching customerID:', error);
            }
        };

        fetchTypes();
        fetchCustomer();
    }, [auth]);

    const handleTicketChange = (index, value) => {

        setTickets(prev => ( {
            ...prev,
            [index]: Math.max(value, 0) // Prevent negative values
        }));
    };

    const handleSubmit = () => {
        console.log({ customerID, date, timeSlot, tickets });
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Book Tickets
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 container alignItems="center" size={2}>
                        <Typography variant="body1">Select a Date</Typography>
                    </Grid2>
                    <Grid2 size={10}>
                        <TextField
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 container alignItems="center" size={2}>
                        <Typography variant="body1">Select a Time</Typography>
                    </Grid2>
                    <Grid2 size={10}>
                        <TextField
                            select
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                        >
                        {timeSlots.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant="h4">Select Tickets</Typography>
                    </Grid2>
                    {ticketTypes.map((ticket) => (
                        <React.Fragment key={ticket.type}>
                            <Grid2 container alignItems="center" size={6}>
                                <Typography variant="body1">{ticket.ticketType}</Typography>
                            </Grid2>
                            <Grid2 size={4}>
                                <TextField
                                    type="number"
                                    value={tickets[ticket.ticketTypeCode]}
                                    onChange={(e) =>
                                        handleTicketChange(ticket.ticketTypeCode, parseInt(e.target.value, 10) || 0)
                                    }
                                    inputProps={{ min: 0 }}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 container alignItems="center" size={2}>
                                <Typography variant="body1">${ticket.ticketPrice}</Typography>
                            </Grid2>
                        </React.Fragment>
                    ))}
                </Grid2>
                <Button variant="contained" color="primary" type="submit" sx={{mt: 2}}>
                    Book Tickets
                </Button>
            </form>
        </Container>
    )
}

export default BookTicket;