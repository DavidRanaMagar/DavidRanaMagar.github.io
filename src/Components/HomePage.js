import React from 'react';
import Slider from 'react-slick';
import { Box, Container, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

// Keyframe for fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomePage = () => {
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        fade: true,
        arrows: false,
    };

    const images = [
        "https://images.unsplash.com/photo-1577471486886-1e34bbae345f?fm=jpg&q=60&w=3000",
        "https://images.alphacoders.com/134/1349373.png",
        "https://images5.alphacoders.com/136/thumb-1920-1368361.png",
        "https://images.unsplash.com/photo-1480497490787-505ec076689f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
        "https://wallpapers.com/images/hd/4k-astronaut-with-planet-earth-and-mars-k46pmvzys5b487lj.jpg",
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                color: 'white',
            }}
        >
            <Slider {...settings}>
                {images.map((url, index) => (
                    <Box
                        key={index}
                        sx={{
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100vw',
                            height: '100vh',
                        }}
                    />
                ))}
            </Slider>
            <Container
                maxWidth="md"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: 2,
                    animation: `${fadeIn} 1s ease-in-out`,
                }}
            >
                <Box>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                        Welcome to the Museum of Fine Arts, Houston
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#b0b0b0', mt: 2 }}>
                        Experience art, culture, and history. You are currently not signed in.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9e9e9e', mt: 1 }}>
                        Log in by clicking the top right corner, or navigate home by clicking our logo in the top left.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
