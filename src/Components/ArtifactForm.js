import React, {useState, useEffect} from 'react';
import {TextField, Button, Container, Typography, Grid2, MenuItem} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';


const ArtifactForm = ({artifactID, setSelectedArtifactID}) => {
    const [artifact, setArtifact] = useState({
        title: '',
        creator: '',
        description: '',
        dateCreated: '',
        imageURL: '',
        acquiredDate: '',
        artifactStatusID: '',
        dimension: '',
        material: '',
        owner: '',
        location: {
            building: '',
            floor: '',
            section: '',
        }
    });

    useEffect(() => {
        const fetchArtifactData = async () => {
            if (artifactID) {
                try {
                    const response = await axios.get(`/artifacts/${artifactID}`);
                    setArtifact({
                        title: response.data.title || '',
                        creator: response.data.creator || '',
                        description: response.data.description || '',
                        dateCreated: response.data.dateCreated || '',
                        imageURL: response.data.imageURL || '',
                        acquiredDate: response.data.acquiredDate || '',
                        artifactStatusID: response.data.artifactStatusID || '',
                        dimension: response.data.dimension || '',
                        material: response.data.material || '',
                        owner: response.data.owner || '',
                        location: {
                            building: response.data.location.building || '',
                            floor: response.data.location.floor || '',
                            section: response.data.location.section || '',
                        }
                    });
                } catch (error) {
                    console.error('Error fetching Artifact data:', error);
                }
            } else {
                setArtifact({
                    title: '',
                    creator: '',
                    description: '',
                    dateCreated: '',
                    imageURL: '',
                    acquiredDate: '',
                    artifactStatusID: '',
                    dimension: '',
                    material: '',
                    owner: '',
                    location: {
                        building: '',
                        floor: '',
                        section: '',
                    }
                });
            }
        };
        fetchArtifactData();
    }, [artifactID]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name in artifact.location) {
            setArtifact(prev => ({
                ...prev,
                location: {...prev.location, [name]: value}
            }));
        } else {
            setArtifact({...artifact, [name]: value});
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...artifact,
                location: artifact.location
            };

            if (artifactID) {
                // Update existing artifacts
                await axios.put(`/artifacts/${artifactID}`, dataToSend);
                alert('Artifact updated successfully!');
            } else {
                // Create new Artifact
                await axios.post('/artifacts', dataToSend);
                alert('Artifact created successfully!');
            }
            setSelectedArtifactID(null); // Reset selected Artifact
        } catch (error) {
            console.error('Error saving Artifact:', error);
            alert('Failed to save Artifact');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {artifactID ? 'Edit Artifact' : 'Artifact Form'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    {/* Artifact Details */}
                    <Grid2 item size={6}>
                        <TextField
                            label="title"
                            name="title"
                            value={artifact.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="creator"
                            name="creator"
                            value={artifact.creator}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            label="description"
                            name="description"
                            value={artifact.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="dateCreated"
                            name="dateCreated"
                            type="date"
                            value={artifact.dateCreated ? format(new Date(artifact.dateCreated), 'yyyy-MM-dd') : ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Image URL"
                            name="imageURL"
                            value={artifact.imageURL}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="acquiredDate"
                            name="acquiredDate"
                            type="date"
                            value={artifact.acquiredDate ? format(new Date(artifact.acquiredDate), 'yyyy-MM-dd') : ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="dimension"
                            name="dimension"
                            value={artifact.dimension}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="material"
                            name="material"
                            value={artifact.material}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="owner"
                            name="owner"
                            value={artifact.owner}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            select
                            label="artifactStatusID"
                            name="artifactStatusID"
                            value={artifact.artifactStatusID}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            <MenuItem key={1} value={1}>
                                On Display
                            </MenuItem>
                            <MenuItem key={2} value={2}>
                                In Storage
                            </MenuItem>
                            <MenuItem key={3} value={3}>
                                On Loan
                            </MenuItem>
                            <MenuItem key={4} value={4}>
                                Under Conservation
                            </MenuItem>
                            <MenuItem key={5} value={5}>
                                Returned
                            </MenuItem>
                            <MenuItem key={6} value={6}>
                                Deaccessioned
                            </MenuItem>
                        </TextField>
                    </Grid2>
                    <Grid2 item size={12}>
                        <Typography variant="h6">Location</Typography>
                    </Grid2>
                    <Grid2 item size={12}>
                        <TextField
                            label="Building"
                            name="building"
                            value={artifact.location.building}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="floor"
                            name="floor"
                            value={artifact.location.floor}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <TextField
                            label="section"
                            name="section"
                            value={artifact.location.section}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid2>
                </Grid2>
                <Button variant="contained" color="primary" type="submit" sx={{mt: 2}}>
                    {artifactID ? 'Update Artifact' : 'Submit'}
                </Button>
            </form>
        </Container>
    );
};


export default ArtifactForm;
