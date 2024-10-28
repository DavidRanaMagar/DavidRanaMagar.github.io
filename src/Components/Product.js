import React, {useEffect, useState} from 'react';
import {Card, CardMedia, CardContent, Typography, Grid2, Container} from '@mui/material';
import axios from "axios";

function Product() {
    const [products, setProducts] = useState([]);

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

    return (
        <Container maxWidth="lg">
            <Grid2 container spacing={2} sx={{padding: '20px'}}>
                {products.map((product) => (
                    <Grid2 size={3} key={product.giftShopItemID}>
                        <Card sx={{width: '100%', maxWidth: 300, height: 320, textAlign: 'center'}}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={'https://mfashop.mfah.org/cdn/shop/files/True_Lobster_Brooch_Pin_TL_1080x_b37ebec6-c0ad-47af-8837-b026bad0bb2c_900x.jpg?v=1721254860'}
                                alt={product.title}
                                sx={{objectFit: 'cover'}}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {product.title}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Container>
    );
}

export default Product;
