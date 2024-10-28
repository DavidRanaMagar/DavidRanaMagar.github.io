import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Container,
    IconButton,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerID, setSelectedCustomerID] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // Track create mode

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('/customer');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };
        fetchCustomers();
    }, []);

    // Open form for editing
    const handleRowClick = (customerID) => {
        setSelectedCustomerID(customerID);
        setIsCreating(false); // Disable create mode when editing
    };

    // Open form for creating new employee
    const handleCreateCustomer = () => {
        setSelectedCustomerID(null);
        setIsCreating(true); // Enable create mode
    };

    // Clear selected employee to close form
    const clearSelection = () => {
        setSelectedCustomerID(null);
        setIsCreating(false);  // Exit create mode when form is closed
    };

    const handleDelete = async (customerID) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`/customer/${customerID}`);
                setCustomers(customers.filter(customer => customer.customerID !== customerID));
                alert('Customer deleted successfully!');
            } catch (err) {
                console.error('Error deleting customer:', err);
                alert('Failed to delete customer');
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Customer Information
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateCustomer}>
                    Create New Customer
                </Button>
            </Box>
            {!selectedCustomerID && !isCreating ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">First Name</Typography></TableCell>
                                <TableCell><Typography variant="h6">Last Name</Typography></TableCell>
                                <TableCell><Typography variant="h6">Date of Birth</Typography></TableCell>
                                <TableCell><Typography variant="h6">Sex</Typography></TableCell>
                                <TableCell><Typography variant="h6">Email</Typography></TableCell>
                                <TableCell><Typography variant="h6">Phone</Typography></TableCell>
                                <TableCell><Typography variant="h6">Actions</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.customerID} hover
                                          onClick={() => handleRowClick(customer.customerID)}>
                                    <TableCell>{customer.firstName}</TableCell>
                                    <TableCell>{customer.lastName}</TableCell>
                                    <TableCell>{customer.dob}</TableCell>
                                    <TableCell>{customer.gender.sex}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleRowClick(customer.customerID)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(customer.customerID)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection}
                            style={{marginBottom: '10px'}}>
                        Back to List
                    </Button>
                    <CustomerForm
                        customerID={selectedCustomerID}
                        setSelectedCustomerID={setSelectedCustomerID}
                        clearSelection={clearSelection}
                        isCreating={isCreating} // Pass down create mode status
                    />
                </>
            )}

        </Container>
    );
};

export default CustomerList;