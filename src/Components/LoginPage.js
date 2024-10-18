import React, { useState, useEffect } from 'react';
import {Button, TextField, Grid2, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const LoginPage = () => {
    const { setAuth } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/user');
                setUsers(response.data);  // Store users in state
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        const user = users.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {

            const role = user.role;
            setAuth({user, username, password, role})

            if (user.role === 0) {
                navigate('/customer');
            } else if (user.role === 1) {
                navigate('/admin');
            }
        } else {
            alert('Invalid username or password');
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