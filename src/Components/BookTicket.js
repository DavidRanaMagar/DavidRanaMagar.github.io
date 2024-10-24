import React from 'react';
import { TextField, Button, Container, Typography, Grid2, MenuItem } from '@mui/material';
import axios from '../api/axios';

const BookTicket = () => {

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                {"Book Tickets Page"}
            </Typography>

            {/* must create 4 rows (1 for each ticket type)
                prices displayed in each row
                incrementer for how many tickets wanted of each type

             */}
        </Container>
    )
}

export default BookTicket;