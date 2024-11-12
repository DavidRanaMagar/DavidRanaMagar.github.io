import React, {useEffect, useState} from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell, TableBody
} from '@mui/material';
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const PurchaseHistory = () => {
    const { auth } = useAuth();
    const [customerID, setCustomerID] = useState(null);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        console.log(auth);
        if (!auth.userId) {
            console.log('No userID provided');
            return;
        }

        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`/customer/user/${auth.userId}`);

                setCustomerID(response.data.customerID);
            } catch (error) {
                console.error('Error fetching customerID:', error);
            }
        };

        fetchCustomer();
    }, [auth]);

    useEffect(() => {
        if (!customerID) {
            console.log('No customerID provided');
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/sale/${customerID}/items`);
                setPurchases(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        fetchProducts();
    }, [customerID]);

    return (
        <Container maxWidth="md" mb={4}>
            <Typography variant="h4" gutterBottom>
                Your Gift Shop Purchase History
            </Typography>
            {purchases.length <= 0 ? (
                <Typography variant="h6">No Purchase History.</Typography>
            ) : (
                <>
                    <Typography variant="h6">Found - {purchases.length} Purchases</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="tickets">
                            <TableHead>
                                <TableRow>
                                    <TableCell variant="h5">Gift Shop Item</TableCell>
                                    <TableCell variant="h5">Price</TableCell>
                                    <TableCell variant="h5">Quantity</TableCell>
                                    <TableCell variant="h5">Purchase Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchases.map(purchase => (
                                    <TableRow key={purchase.title}>
                                        <TableCell>{purchase.title}</TableCell>
                                        <TableCell>{purchase.price}</TableCell>
                                        <TableCell>{purchase.quantity}</TableCell>
                                        <TableCell>{purchase.transactionDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
}

export default PurchaseHistory;