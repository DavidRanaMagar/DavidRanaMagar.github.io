import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, Button, Container, Typography} from '@mui/material';

const paths = [
    { path: '/bookticket', label: 'Book Ticket' },
];

const CustomerHome = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Welcome Customer
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                {paths.map(({ path, label }) => (
                    <Button
                        key={path}
                        variant="contained"
                        onClick={() => navigate(path)}
                    >
                        {label}
                    </Button>
                ))}
            </Box>
        </Container>
    );
};

export default CustomerHome;
