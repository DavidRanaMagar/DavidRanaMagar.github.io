import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Grid2, MenuItem} from '@mui/material';
import axios from 'axios';

const ExhibitionForm = () => {
    const [locations, setLocations] = useState([])
    const [exhibition, setExhibition] = useState({
        title: '',
        startDate: '',
        endDate: '',
        timeSlot: '',
        locationId: '',
        artist: '',
        createdBy: 'curator',
        updatedBy: 'curator'
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('/location');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations.', error);
            }
        }

        fetchLocations()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <Container maxWidth={'sm'}>
            <Typography mb={4} variant='h4' gutterBottom>
                Create Exhibition
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <TextField
                            label='Title'
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, title: e.target.value})}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label='Start Date'
                            type='date'
                            InputLabelProps={{ shrink: true }}
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, startDate: e.target.value})}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label='End Date'
                            type='date'
                            InputLabelProps={{ shrink: true }}
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, endDate: e.target.value})}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label='Time Slot'
                            type='time'
                            InputLabelProps={{ shrink: true }}
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, timeSLot: e.target.value})}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label='Artist'
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, artist: e.target.value})}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            select
                            label='Location'
                            value={exhibition.title}
                            onChange={(e) => setExhibition({...exhibition, artist: e.target.value})}
                            fullWidth
                            required
                        >
                            {locations.map((location) => (
                                <MenuItem>
                                    {location.building} : {location.floor} : {location.section}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                </Grid2>
            </form>
        </Container>
    )
}

export default ExhibitionForm;