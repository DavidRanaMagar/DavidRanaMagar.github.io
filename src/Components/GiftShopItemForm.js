import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Grid2, MenuItem} from '@mui/material';
import axios from 'axios';

const GiftShopItemForm = ({giftShopItemID, setSelectedGiftShopItemID}) => {
    const [giftShopItem, setGiftShopItem] = useState({
        title: '',
        description: '',
        designer: '',
        origin: '',
        material: '',
        dimension: '',
        price: '',
        dealPrice: '',
        costPrice: '',
        imageUrl: '',
        stock: '',
        totalNumberSold: '',
        categoryID: ''
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const [cateResponse] = await Promise.all([
                    axios.get('/category')
                ]);

                setCategories(cateResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCategoriesData();
    }, []);

    useEffect(() => {
        const fetchGiftShopItemData = async () => {
            if (giftShopItemID) {
                try {
                    const response = await axios.get(`/giftShopItem/${giftShopItemID}`);
                    setGiftShopItem({
                        title: response.data.title || '',
                        description: response.data.description || '',
                        designer: response.data.designer || '',
                        origin: response.data.origin || '',
                        material: response.data.material || '',
                        dimension: response.data.dimension || '',
                        price: response.data.price || '',
                        dealPrice: response.data.dealPrice || '',
                        costPrice: response.data.costPrice || '',
                        imageUrl: response.data.imageUrl || '',
                        stock: response.data.stock || '',
                        totalNumberSold: response.data.totalNumberSold || '',
                        categoryID: response.data.categoryID || '',
                    });
                } catch (error) {
                    console.error('Error fetching Gift Shop Item data:', error);
                }
            } else {
                setGiftShopItem({
                    title: '',
                    description: '',
                    designer: '',
                    origin: '',
                    material: '',
                    dimension: '',
                    price: '',
                    dealPrice: '',
                    costPrice: '',
                    imageUrl: '',
                    stock: '',
                    totalNumberSold: '',
                    categoryID: '',
                });
            }
        };

        fetchGiftShopItemData();
    }, [giftShopItemID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGiftShopItem(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...giftShopItem
            };
            if (giftShopItemID) {
                await axios.put(`/giftShopItem/${giftShopItemID}`, dataToSend);
                alert('Gift Shop Item updated successfully!');
            } else {
                // Create new customer
                await axios.post('/giftShopItem', dataToSend);
                alert('Customer created successfully!');
            }
            setSelectedGiftShopItemID(null);
        } catch (error) {
            console.error('Error saving Gift Shop Item:', error);
            alert('Failed to save Gift Shop Item');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {giftShopItemID ? 'Edit Gift Shop Item' : 'Gift Shop Item Form'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                        <TextField
                            label="title"
                            name="title"
                            value={giftShopItem.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="origin"
                            name="origin"
                            value={giftShopItem.origin}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={12}>
                        <TextField
                            label="description"
                            name="description"
                            value={giftShopItem.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="material"
                            name="material"
                            value={giftShopItem.material}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="dimension"
                            name="dimension"
                            value={giftShopItem.dimension}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="price"
                            name="price"
                            value={giftShopItem.price}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="dealPrice"
                            name="dealPrice"
                            value={giftShopItem.dealPrice}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="costPrice"
                            name="costPrice"
                            value={giftShopItem.costPrice}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="imageUrl"
                            name="imageUrl"
                            value={giftShopItem.imageUrl}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="stock"
                            name="stock"
                            value={giftShopItem.stock}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="totalNumberSold"
                            name="totalNumberSold"
                            value={giftShopItem.totalNumberSold}
                            onChange={handleInputChange}
                            fullWidth
                            margin='normal'
                            required
                        />
                    </Grid2>
                </Grid2>
                <Grid2 size={6}>
                    <TextField
                        select
                        label="Category"
                        name="categoryID"
                        value={giftShopItem.categoryID}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{shrink: true}}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.categoryID} value={category.categoryID}>
                                {category.title}
                            </MenuItem>)
                        )}
                    </TextField>
                </Grid2>
                <Button variant="contained" color="primary" type="submit" sx={{mt: 3}}>
                    {giftShopItemID ? 'Update Gift Shop Item' : 'Create Gift Shop Item'}
                </Button>
            </form>
        </Container>
    );
};

export default GiftShopItemForm;
