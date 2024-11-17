import React, { useEffect, useState } from 'react';
import {Button, Container, MenuItem, TextField, Typography, Box, Grid2} from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const BookTicket = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [exhibitionID, setExhibitionID] = useState(null);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const [ticketTypes, setTicketTypes] = useState([]);
    const [tickets, setTickets] = useState({});
    const [exhibitions, setExhibitions] = useState([]);
    const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
    const timeConversion = {
        '10:00 AM': '10:00:00',
        '12:00 PM': '12:00:00',
        '2:00 PM': '14:00:00',
        '4:00 PM': '16:00:00',
    };

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const response = await axios.post('/exhibition/date', {
                    date: new Date(date),
                });
                setExhibitions(response.data);
            } catch (error) {
                setExhibitions([]);
                console.error('Error fetching exhibitions:', error);
            }
        };

        fetchExhibitions();
    }, [date]);

    useEffect(() => {
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

    useEffect(() => {
        const calculateTotalPrice = () => {
            const total = ticketTypes.reduce((acc, ticket) => {
                const quantity = tickets[ticket.ticketTypeCode] || 0;
                return acc + ticket.ticketPrice * quantity;
            }, 0);
            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [tickets, ticketTypes]);

    const handleTicketChange = (index, value) => {
        setTickets((prev) => ({
            ...prev,
            [index]: Math.min(Math.max(value, 0), 20), // Prevent negative values and values over 20
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Already adjusted for time zone, sets hours to midnight for accurate comparison
        const selectedDate = new Date(date + 'T00:00:00'); // normalize to GMT time zone, sets hours to midnight for accurate comparison

        if (selectedDate < today || date === '') {
            alert('Choose a valid date please.');
            return;
        }
        if (timeSlot === '') {
            alert('Choose a time slot please.');
            return;
        }
        if (Object.values(tickets).every((quantity) => quantity === 0)) {
            alert('Choose at least one ticket please.');
            return;
        }

        const selectedTime = timeConversion[timeSlot];

        try {
            const ticketIDs = await Promise.all(
                Object.entries(tickets)
                    .filter(([_, quantity]) => quantity > 0)
                    .flatMap(([ticketTypeCode, quantity]) =>
                        // multiple posts for account for quantity
                        Array.from({ length: quantity }).map(async () => {
                            const response = await axios.post('/ticket', {
                                ticketType: ticketTypeCode,
                                purchaseDate: today,
                                eventDate: selectedDate,
                                timeSlot: selectedTime,
                                ticketStatus: '1',
                                customerID: customerID,
                                exhibitionID: exhibitionID
                            });
                            return response.data.ticketID;
                        })
                    )
            );

            const saleResponse = await axios.post('/sale', {
                totalPrice: totalPrice,
                createdBy: 'online user',
                updatedBy: 'online user',
                employeeID: '163', // 163 is the fake employee placeholder for online purchase
            });

            const saleID = saleResponse.data.saleID;

            await Promise.all(
                ticketIDs.map((ticketID) =>
                    axios.post('/saleTicket', {
                        saleID: saleID,
                        ticketID: ticketID,
                        createdBy: 'online user',
                        updatedBy: 'online user',
                    })
                )
            );

            const transactionResponse = await axios.post('/saleTransaction', {
                customerID: customerID,
                transactionAmount: totalPrice,
                paymentMethod: 'Credit Card',
                transactionDate: today,
                saleID: saleID,
                createdBy: 'online user',
                updatedBy: 'online user',
            });

            if (transactionResponse.data.discountApplied) {
                alert('Tickets successfully ordered and Birthday Discount Applied!');
            } else {
                alert('Tickets successfully ordered!');
            }
        } catch (error) {
            console.error('Error placing the order:', error);
            alert('An error occurred placing order.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Book Tickets
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={2}>
                        <Grid2 item size={12}>
                            <Typography variant="h6">Select an Exhibition </Typography>
                        </Grid2>
                        <Grid2 item size={4}>
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid2>
                        <Grid2 item size={4}>
                            <TextField
                                label="Exhbition"
                                select
                                fullWidth
                                value={exhibitionID}
                                onChange={(e) => setExhibitionID(e.target.value)}
                            >
                                {exhibitions.map((exhibition) => (
                                    <MenuItem key={exhibition.exhibitionID} value={exhibition.exhibitionID}>
                                        {exhibition.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 item size={4}>
                            <TextField
                                label="Time Slot"
                                select
                                fullWidth
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
                        <Grid2 item size={12}>
                            <Typography variant="h6">Select Tickets</Typography>
                        </Grid2>
                        {ticketTypes.map((ticket) => (
                            <React.Fragment key={ticket.ticketTypeCode}>
                                <Grid2 item size={6}>
                                    <Typography variant="body1">{ticket.ticketType}</Typography>
                                </Grid2>
                                <Grid2 item size={3}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        fullWidth
                                        value={tickets[ticket.ticketTypeCode] || 0}
                                        onChange={(e) =>
                                            handleTicketChange(ticket.ticketTypeCode, parseInt(e.target.value, 10) || 0)
                                        }
                                        InputProps={{ inputProps: { min: 0, max: 20 } }}
                                    />
                                </Grid2>
                                <Grid2 item size={3}>
                                    <Typography variant="body1">${ticket.ticketPrice}</Typography>
                                </Grid2>
                            </React.Fragment>
                        ))}

                        <Grid2 item size={12}>
                            <Typography variant="h6">Total Price: ${totalPrice}</Typography>
                        </Grid2>
                        <Grid2 item size={12}>
                            <Button variant="contained" color="primary" fullWidth type="submit">
                                Book Tickets
                            </Button>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </Container>
    );
};

export default BookTicket;
