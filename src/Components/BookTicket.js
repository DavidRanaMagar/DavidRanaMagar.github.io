import React, {useEffect, useState} from 'react';
import {Button, Container, Grid2, MenuItem, TextField, Typography} from '@mui/material';
import useAuth from "../hooks/useAuth";
import axios from '../api/axios';

const BookTicket = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [tickets, setTickets] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM','4:00 PM']
    const timeConversion = {
        '10:00 AM': '10:00:00',
        '12:00 PM': '12:00:00',
        '2:00 PM': '14:00:00',
        '4:00 PM': '16:00:00'
    };

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

    const calculateTotalPrice = () => {
        const total =  ticketTypes.reduce((acc, ticket) => {
            const quantity = tickets[ticket.ticketTypeCode] || 0;
            return acc + ticket.ticketPrice * quantity;
        }, 0);
        setTotalPrice(total);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [tickets, ticketTypes]);

    const handleTicketChange = (index, value) => {

        setTickets(prev => ( {
            ...prev,
            [index]: Math.min(Math.max(value, 0), 20) // Prevent negative values and values over 20
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        const selectedDate = new Date(date);

        if (selectedDate <= today || date === '') {
            alert("Choose a valid date please.")
            return;
        }
        if (timeSlot === '') {
            alert("Choose a time slot please.");
            return;
        }
        if (Object.values(tickets).every(quantity => quantity === 0)) { // makes sure ticket quantities aren't set to 0
            alert("Choose at least one ticket please.");
            return;
        }

        const selectedTime = timeConversion[timeSlot]; //puts in SQL time data type

        try {
            const ticketIDs = await Promise.all( // creates all ticket tuples and stores their IDs
                Object.entries(tickets)
                    .filter(([_, quantity]) => quantity > 0)
                    .flatMap(([ticketTypeCode, quantity]) =>
                        Array.from({ length: quantity }).map(async () => {
                            const response = await axios.post('/ticket', {
                                ticketType: ticketTypeCode,
                                purchaseDate: today,
                                eventDate: selectedDate,
                                timeSlot: selectedTime,
                                ticketStatus: '1',
                                customerID: customerID
                            });
                            return response.data.ticketID;
                        })
                    )
            );

            const saleResponse = await axios.post('/sale', {
                totalPrice: totalPrice,
                createdBy: 'online user',
                updatedBy: 'online user',
                employeeID: '163' //163 is the fake employee placeholder for online purchase
            });

            const saleID = saleResponse.data.saleID;

            await Promise.all(
                ticketIDs.map((ticketID) =>
                    axios.post('/saleTicket', {
                        saleID: saleID,
                        ticketID: ticketID,
                        createdBy: 'online user',
                        updatedBy: 'online user'
                    })
                )
            );

            await axios.post('/saleTransaction', {
                customerID: customerID,
                transactionAmount: totalPrice,
                paymentMethod: 'Credit Card',
                transactionDate: today,
                saleID: saleID,
                createdBy: 'online user',
                updatedBy: 'online user'
            });


            alert('Tickets successfully ordered!');
        } catch (error) {
            console.error("Error placing the order:", error);
            alert('An error occurred placing order.');
        }
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
                        <React.Fragment key={ticket.ticketTypeCode}>
                            <Grid2 container alignItems="center" size={6}>
                                <Typography variant="body1">{ticket.ticketType}</Typography>
                            </Grid2>
                            <Grid2 size={4}>
                                <TextField
                                    type="number"
                                    value={tickets[ticket.ticketTypeCode] || 0}
                                    onChange={(e) =>
                                        handleTicketChange(ticket.ticketTypeCode, parseInt(e.target.value, 10) || 0)
                                    }
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 container alignItems="center" size={2}>
                                <Typography variant="body1">${ticket.ticketPrice}</Typography>
                            </Grid2>
                        </React.Fragment>
                    ))}
                </Grid2>
                <Button variant="contained" color="primary" type="submit">
                    Book Tickets
                </Button>
            </form>
        </Container>
    )
}

export default BookTicket;