import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import  useAuth  from '../hooks/useAuth.js'; // Import your custom useAuth hook
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

const Navbar = () => {
    const { auth, setAuth } = useAuth(); // Access setAuth from context
    const navigate = useNavigate(); // Use for navigation

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleHomeNavigation = () => {
        if (auth.role === 'customer') {
            navigate('/customerhome');
        } else if (auth.role === 'admin') {
            navigate('/adminhome');
        }
        else if (auth.role === 'staff') {
            navigate('/staffhome');
        }
        else if (auth.role === 'manager') {
            navigate('/managerhome');
        }
        else if (auth.role === 'curator') {
            navigate('/curatorhome');
        }
        else if (auth.role === 'collectionManager') {
            navigate('/collectionhome');
        }
        else if (auth.role === 'inventoryManager') {
            navigate('/inventoryhome');
        }
    };

    const handleLogout = () => {
        setAuth({});
        navigate('/login');
    };

    const handleLogin = () => navigate('/login');

    const settings = auth.userId?
        [ { label: 'Logout', action: handleLogout } ] // Logged in items
        : [ { label: 'Login', action: handleLogin } ]; // Logged out items

    // cart
    const getCartItemCount = () => {
        const savedCartItems = localStorage.getItem('cartItems');
        const cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];
        return cartItems.length;
    };

    const cartItemCount = getCartItemCount(); // Get the number of items in the cart

    const handleCartClick = () => {
        // Navigate to the cart page or open a cart modal
        navigate('/cart');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        onClick={handleHomeNavigation}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        MFAH
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ flexGrow: 0 }}>
                        {auth.userId && (
                            <IconButton
                                onClick={handleCartClick}
                                sx={{ p: 0, marginRight: 2 }}
                            >
                                <Badge
                                    badgeContent={cartItemCount}
                                    color="error"
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        )}
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((item) => (
                                <MenuItem
                                    key={item.label}
                                    onClick={() => {
                                        handleCloseUserMenu();
                                        item.action(); // Execute the action
                                    }}
                                >
                                    <Typography textAlign="center">{item.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;