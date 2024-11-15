import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Grid2 } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from '../api/axios';

const ExhibitionForm = () => {
    const [locations, setLocations] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [selectedArtifacts, setSelectedArtifacts] = useState([]);
    const [exhibition, setExhibition] = useState({
        title: '',
        startDate: '',
        endDate: '',
        locationID: '',
        artist: '',
        createdBy: 'curator',
        updatedBy: 'curator',
    });

    useEffect(() => {
        const fetchLocations = async () => {
                try {
                    const response = await axios.get('/location');

                    setLocations(response.data);
                } catch (error) {
                    console.error('Error fetching locations:', error);
                }
        };

        const fetchArtifacts = async () => {
            try {
                const response = await axios.post('/artifacts/available', {
                        startDate: exhibition.startDate,
                        endDate: exhibition.endDate
                    });

                setArtifacts(response.data);
            } catch (error) {
                console.error('Error fetching artifacts:', error);
            }
        };

        fetchLocations();
        fetchArtifacts();
    }, [exhibition.startDate, exhibition.endDate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startDate = new Date(exhibition.startDate);
        const endDate = new Date(exhibition.endDate);

        if (startDate > endDate) {
            alert("Please choose a valid date range.")
            return;
        }

        const exhibitionData = {
            ...exhibition,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            const exhibitionResponse = await axios.post('/exhibition', exhibitionData);

            await Promise.all(selectedArtifacts.map(async (artifactID) => {
                const exhibitionArtifactData = {
                    exhibitionID: exhibitionResponse.data.exhibitionID,
                    artifactID: artifactID,
                    createdBy: 'curator',
                    updatedBy: 'curator',
                };

                await axios.post('/artifactsExhibition', exhibitionArtifactData);
            }));

            setExhibition({
                title: '',
                startDate: '',
                endDate: '',
                locationID: '',
                artist: '',
                createdBy: 'curator',
                updatedBy: 'curator',
            })

            alert('Exhibition created successfully!');
        } catch (error) {
            console.error('Error creating exhibition:', error);
            alert('Failed to create exhibition!');
        }
    };

    const artifactColumns = [
        { field: 'artifactID', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'creator', headerName: 'Artist', width: 150 },
        { field: 'material', headerName: 'Material', width: 130 },
        { field: 'dimension', headerName: 'Dimensions', width: 150 },
        { field: 'dateCreated', headerName: 'Date', width: 120},
    ];

    return (
        <Container maxWidth="md">
            <Typography mb={4} variant="h4" gutterBottom>
                Create Exhibition
            </Typography>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Enter Exhibition Details
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <TextField
                            label="Title"
                            value={exhibition.title}
                            onChange={(e) =>
                                setExhibition({ ...exhibition, title: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Artist"
                            value={exhibition.artist}
                            onChange={(e) =>
                                setExhibition({ ...exhibition, artist: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exhibition.startDate}
                            onChange={(e) =>
                                setExhibition({ ...exhibition, startDate: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exhibition.endDate}
                            onChange={(e) =>
                                setExhibition({ ...exhibition, endDate: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            select
                            label="Location"
                            value={exhibition.locationID}
                            onChange={(e) => {
                                setExhibition({ ...exhibition, locationID: e.target.value });
                            }}
                            fullWidth
                            required
                        >
                            {locations.map((location) => (
                                <MenuItem key={location.locationID} value={location.locationID}>
                                    {`${location.building} : ${location.floor} : ${location.section}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant="h6" gutterBottom>
                            Select Artifacts
                        </Typography>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={artifacts}
                                columns={artifactColumns}
                                pageSize={5}
                                checkboxSelection
                                onRowSelectionModelChange={(ids) => setSelectedArtifacts(ids)}
                                getRowId={(row) => row.artifactID}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Exhibition
                        </Button>
                    </Grid2>
                </Grid2>
            </form>
        </Container>
    );
};

export default ExhibitionForm;