import {
    Box,
    Button,
    Checkbox,
    Container,
    Grid2, MenuItem,
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
    const [giftShopItems, setGiftShopItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [aggregates, setAggregates] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(['', '']);
    const [periodType, setPeriodType] = useState('');
    const [displayedPeriodType, setDisplayedPeriodType] = useState('');

    useEffect(() => {
        const fetchGiftShopItems = async () => {
            try {
                const response = await axios.post('/giftShopItem/filter', {
                    minPrice: null,
                    maxPrice: null,
                    selectedCategories: [],
                });
                setGiftShopItems(response.data);
            } catch (error) {
                console.error('Error fetching products.', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/category');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories.', error);
            }
        };

        fetchGiftShopItems();
        fetchCategories();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) => {
            const updatedArray = [...prev];
            if (updatedArray.includes(category)) {
                return updatedArray.filter(code => code !== category);
            } else {
                return [...updatedArray, category];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDisplayedPeriodType(periodType);
        const minPrice = parseFloat(priceRange[0]) || 0;
        const maxPrice = parseFloat(priceRange[1]) || Infinity;

        if (minPrice > maxPrice) {
            alert('Choose a valid price range please.')
            return;
        }

        try {

            const body = {
                minPrice,
                maxPrice,
                selectedCategories
            }

            const [itemsResponse, aggregatesResponse] = await Promise.all([
                axios.post('/giftShopItem/filter', body),
                periodType === 'monthly'
                    ? axios.post('/giftShopItem/filter/monthly', body)
                    : periodType === 'quarterly'
                        ? axios.post('/giftShopItem/filter/quarterly', body)
                        : periodType === 'yearly'
                            ? axios.post('/giftShopItem/filter/yearly', body)
                            : Promise.resolve({data: []})
            ]);

            setAggregates(aggregatesResponse.data)
            setGiftShopItems(itemsResponse.data);
        } catch (error) {
            console.error('Error fetching gift shop items.', error);
        }
    };

    return (
        <Container maxWidth="md">
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Apply Filters
                        </Button>
                    </Grid2>
                    <Grid2 size={3}>
                        <TextField
                            select
                            variant="outlined"
                            label="Period Type"
                            InputLabelProps={{ shrink: true }}
                            value={periodType}
                            onChange={(e) => setPeriodType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value={'monthly'}>Monthly</MenuItem>
                            <MenuItem value={'quarterly'}>Quarterly</MenuItem>
                            <MenuItem value={'yearly'}>Yearly</MenuItem>
                        </TextField>
                    </Grid2>
                    <Grid2 size={3}>
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
                    <Grid2 size={3}>
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
                                        checked={selectedCategories.includes(category.categoryID)}
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

                {displayedPeriodType === 'monthly' ? (
                    <Typography variant="h5">--Monthly Sales--</Typography>
                ) : displayedPeriodType === 'quarterly' ? (
                    <Typography variant="h5">--Quarterly Sales--</Typography>
                ) : displayedPeriodType === 'yearly' ? (
                    <Typography variant="h5">--Yearly Sales--</Typography>
                ) : null}

                {aggregates.map((entry) =>
                    <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Period: {entry.period} - Items Sold: {entry.giftShopItemCount} - Total Earnings: ${entry.totalAmount}</Typography>
                )}

                <Typography variant="h4">
                    &nbsp;
                </Typography>

                <Typography variant="h5">--Total Sales and Item List--</Typography>
                <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Found - {giftShopItems.length} products</Typography>
                <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Total Sales - ${giftShopItems.reduce((sum, item) => sum + item.price, 0)}</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {giftShopItems.map(item => {
                                return (
                                    <TableRow >
                                        <TableCell>{item.giftShopItemID}</TableCell>
                                        <TableCell>{item?.title}</TableCell>
                                        <TableCell>{categories.find(c => c.categoryID === item.categoryID)?.title}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
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