import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container, Drawer, IconButton, List, ListItem, ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import axios from '../api/axios';
import DeleteIcon from "@mui/icons-material/Delete";
import ExhibitionForm from "./ExhibitionForm";

const ExhibitionList = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [locationConversions, setLocationConversions] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedArtifacts, setSelectedArtifacts] = useState([]);

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const response = await axios.get('/exhibition');
                setExhibitions(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        }

        const fetchLocations = async () => {
            try {
                const response = await axios.get('/location');

                setLocationConversions(Object.fromEntries(
                    response.data.map(location => [location.locationID, `${location.building} : ${location.floor} : ${location.section}`])
                ));
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchExhibitions();
        fetchLocations();
    }, [refreshTrigger])

    const handleCreateExhibition = () => {
        setIsCreating(true);
    }

    const handleBackButton = () => {
        setIsCreating(false);
        setRefreshTrigger(!refreshTrigger);
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleDelete = async (exhibitionID) => {
        if (window.confirm('Are you sure you want to delete this exhibition?')) {
            try {
                await axios.delete(`/exhibition/${exhibitionID}`);
                setExhibitions(exhibitions.filter(exhibition => exhibition.exhibitionID !== exhibitionID));
                alert('Exhibition deleted successfully!');
            } catch (err) {
                console.error('Error deleting exhibition:', err);
                alert('Failed to delete exhibition');
            }
        }
    }

    const handleRowClick = async (exhibitionID) => {
        // Fetch artifacts for this exhibition
        const response = await axios.get(`/exhibition/${exhibitionID}/artifacts`);
        console.log(response.data)
        setSelectedArtifacts(response.data);
        setIsDrawerOpen(true);
    };

    return (
        <Container maxWidth="lg" mb={4}>
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Exhibition Information
                </Typography>
            </Box>
            {!isCreating ? (
                <Container maxWidth="lg">
                    <Box  mb={4} display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <Button variant="contained" color="primary" onClick={handleCreateExhibition}>
                            Create New Exhibition
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="h6">Title</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Artist</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Start Date</Typography></TableCell>
                                    <TableCell><Typography variant="h6">End Date</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Location</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exhibitions.map((exhibition) => (
                                    <TableRow key={exhibition.exhibitionID} onClick={() => handleRowClick(exhibition.exhibitionID)}>
                                        <TableCell>{exhibition.title}</TableCell>
                                        <TableCell>{exhibition.artist}</TableCell>
                                        <TableCell>
                                            {new Date(exhibition.startDate).toLocaleDateString("en-US", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric"
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(exhibition.endDate).toLocaleDateString("en-US", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric"
                                            })}
                                        </TableCell>
                                        <TableCell>{locationConversions[exhibition.locationID]}</TableCell>
                                        <TableCell>
                                            <IconButton color="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(exhibition.exhibitionID);
                                                        }}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
                        <Box width={300}>
                            <Typography variant="h6" style={{ padding: '16px' }}>Artifacts</Typography>
                            <List>
                                {selectedArtifacts.map(artifact => (
                                    <ListItem key={artifact.artifactID}>
                                        <ListItemText primary={artifact.title} secondary={artifact.creator} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Container>
            ) : (
                <Container maxWidth="lg">
                    <Box  mb={4} display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleBackButton}>
                            Back to List
                        </Button>
                    </Box>
                    <ExhibitionForm/>
                </Container>
            )}
        </Container>
    );
};

export default ExhibitionList;
