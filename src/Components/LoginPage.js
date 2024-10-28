import React, { useState } from 'react';
import {Button, TextField, Grid2, Box, Link} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const LoginPage = () => {
    const { setAuth } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent page refresh

        try {
            const response = await axios.post('/user/login', { username, password });

            if (response.data) {
                const { userId, role } = response.data;
                setAuth({ userId, role });
                setUsername('');
                setPassword('');
                if (role === 'customer') {
                    navigate('/customerhome');
                } else if (role === 'admin') {
                    navigate('/adminhome');
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
    };

    return (
        <Box  display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh">
            <Grid2 container
                   spacing={2}
            >
                <Grid2 size={12} style={{textAlign: "center"}}>
                    Login
                </Grid2>
                <Grid2 size={12} style={{textAlign: "center"}}>
                    <TextField
                       id="username-text-field"
                       label="Username"
                       variant="outlined"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                    />
                </Grid2>
                <Grid2 size={12} style={{textAlign: "center"}}>
                    <TextField
                        id="password-text-field"
                        sx={{color: "white"}}
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Grid2>
                <Grid2 size={12} style={{textAlign: "center"}}>
                    <Button
                        variant="contained"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Grid2>
                <Grid2 size={6} style={{textAlign: "right"}}>
                    <h6>Need an account?</h6>
                </Grid2>
                <Grid2 size={6} style={{textAlign: "left"}}>
                    <Link href="/register" color="inherit">
                        <h6>Register</h6>
                    </Link>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default LoginPage;