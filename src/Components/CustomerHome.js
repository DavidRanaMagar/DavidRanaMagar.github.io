import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const paths = [
    { path: '/bookticket', label: 'Book Ticket' },
    { path: '/mytickets', label: 'My Tickets' },
    { path: '/products', label: 'Products' },
    { path: '/purchasehistory', label: 'Gift Shop Purchase History' },
    { path: '/customerdonation', label: 'Donate' },
    { path: '/membershipSignup', label: 'Membership Signup' },
    { path: '/customerexhibition', label:'View Exhibitions'},
    { path: '/membershipexpirynotification', label:'MemberShip Status'},
];

const CustomerHome = () => {
    const navigate = useNavigate();

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper',
                boxShadow: 2,
                borderRadius: 2,
            }}
        >
            <Typography 
                variant="h4" 
                align="center" 
                sx={{ mb: 4, fontWeight: 'medium' }}
            >
                Welcome, Customer
            </Typography>

            <Box 
                display="flex" 
                flexDirection="column" 
                width="100%" 
                gap={2}
            >
                {paths.map(({ path, label }) => (
                    <Button
                        key={path}
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
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
