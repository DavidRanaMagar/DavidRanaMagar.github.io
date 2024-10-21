import React, { useState } from 'react';
import {Button, TextField, Grid2, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const LoginPage = () => {
    const { setAuth } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent page refresh

        try {
            const response = await axios.post('/user/login', { username, password });

            if (response.data) {
                const { userId, role } = response.data;
                setAuth({ userId, role });

                if (role === 'customer') {
                    navigate('/customer');
                } else if (role === 'admin') {
                    navigate('/admin');
                } else {
                    alert('Could not find role');
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
            </Grid2>
        </Box>
    );
};

export default LoginPage;