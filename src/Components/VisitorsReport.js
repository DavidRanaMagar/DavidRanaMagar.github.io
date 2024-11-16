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

const VisitorsReport = () => {

    const [visitors, setVisitors] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [exhibitionCounts, setExhibitionCounts] = useState({});

    const [sex, setSex] = useState('');
    const [ageUpper, setAgeUpper] = useState('');
    const [ageLower, setAgeLower] = useState('')
    const [dateUpper, setDateUpper] = useState('');
    const [dateLower, setDateLower] = useState('');
    const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);


    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await axios.post('/customer/report', {
                    sex,
                    ageUpper,
                    ageLower,
                    dateUpper,
                    dateLower,
                    selectedTicketTypes,
                });

                setVisitors(response.data);
            } catch (error) {
                console.error('Error fetching visitors.', error);
            }
        };

        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get('/ticketType');

                setTicketTypes(response.data);
            } catch (error) {
                console.error('Error fetching ticket types.', error);
            }
        };

        fetchVisitors();
        fetchTicketTypes();
    }, []);

    useEffect(() => {
        const counts = visitors.reduce((acc, visitor) => {
            acc[visitor.title] = (acc[visitor.title] || 0) + 1;
            return acc;
        }, {});

        setExhibitionCounts(counts);
    }, [visitors]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startDate = new Date(dateLower);
        const endDate = new Date(dateUpper);

        if (parseInt(ageLower) > parseInt(ageUpper)) {
            alert("Please choose a valid age range.");
            return;
        }
        if (startDate > endDate) {
            alert("Please choose a valid date range.");
            return;
        }

        const filters = {
            sex,
            ageUpper,
            ageLower,
            dateUpper,
            dateLower,
            selectedTicketTypes,
        }

        try {
            const response = await axios.post('/customer/report', filters);

            setVisitors(response.data);
        } catch (error) {
            console.error('Error fetching visitors.', error);
        }
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" mt={4} mb={4}>Visitors Report</Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Apply Filters
                        </Button>
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="date"
                            label="Date After"
                            value={dateLower}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setDateLower(e.target.value)}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="date"
                            label="Date Before"
                            value={dateUpper}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setDateUpper(e.target.value)}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="number"
                            label="Age Above"
                            value={ageLower}
                            onChange={(e) => setAgeLower(e.target.value)}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="number"
                            label="Age Below"
                            value={ageUpper}
                            onChange={(e) => setAgeUpper(e.target.value)}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={3}>
                        <TextField
                            select
                            label="Sex"
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                            fullWidth
                        >
                            <MenuItem key={5} value={5}>
                                Male
                            </MenuItem>
                            <MenuItem key={1} value={1}>
                                Female
                            </MenuItem>
                            <MenuItem key={2} value={2}>
                                Non-Binary
                            </MenuItem>
                            <MenuItem key={3} value={3}>
                                Other
                            </MenuItem>
                            <MenuItem key={4} value={4}>
                                Prefer not to say
                            </MenuItem>
                        </TextField>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant="h5">Select Ticket Types</Typography>
                    </Grid2>
                    <Grid2 size={12}>
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
                    </Grid2>
                </Grid2>
            </form>

            <Typography variant="h4" mt={4} mb={4}>Visitor Results</Typography>
            <Typography variant="h5" mt={4}>
                Exhibition Visitor Counts
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="exhibition counts">
                    <TableHead>
                        <TableRow>
                            <TableCell>Exhibition</TableCell>
                            <TableCell>Number of Visitors</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(exhibitionCounts).map(([title, count]) => (
                            <TableRow key={title}>
                                <TableCell>{title}</TableCell>
                                <TableCell>{count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h5" mt={4}>--Total Visitors and Visitor List--</Typography>
            <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Found - {visitors.length} visitors</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tickets">
                    <TableHead>
                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Sex</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Ticket Type</TableCell>
                            <TableCell>Event Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visitors.map(visitor => {
                            return (
                                <TableRow>
                                    <TableCell>{visitor.lastName}</TableCell>
                                    <TableCell>{visitor.customerID}</TableCell>
                                    <TableCell>{visitor.sex}</TableCell>
                                    <TableCell>{visitor.age}</TableCell>
                                    <TableCell>{visitor.title}</TableCell>
                                    <TableCell>{visitor.ticketType}</TableCell>
                                    <TableCell>{visitor.visitDate}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default VisitorsReport;