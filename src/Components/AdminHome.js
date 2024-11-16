import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const paths = [
    { path: '/customers', label: 'View/Create Customers' },
    { path: '/employees', label: 'View/Create Employees' },
    { path: '/exhibitions', label: 'View/Create Exhibitions' },
    { path: '/loans', label: 'View/Record Loan' },
    { path: '/employeeHours', label: 'Employee Hours Report' },
    { path: '/departments', label: 'View/Modify Departments' },
    { path: '/artifacts', label: 'View/Modify Artifacts' },
    { path: '/giftShopItems', label: 'View/Modify Gift Shop Item' },
    { path: '/ticketsreport', label: 'Ticket Sales Report' },
    { path: '/giftshopitemreport', label: 'Gift Shop Sales Report' },
    { path: '/donationsreport', label: 'Donations Report' },
    { path: '/visitorsreport', label: 'Visitors Report' },
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