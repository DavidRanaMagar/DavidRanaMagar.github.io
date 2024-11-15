import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import axios from '../api/axios';

const CustomerExhibition = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [locationConversions, setLocationConversions] = useState({});

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const response = await axios.post('/exhibition/date', {
                    date: new Date(),
                });
                setExhibitions(response.data);
            } catch (error) {
                console.error('Error fetching exhibition data:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get('/location');
                setLocationConversions(Object.fromEntries(
                    response.data.map(location => [
                        location.locationID,
                        `${location.building} : ${location.floor} : ${location.section}`
                    ])
                ));
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchExhibitions();
        fetchLocations();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Currently Available Exhibitions
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Explore upcoming and current exhibitions
                </Typography>
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
                            <TableRow key={exhibition.exhibitionID}>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CustomerExhibition;
