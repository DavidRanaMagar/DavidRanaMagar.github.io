import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    Grid2, IconButton, MenuItem,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";

const EmployeeSearch = () => {
        const [tickets, setTickets] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [searchParams, setSearchParams] = useState({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        });
        const handleChange = (e) => {
            const {name, value} = e.target;
            setSearchParams({...searchParams, [name]: value});
        };

        const handleInputChange = (ticketID, value) => {
            // Update ticket status locally
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.ticketID === ticketID
                        ? {...ticket, ticketStatus: value}
                        : ticket
                )
            );
        };

        const handleRowClick = async (ticketID, ticketStatus) => {
            try {
                const response = await axios.put(`/ticket/${ticketID}/status`, {ticketStatus: ticketStatus});
                console.log('Ticket updated:', response.data);
                alert(`Ticket ${ticketID} updated successfully!`);
                handleSearch();
            } catch (err) {
                console.error('Error updating ticket:', err.message);
                alert('Failed to update ticket.');
            }
        };


        const handleSearch = async () => {
            setLoading(true);
            setError(null);

            const filteredParams = Object.keys(searchParams).reduce((acc, key) => {
                if (searchParams[key]) {
                    acc[key] = searchParams[key];
                }
                return acc;
            }, {});
            try {
                const response = await axios.get('/ticket/search', {params: filteredParams});
                setTickets(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('Failed to fetch employee data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        // Automatically fetch employees every time searchParams changes
        useEffect(() => {
            handleSearch();
        }, [searchParams]);


        return (
            <Container maxWidth="lg">

                <Typography variant="h6" style={{padding: '16px'}}>Search Customer Tickets</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 xs={12} sm={6} md={3}>
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            value={searchParams.firstName}
                            onChange={handleChange}
                        />
                    </Grid2>
                    <Grid2 xs={12} sm={6} md={3}>
                        <TextField
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            value={searchParams.lastName}
                            onChange={handleChange}
                        />
                    </Grid2>
                    <Grid2 xs={12} sm={6} md={3}>
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={searchParams.email}
                            onChange={handleChange}
                        />
                    </Grid2>
                    <Grid2 xs={12} sm={6} md={3}>
                        <TextField
                            name="phone"
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            value={searchParams.phone}
                            onChange={handleChange}
                        />
                    </Grid2>
                    <Grid2 xs={12} container justifyContent="center">
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} style={{ marginTop: '20px' }}>
                    {loading && <Typography>Loading...</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6">Ticket ID</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Customer Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Customer Email</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Customer Phone No.</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Ticket Status</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Action</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.ticketID}>
                                            <TableCell>{ticket.ticketID}</TableCell>
                                            <TableCell>
                                                {ticket.customer.firstName} {ticket.customer.lastName}
                                            </TableCell>
                                            <TableCell>{ticket.customer.email}</TableCell>
                                            <TableCell>{ticket.customer.phone}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    label="Ticket Status"
                                                    name="ticketStatus"
                                                    value={ticket.ticketStatus}
                                                    onChange={(e) =>
                                                        handleInputChange(ticket.ticketID, e.target.value)
                                                    }
                                                    fullWidth
                                                >
                                                    <MenuItem key={1} value={1}>
                                                        Active
                                                    </MenuItem>
                                                    <MenuItem key={2} value={2}>
                                                        Used
                                                    </MenuItem>
                                                    <MenuItem key={3} value={3}>
                                                        Expired
                                                    </MenuItem>
                                                    <MenuItem key={4} value={4}>
                                                        Cancelled
                                                    </MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleRowClick(ticket.ticketID, ticket.ticketStatus)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No tickets found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
            </Container>
        )
            ;
    }
;

export default EmployeeSearch;
