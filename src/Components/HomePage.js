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
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 4, borderRadius: '20px', px: 5 }}
                >
                    Plan Your Visit
                </Button>
            </Box>

            {/* Highlighted Exhibitions Section */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
                    Current Exhibitions
                </Typography>
                <Grid container spacing={4}>
                    {/* Exhibition 1 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image="" 
                                alt="Contemporary Art"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Contemporary Visions
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    A curated selection of modern artworks that challenge perceptions and inspire.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Exhibition 2 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image="" 
                                alt="Classical Masterpieces"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Classical Masterpieces
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Step into the golden age of classical art and witness the beauty of timeless pieces.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Exhibition 3 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image="" 
                                alt="Sculptures"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Sculptures in Space
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Discover our collection of captivating sculptures that embody form and movement.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Call to Action Section */}
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Become a Member
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Join our community and gain exclusive access to exhibitions and events.
                </Typography>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ borderRadius: '20px', px: 5, py: 1.5 }}
                >
                    Learn More
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;
