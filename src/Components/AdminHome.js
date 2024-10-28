import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const paths = [
    { path: '/customers', label: 'View/Edit Customers' },
    { path: '/employees', label: 'View/Edit Empoyees' },
    { path: '/employeeHours', label: 'Employee Hours Reports' },
    { path: '/ticketsreport', label: 'Ticket Reports' },
];

const AdminHome = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Welcome Admin
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

export default AdminHome;