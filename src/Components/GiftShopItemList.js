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
import GiftShopItemForm from "./GiftShopItemForm";

const GiftShopList = () => {
    const [giftShopItems, setGiftShopItems] = useState([]);
    const [selectedGiftShopItemID, setSelectedGiftShopItemID] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // Track create mode

    useEffect(() => {
        const fetchGiftShopItems = async () => {
            try {
                const response = await axios.get('/giftShopItem');
                setGiftShopItems(response.data);
            } catch (err) {
                console.error('Error fetching gift shop item data:', err);
            }
        };
        fetchGiftShopItems();
    }, []);

    // Open form for editing
    const handleRowClick = (giftShopItemID) => {
        setSelectedGiftShopItemID(giftShopItemID);
        setIsCreating(false); // Disable create mode when editing
    };

    // Open form for creating new giftShopItem
    const handleCreateGiftShopItem = () => {
        setSelectedGiftShopItemID(null);
        setIsCreating(true); // Enable create mode
    };

    // Clear selection and close form
    const clearSelection = () => {
        setSelectedGiftShopItemID(null);
        setIsCreating(false); // Exit create mode when form is closed
    };

    const handleDelete = async (giftShopItemID) => {
        if (window.confirm('Are you sure you want to delete this Gift Shop Item?')) {
            try {
                await axios.delete(`/giftShopItem/${giftShopItemID}`);
                setGiftShopItems(giftShopItems.filter(giftShopItem => giftShopItem.giftShopItemID !== giftShopItemID));
                alert('Gift Shop Item deleted successfully!');
            } catch (err) {
                console.error('Error deleting Gift Shop Item:', err);
                alert('Failed to delete Gift Shop Item');
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Gift Shop Item Information
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateGiftShopItem}>
                    Create New Gift Shop Item
                </Button>
            </Box>
            {!selectedGiftShopItemID && !isCreating ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">Title</Typography></TableCell>
                                <TableCell><Typography variant="h6">Designer</Typography></TableCell>
                                <TableCell><Typography variant="h6">Origin</Typography></TableCell>
                                <TableCell><Typography variant="h6">Stock</Typography></TableCell>
                                <TableCell><Typography variant="h6">Cost Price</Typography></TableCell>
                                <TableCell><Typography variant="h6">Price</Typography></TableCell>
                                <TableCell><Typography variant="h6">Total Number Sold</Typography></TableCell>
                                <TableCell><Typography variant="h6">Action</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {giftShopItems.map((giftShopItem) => (
                                <TableRow key={giftShopItem.giftShopItemID} hover>
                                    <TableCell>{giftShopItem.title}</TableCell>
                                    <TableCell>{giftShopItem.designer}</TableCell>
                                    <TableCell>{giftShopItem.origin}</TableCell>
                                    <TableCell>{giftShopItem.stock}</TableCell>
                                    <TableCell>{giftShopItem.costPrice}</TableCell>
                                    <TableCell>{giftShopItem.price}</TableCell>
                                    <TableCell>{giftShopItem.totalNumberSold}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleRowClick(giftShopItem.giftShopItemID)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(giftShopItem.giftShopItemID)}>
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
                    <GiftShopItemForm
                        giftShopItemID={selectedGiftShopItemID}
                        setSelectedGiftShopItemID={setSelectedGiftShopItemID}
                        clearSelection={clearSelection}
                        isCreating={isCreating} // Pass down create mode status
                    />
                </>
            )}
        </Container>
    );
};

export default GiftShopList;
