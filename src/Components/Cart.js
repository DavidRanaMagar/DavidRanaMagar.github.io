import React, {useState, useEffect} from 'react';
import {Container, Typography, Card, CardContent, Grid, Button, IconButton, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useAuth from "../hooks/useAuth";
import {useNavigate} from 'react-router-dom';
import axios from "../api/axios";

function Cart({cartItems, removeFromCart, updateCartQuantity, setCartItems}) {
    const navigate = useNavigate();
    const {auth} = useAuth();
    const [customerID, setCustomerID] = useState(null);
    // Handle back button click
    const handleBackButtonClick = () => {
        navigate(-1);  // Navigates back to the previous page in the history stack
    };

    // Calculate the total price of items in the cart
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2); // Accumulate total price considering quantity

    // Handle quantity increase and decrease
    const handleIncreaseQuantity = (itemId) => {
        updateCartQuantity(itemId, 'increase');
        console.log(auth);
    };

    const handleDecreaseQuantity = (itemId) => {
        updateCartQuantity(itemId, 'decrease');
    };
    useEffect(() => {
        console.log(auth);
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

    const handleBuyClick = async (e) => {
        e.preventDefault();
        console.log(customerID);
        try {
            const today = new Date();
            const saleResponse = await axios.post('/sale', {
                totalPrice: total,
                createdBy: 'online user',
                updatedBy: 'online user',
                employeeID: '163' //163 is the fake employee placeholder for online purchase
            });

            const saleID = saleResponse.data.saleID;

            await Promise.all(
                cartItems.map(item =>
                    axios.post('/saleGiftShopItem', {
                        saleID: saleID,
                        giftShopItemID: item.giftShopItemID,
                        quantity: item.quantity,
                        createdBy: 'online user',
                        updatedBy: 'online user'
                    })
                )
            );

            await axios.post('/saleTransaction', {
                customerID: customerID,
                transactionAmount: total,
                paymentMethod: 'Credit Card',
                transactionDate: today,
                saleID: saleID,
                createdBy: 'online user',
                updatedBy: 'online user'
            });

            setCartItems([]);
            alert('Your Items were successfully ordered!');
        } catch (error) {
            console.error("Error placing the order:", error);
            alert('An error occurred placing order.');
        }
    };

    return (
        <Container maxWidth="md" sx={{paddingTop: '20px'}}>
            {/* Back Button */}
            <Button variant="contained" color="secondary" onClick={handleBackButtonClick} sx={{marginBottom: '20px'}}>
                Back
            </Button>

            <Typography variant="h4" gutterBottom>Shopping Cart</Typography>

            {cartItems.length === 0 ? (
                <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {cartItems.map((item) => (
                        <Grid item xs={12} key={item.giftShopItemID}>
                            <Card sx={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
                                <CardContent>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography variant="h5">${item.price}</Typography>
                                    <Typography
                                        variant="body1">Quantity: {item.quantity}</Typography> {/* Display the quantity */}
                                </CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <IconButton onClick={() => handleDecreaseQuantity(item.giftShopItemID)}
                                                disabled={item.quantity === 1}>
                                        <RemoveIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleIncreaseQuantity(item.giftShopItemID)}>
                                        <AddIcon/>
                                    </IconButton>
                                    <Button variant="contained" color="secondary"
                                            onClick={() => removeFromCart(item.giftShopItemID)}>
                                        Remove
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Display total price */}
            {cartItems.length > 0 && (
                <Typography variant="h5" sx={{marginTop: '20px', textAlign: 'right'}}>
                    Total: ${total}
                </Typography>
            )}

            {/* Buy Button */}
            {cartItems.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{marginTop: '20px', width: '100%'}}
                    onClick={handleBuyClick}
                >
                    Buy
                </Button>
            )}
        </Container>
    );
}

export default Cart;
