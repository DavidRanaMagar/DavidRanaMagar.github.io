import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Container, Button, Snackbar, Alert } from '@mui/material';
import axios from "axios";

function Product({ addToCart }) {  // Receive addToCart as a prop
    const [products, setProducts] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar visibility state
    const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message state

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/giftShopItem');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);  // Add the product to the cart
        setSnackbarMessage(`${product.title} has been added to your cart!`);  // Set the message
        setOpenSnackbar(true);  // Show the snackbar
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);  // Hide the snackbar
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ padding: '20px' }}>
                {products.map((product) => (
                    <Grid item xs={3} key={product.giftShopItemID}>
                        <Card sx={{ width: '100%', maxWidth: 300, height: 350, display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={'https://mfashop.mfah.org/cdn/shop/files/True_Lobster_Brooch_Pin_TL_1080x_b37ebec6-c0ad-47af-8837-b026bad0bb2c_900x.jpg?v=1721254860'}
                                alt={product.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                {/* Truncate long title */}
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                    {product.title}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToCart(product)}  // Call the handler here
                                sx={{ margin: '10px' }}  // Add some margin around the button for spacing
                            >
                                Add to Cart
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Snackbar for notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}  // Snackbar will auto-hide after 3 seconds
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Product;
