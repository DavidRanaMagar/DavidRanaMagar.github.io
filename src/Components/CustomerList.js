import React, { useEffect, useState } from 'react';
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
  Button
} from '@mui/material';
import axios from 'axios';
import CustomerForm from './CustomerForm'; // Assuming you have the form in another file

const CustomerView = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);

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

  // Handle row click
  const handleRowClick = (customerID) => {
    setSelectedCustomerID(customerID);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Customer Information
        </Typography>
      </Box>
      {!selectedCustomerID ? (
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
                <TableRow key={customer.customerID} hover onClick={() => handleRowClick(customer.customerID)}>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.dob}</TableCell>
                  <TableCell>{customer.sex === 0 ? 'Male' : customer.sex === 1 ? 'Female' : 'Non-Binary'}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={(e) => { 
                      e.stopPropagation(); // Prevent the row click
                      handleRowClick(customer.customerID); 
                    }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <CustomerForm customerID={selectedCustomerID} setSelectedCustomerID={setSelectedCustomerID} />
      )}
    </Container>
  );
};

export default CustomerView;
