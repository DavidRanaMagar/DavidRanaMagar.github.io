import {
    Box,
    Button,
    Checkbox,
    Container,
    Grid2,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const GiftShopItemsReport = () => {
    const [products, setProducts] = useState([]);
    const [salesData, setSalesData] = useState([]); // State for sales data
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [priceRange, setPriceRange] = useState(['', '']);
    const [filteredSalesData, setFilteredSalesData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/giftShopItem');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products.', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/category');
                setCategories(response.data);
                setSelectedCategories(new Set(response.data.map(c => c.categoryID)));
            } catch (error) {
                console.error('Error fetching categories.', error);
            }
        };

        const fetchSalesData = async () => {
            try {
                const response = await axios.get('/saleGiftShopItem'); // Adjust this to your actual endpoint
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data.', error);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchSalesData();
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(categoryId)) {
                updatedSet.delete(categoryId);
            } else {
                updatedSet.add(categoryId);
            }
            return updatedSet;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const minPrice = parseFloat(priceRange[0]) || 0;
        const maxPrice = parseFloat(priceRange[1]) || Infinity;

        if (minPrice > maxPrice) {
            alert('Choose a valid price range please.')
            return;
        }

        // Filter sales data based on selected categories and price range
        const filtered = salesData.filter(sale => {
            const product = products.find(p => p.giftShopItemID === sale.giftShopItemID);
            const isCategorySelected = selectedCategories.has(product?.categoryID);
            const isPriceInRange = product ? (product.price >= minPrice && product.price <= maxPrice) : false;
            return isCategorySelected && isPriceInRange;
        });

        setFilteredSalesData(filtered);
    };

    return (
        <Container maxWidth="md">
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Apply Filters
                        </Button>
                    </Grid2>
                    <Grid2 xs={6}>
                        <TextField
                            type="number"
                            variant="outlined"
                            label="Min Price"
                            value={priceRange[0]}
                            onChange={(e) =>
                                setPriceRange((prev) => [e.target.value, prev[1]])
                            }
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 xs={6}>
                        <TextField
                            type="number"
                            variant="outlined"
                            label="Max Price"
                            value={priceRange[1]}
                            onChange={(e) =>
                                setPriceRange((prev) => [prev[0], e.target.value])
                            }
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant="h5">Select Categories</Typography>
                    </Grid2>
                    {categories.map((category) => (
                        <React.Fragment key={category.categoryID}>
                            <Grid2 container spacing={2} size={4}>
                                <Grid2 size={3} alignItems="center">
                                    <Checkbox
                                        checked={selectedCategories.has(category.categoryID)}
                                        onChange={() => handleCategoryChange(category.categoryID)}
                                    />
                                </Grid2>
                                <Grid2 size={9} alignItems="center">
                                    <Typography variant="body1">{category.title}</Typography>
                                </Grid2>
                            </Grid2>
                        </React.Fragment>
                    ))}
                </Grid2>
            </form>
            <Box mt={4}>
                <Typography variant="h4">Gift Shop Sales Results</Typography>
                <Typography variant="h6">Found - {filteredSalesData.length} products</Typography>
                <Typography variant="h6">Total Sales - ${filteredSalesData.reduce((sum, sale) => {
                    const product = products.find(p => p.giftShopItemID === sale.giftShopItemID);
                    return sum + (product ? product.price : 0);
                }, 0)}</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sale ID</TableCell>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSalesData.map(sale => {
                                const product = products.find(p => p.giftShopItemID === sale.giftShopItemID);
                                return (
                                    <TableRow key={sale.saleGiftShopItemID}> {/* Adjust key to your actual sale item ID */}
                                        <TableCell>{sale.saleID}</TableCell> {/* Assuming saleID is available in sales data */}
                                        <TableCell>{product ? product.giftShopItemID : 'N/A'}</TableCell>
                                        <TableCell>{product ? product.title : 'N/A'}</TableCell>
                                        <TableCell>{categories.find(c => c.categoryID === product?.categoryID)?.title || 'N/A'}</TableCell>
                                        <TableCell>${product ? product.price.toFixed(2) : 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default GiftShopItemsReport;