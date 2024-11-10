import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Container, Button } from '@mui/material';
import axios from 'axios';

function Product() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

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


    // add it to the cart and give an alert
    const handleBuy = (product) => {
        setCart((prevCart) => [...prevCart, product]);
        alert(`Added ${product.title} to cart!`);
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ padding: '20px' }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product.giftShopItemID}>
                        <Card sx={{ width: '100%', maxWidth: 300, height: 380, textAlign: 'center' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.imageUrl || 'https://via.placeholder.com/300'}
                                alt={product.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {product.title}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    ${product.price}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleBuy(product)}
                                    sx={{ marginTop: '10px' }}
                                >
                                    Add To Cart
                                </Button>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'yellow',
                    borderRadius: '50%',
                    padding: '15px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => alert('Go to cart!')} // insert the actual cart page here
            >
                <span
                    style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    🛒
                </span>
            </div>
        </Container>
    );
}

export default Product;
