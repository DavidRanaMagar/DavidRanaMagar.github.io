import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const paths = [
    { path: '/employees', label: 'View/Create Employees' },
    { path: '/employeeHours', label: 'Employee Hours Report' },
    { path: '/ticketing', label: 'Ticketing' },
];

const ManagerHome = () => {
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
                Welcome, Manager
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

export default ManagerHome;
