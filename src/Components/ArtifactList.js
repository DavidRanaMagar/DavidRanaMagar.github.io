import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Container,
    IconButton,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ArtifactForm from "./ArtifactForm";

const ArtifactList = () => {
    const [artifacts, setArtifacts] = useState([]);
    const [selectedArtifactID, setSelectedArtifactID] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // Track create mode

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const response = await axios.get('/artifacts');
                setArtifacts(response.data);
            } catch (err) {
                console.error('Error fetching artifact data:', err);
            }
        };
        fetchArtifacts();
    }, []);

    // Open form for editing
    const handleRowClick = (artifactID) => {
        setSelectedArtifactID(artifactID);
        setIsCreating(false); // Disable create mode when editing
    };

    // Open form for creating new artifact
    const handleCreateArtifact = () => {
        setSelectedArtifactID(null);
        setIsCreating(true); // Enable create mode
    };

    // Clear selection and close form
    const clearSelection = () => {
        setSelectedArtifactID(null);
        setIsCreating(false); // Exit create mode when form is closed
    };

    const handleDelete = async (artifactID) => {
        if (window.confirm('Are you sure you want to delete this artifact?')) {
            try {
                await axios.delete(`/artifacts/${artifactID}`);
                setArtifacts(artifacts.filter(artifact => artifact.artifactID !== artifactID));
                alert('Artifact deleted successfully!');
            } catch (err) {
                console.error('Error deleting artifact:', err);
                alert('Failed to delete artifact');
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Artifact Information
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateArtifact}>
                    Create New Artifact
                </Button>
            </Box>
            {!selectedArtifactID && !isCreating ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">Artifact ID</Typography></TableCell>
                                <TableCell><Typography variant="h6">Title</Typography></TableCell>
                                <TableCell><Typography variant="h6">Creator</Typography></TableCell>
                                <TableCell><Typography variant="h6">Artifact Status</Typography></TableCell>
                                <TableCell><Typography variant="h6">Owner</Typography></TableCell>
                                <TableCell><Typography variant="h6">Action</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {artifacts.map((artifact) => (
                                <TableRow key={artifact.artifactID} hover>
                                    <TableCell>{artifact.artifactID}</TableCell>
                                    <TableCell>{artifact.title}</TableCell>
                                    <TableCell>{artifact.creator}</TableCell>
                                    <TableCell>{artifact.artifactStatusID}</TableCell>
                                    <TableCell>{artifact.owner}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleRowClick(artifact.artifactID)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(artifact.artifactID)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection}
                            style={{marginBottom: '10px'}}>
                        Back to List
                    </Button>
                    <ArtifactForm
                        artifactID={selectedArtifactID}
                        setSelectedArtifactID={setSelectedArtifactID}
                        clearSelection={clearSelection}
                        isCreating={isCreating} // Pass down create mode status
                    />
                </>
            )}
        </Container>
    );
};

export default ArtifactList;
