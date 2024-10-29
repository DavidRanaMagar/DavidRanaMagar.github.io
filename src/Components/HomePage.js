import React from 'react';
import { Box, Container, Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';

const HomePage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* Introduction Section */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    You Are Not Signed In
                </Typography>
                <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                    You can log in from the top right corner. Also, navigate home by clicking the logo on the top left.
                </Typography>
            </Box>
        </Container>
    );
};

export default HomePage;
